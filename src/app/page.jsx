
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Fotbar from "@/components/Fotbar";
import TopBar from "@/components/TopBar";
import RoomScene from "@/components/RoomScene";
import SettingsModal from "@/components/SettingsModal";
import SkinPickerModal from "@/components/SkinPickerModal";

import usePetController from "@/hooks/usePetController";

import {
  ROOMS,
  DEFAULT_CONFIG,
} from "@/constants/gameConfig";

import { INITIAL_COINS } from "@/services/moneyService";

const SKIN_PRICE = 5;

export default function Home() {
  // Navegação dos cômodos
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // Aparência do pet
  const [selectedSkinColor, setSelectedSkinColor] =
    useState("bg-[#2f80ed]");

  // Skins desbloqueadas
  const [unlockedSkins, setUnlockedSkins] = useState(["blue"]);

  // Configurações físicas
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Painéis
  const [activePanel, setActivePanel] = useState(null);

  // Transição entre cômodos
  const [isFading, setIsFading] = useState(false);
  const roomChangeTimeout = useRef(null);
  const fadeTimeout = useRef(null);

  // Moedas
  const [coins, setCoins] = useState(INITIAL_COINS);

  // Interações
  const [interactionKey, setInteractionKey] = useState(0);
  const [roomMessage, setRoomMessage] = useState("");

  // Iluminação
  const [lightsOff, setLightsOff] = useState(false);

  // Arraste da bolinha
  const [isDraggingBall, setIsDraggingBall] = useState(false);
  const [ballDragPosition, setBallDragPosition] = useState(null);

  const room = ROOMS[currentRoomIndex];

  // Controle do pet
  const {
    roomViewportRef,
    petRef,
    handleStartDrag,
    handleMovePet,
    handleStopDrag,
  } = usePetController(config);

  // Limpeza dos temporizadores
  useEffect(() => {
    return () => {
      clearTimeout(roomChangeTimeout.current);
      clearTimeout(fadeTimeout.current);
    };
  }, []);

  // Ganhar moedas ao clicar no pet
  const handlePetClick = useCallback(() => {
    setCoins((currentCoins) => currentCoins + 1);
  }, []);

  // Comprar ou selecionar uma skin
  const handleBuySkin = useCallback((skin) => {
    if (!skin?.id || !skin?.color) return;

    if (unlockedSkins.includes(skin.id)) {
      setSelectedSkinColor(skin.color);
      return;
    }

    if (coins < SKIN_PRICE) return;

    setCoins((currentCoins) => currentCoins - SKIN_PRICE);

    setUnlockedSkins((previous) => {
      if (previous.includes(skin.id)) return previous;
      return [...previous, skin.id];
    });

    setSelectedSkinColor(skin.color);
  }, [coins, unlockedSkins]);

  // Utensílios dos cômodos
  const handleToolUse = useCallback((tool) => {
    if (!tool?.id) return;

    setInteractionKey((previous) => previous + 1);

    switch (tool.id) {
      case "ball":
        // A bolinha será controlada pelo arraste.
        break;

      case "food":
        setRoomMessage("Seu pet está comendo! 🍖");
        break;

      case "soap":
        setRoomMessage("Hora do banho! 🧼");
        break;

      case "lamp":
        setLightsOff((previous) => {
          const nextValue = !previous;

          setRoomMessage(
            nextValue
              ? "Boa noite! A luz foi apagada. 🌙"
              : "A luz foi acesa! 💡"
          );

          return nextValue;
        });
        break;

      default:
        setRoomMessage("");
    }
  }, []);

  // Inicia o arraste da bolinha na barra superior
  const handleBallDragStart = useCallback((event, tool) => {
    if (room?.id !== "sala" || tool?.id !== "ball") return;

    setIsDraggingBall(true);

    setBallDragPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setRoomMessage("");
  }, [room]);

  // Acompanha o ponteiro durante o arraste
  useEffect(() => {
    if (!isDraggingBall) return;

    function handlePointerMove(event) {
      setBallDragPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }

    function handlePointerUp(event) {
      const viewport = roomViewportRef.current;

      if (viewport) {
        const rect = viewport.getBoundingClientRect();

        const droppedInsideRoom =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (droppedInsideRoom) {
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          setBallDragPosition(null);
          setIsDraggingBall(false);

          // A posição será usada pela cena para posicionar a bolinha.
          setDroppedBall({
            x,
            y,
          });

          setRoomMessage("A bolinha caiu no cômodo! ⚽");
          return;
        }
      }

      // Se soltar fora do cômodo, cancela o arraste.
      setIsDraggingBall(false);
      setBallDragPosition(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingBall, roomViewportRef]);

  // Posição da bolinha depois de solta
  const [droppedBall, setDroppedBall] = useState(null);

  // Painéis
  const openConfig = () => setActivePanel("config");
  const openSkins = () => setActivePanel("skins");
  const closePanel = () => setActivePanel(null);

  // Troca de cômodos
  const handleRoomChange = (direction) => {
    if (isFading) return;

    setIsFading(true);
    setRoomMessage("");
    setLightsOff(false);
    setDroppedBall(null);
    setIsDraggingBall(false);
    setBallDragPosition(null);

    roomChangeTimeout.current = setTimeout(() => {
      setCurrentRoomIndex((previous) => {
        if (direction === "next") {
          return (previous + 1) % ROOMS.length;
        }

        return (previous - 1 + ROOMS.length) % ROOMS.length;
      });

      fadeTimeout.current = setTimeout(() => {
        setIsFading(false);
      }, 300);
    }, 300);
  };

  return (
    <main
      className="relative flex flex-col w-full h-[100dvh] overflow-hidden select-none"
      style={{
        backgroundColor: room.wallColor,
      }}
    >
      {/* Barra superior */}
      <TopBar
        room={room}
        coins={coins}
        onOpenConfig={openConfig}
        onOpenSkins={openSkins}
        onToolUse={handleToolUse}
        onBallDragStart={handleBallDragStart}
        roomMessage={roomMessage}
      />

      {/* Bolinha acompanhando o ponteiro */}
      {isDraggingBall && ballDragPosition && (
        <div
          className="fixed z-[100] pointer-events-none text-3xl"
          style={{
            left: ballDragPosition.x,
            top: ballDragPosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          ⚽
        </div>
      )}

      {/* Cena e personagem */}
      <RoomScene
        room={room}
        petRef={petRef}
        roomViewportRef={roomViewportRef}
        selectedSkinColor={selectedSkinColor}
        handleStartDrag={handleStartDrag}
        handleMovePet={handleMovePet}
        handleStopDrag={handleStopDrag}
        onPetClick={handlePetClick}
        interactionKey={interactionKey}
        isFading={isFading}
        lightsOff={lightsOff}
        droppedBall={droppedBall}
      />

      {/* Navegação inferior */}
      <Fotbar
        onPrev={() => handleRoomChange("prev")}
        onNext={() => handleRoomChange("next")}
        roomName={room.name}
      />

      {/* Configurações */}
      {activePanel === "config" && (
        <SettingsModal
          config={config}
          setConfig={setConfig}
          onClose={closePanel}
        />
      )}

      {/* Loja de skins */}
      {activePanel === "skins" && (
        <SkinPickerModal
          selectedSkinColor={selectedSkinColor}
          setSelectedSkinColor={setSelectedSkinColor}
          unlockedSkins={unlockedSkins}
          coins={coins}
          onBuySkin={handleBuySkin}
          onClose={closePanel}
        />
      )}
    </main>
  );
}
