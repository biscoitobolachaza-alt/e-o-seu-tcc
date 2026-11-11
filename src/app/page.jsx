
"use client";

import { useState } from "react";

import Fotbar from "@/components/Fotbar";
import TopControls from "@/components/TopControls";
import RoomScene from "@/components/RoomScene";
import SettingsModal from "@/components/SettingsModal";
import SkinPickerModal from "@/components/SkinPickerModal";

import usePetController from "@/hooks/usePetController";

import {
  ROOMS,
  DEFAULT_CONFIG,
} from "@/constants/gameConfig";

export default function Home() {
  // Navegação dos cômodos
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // Aparência do personagem
  const [selectedSkinColor, setSelectedSkinColor] =
    useState("bg-[#2f80ed]");

  // Configurações físicas
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Apenas um painel pode ficar aberto por vez
  const [activePanel, setActivePanel] = useState(null);

  // Transição entre cômodos
  const [isFading, setIsFading] = useState(false);

  const room = ROOMS[currentRoomIndex];

  // Controle do personagem
  const {
    roomViewportRef,
    petRef,
    handleStartDrag,
    handleMovePet,
    handleStopDrag,
  } = usePetController(config);

  // Abrir configurações
  const openConfig = () => {
    setActivePanel("config");
  };

  // Abrir seleção de cores
  const openSkins = () => {
    setActivePanel("skins");
  };

  // Fechar painel
  const closePanel = () => {
    setActivePanel(null);
  };

  // Trocar de cômodo
  const handleRoomChange = (direction) => {
    if (isFading) return;

    setIsFading(true);

    setTimeout(() => {
      setCurrentRoomIndex((previous) => {
        if (direction === "next") {
          return (previous + 1) % ROOMS.length;
        }

        return (
          previous - 1 + ROOMS.length
        ) % ROOMS.length;
      });

      setTimeout(() => {
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
      {/* Botões superiores */}
      <TopControls
        onOpenConfig={openConfig}
        onOpenSkins={openSkins}
      />

      {/* Cena do cômodo */}
      <RoomScene
        room={room}
        petRef={petRef}
        roomViewportRef={roomViewportRef}
        selectedSkinColor={selectedSkinColor}
        handleStartDrag={handleStartDrag}
        handleMovePet={handleMovePet}
        handleStopDrag={handleStopDrag}
        isFading={isFading}
      />

      {/* Barra inferior */}
      <Fotbar
        onPrev={() => handleRoomChange("prev")}
        onNext={() => handleRoomChange("next")}
        roomName={room.name}
      />

      {/* Painel de configurações */}
      {activePanel === "config" && (
        <SettingsModal
          config={config}
          setConfig={setConfig}
          onClose={closePanel}
        />
      )}

      {/* Painel de cores */}
      {activePanel === "skins" && (
        <SkinPickerModal
          selectedSkinColor={selectedSkinColor}
          setSelectedSkinColor={setSelectedSkinColor}
          onClose={closePanel}
        />
      )}
    </main>
  );
}
