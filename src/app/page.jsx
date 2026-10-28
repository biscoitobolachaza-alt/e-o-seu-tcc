"use client";

import { useState, useEffect, useRef } from "react";
import Fotbar from "@/components/Fotbar";

const ROOMS = [
  { id: "sala", name: "sala", wallBg: "bg-[#71dc4a]", floorBg: "bg-[#55b236]" },
  { id: "quarto", name: "quarto", wallBg: "bg-[#9d47e0]", floorBg: "bg-[#7231a6]" },
  { id: "cozinha", name: "cozinha", wallBg: "bg-[#f28e3b]", floorBg: "bg-[#c46d23]" },
  { id: "banheiro", name: "banheiro", wallBg: "bg-[#6ab2ff]", floorBg: "bg-[#3d8be6]" },
];

const SKINS = [
  { id: "blue", name: "Azul", color: "bg-[#2f80ed]" },
  { id: "green", name: "Verde", color: "bg-[#27ae60]" },
  { id: "red", name: "Vermelho", color: "bg-[#eb5757]" },
  { id: "yellow", name: "Amarelo", color: "bg-[#f2c94c]" },
  { id: "purple", name: "Roxo", color: "bg-[#9b51e0]" },
  { id: "pink", name: "Rosa", color: "bg-[#ff70a6]" },
  { id: "orange", name: "Laranja", color: "bg-[#f2994a]" },
  { id: "dark", name: "Escuro", color: "bg-[#333333]" },
  { id: "cyan", name: "Ciano", color: "bg-[#56ccf2]" },
  { id: "white", name: "Branco", color: "bg-[#f2f2f2]" },
];

export default function Home() {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedSkinColor, setSelectedSkinColor] = useState("bg-[#2f80ed]");

  const [showConfig, setShowConfig] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const [config, setConfig] = useState({
    canDrag: true,
    canClickEffect: true,
    gravityLevel: 1,
    canWalk: true,
  });

  const roomViewportRef = useRef(null);
  const petRef = useRef(null);
  const initializedRef = useRef(false);

  const state = useRef({
    x: 300,
    y: 200,
    velocityY: 0,
    isDragging: false,
    isClicking: false,
    isWalking: false,
    walkTargetX: 300,
    squishScaleY: 1,
    squishScaleX: 1,
  });

  const room = ROOMS[currentRoomIndex];

  const getFloorY = () => {
    if (!roomViewportRef.current || !petRef.current) return 300;
    const floorHeight = 110;
    return roomViewportRef.current.clientHeight - floorHeight - petRef.current.offsetHeight;
  };

  const updatePetDOM = () => {
    if (petRef.current) {
      petRef.current.style.left = `${state.current.x}px`;
      petRef.current.style.top = `${state.current.y}px`;
      petRef.current.style.transform = `scale(${state.current.squishScaleX}, ${state.current.squishScaleY})`;
    }
  };

  const triggerClickSquish = () => {
    if (!config.canClickEffect) return;
    state.current.squishScaleX = 1.35;
    state.current.squishScaleY = 0.65;
    updatePetDOM();
    setTimeout(() => {
      state.current.squishScaleX = 1;
      state.current.squishScaleY = 1;
      updatePetDOM();
    }, 180);
  };

  // Troca de cômodo com Fade In / Fade Out preto
  const handleRoomChange = (direction) => {
    if (isFading) return;
    setIsFading(true);

    setTimeout(() => {
      setCurrentRoomIndex((prev) => {
        if (direction === "next") {
          return (prev + 1) % ROOMS.length;
        } else {
          return (prev - 1 + ROOMS.length) % ROOMS.length;
        }
      });
      setTimeout(() => {
        setIsFading(false);
      }, 300);
    }, 300);
  };

  // Posicionamento inicial único do Pet ao carregar a página
  useEffect(() => {
    if (roomViewportRef.current && petRef.current && !initializedRef.current) {
      state.current.x = roomViewportRef.current.clientWidth / 2 - petRef.current.offsetWidth / 2;
      state.current.y = getFloorY();
      updatePetDOM();
      initializedRef.current = true;
    }
  }, []);

  // Game Loop principal (física, gravidade, caminhar)
  useEffect(() => {
    let animationFrameId;
    const gravityValues = { 1: 0.9, 2: 0.5, 3: 0.25, 4: 0.1, 5: 0 };
    const currentGravity = gravityValues[config.gravityLevel] || 0.9;

    const gameLoop = () => {
      const floorY = getFloorY();

      if (!state.current.isDragging) {
        if (config.gravityLevel === 5) {
          if (state.current.y > floorY) state.current.y = floorY;
          state.current.velocityY = 0;
        } else {
          if (state.current.y < floorY) {
            state.current.velocityY += currentGravity;
            state.current.y += state.current.velocityY;

            if (state.current.y >= floorY) {
              state.current.y = floorY;
              if (state.current.velocityY > 4 && config.canClickEffect) {
                triggerClickSquish();
              }
              state.current.velocityY = 0;
            }
          } else {
            state.current.y = floorY;
          }
        }

        if (config.canWalk) {
          if (!state.current.isWalking && Math.random() < 0.0015) {
            state.current.isWalking = true;
            const maxRoomWidth = (roomViewportRef.current?.clientWidth || 400) - 120;
            state.current.walkTargetX = Math.random() * maxRoomWidth;
          }

          if (state.current.isWalking) {
            const speed = 1.0;
            if (Math.abs(state.current.x - state.current.walkTargetX) > speed) {
              state.current.x += state.current.x < state.current.walkTargetX ? speed : -speed;
            } else {
              state.current.x = state.current.walkTargetX;
              state.current.isWalking = false;
            }
          }
        }

        if (!state.current.isClicking) {
          state.current.squishScaleX = 1;
          state.current.squishScaleY = 1;
        }

        updatePetDOM();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [config]);

  const handleStartDrag = (e) => {
    e.preventDefault();
    if (!config.canDrag) {
      if (config.canClickEffect) triggerClickSquish();
      return;
    }

    state.current.isClicking = true;
    state.current.velocityY = 0;

    if (config.canClickEffect) {
      triggerClickSquish();
    }

    state.current.holdTimeout = setTimeout(() => {
      if (state.current.isClicking) {
        state.current.isDragging = true;
      }
    }, 100);
  };

  const handleMovePet = (e) => {
    if (!state.current.isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (!roomViewportRef.current || !petRef.current) return;
    const parentRect = roomViewportRef.current.getBoundingClientRect();
    const floorY = getFloorY();

    let newX = clientX - parentRect.left - petRef.current.offsetWidth / 2;
    let newY = clientY - parentRect.top - petRef.current.offsetHeight / 2;

    newX = Math.max(0, Math.min(newX, parentRect.width - petRef.current.offsetWidth));

    if (newY > floorY) {
      const overDistance = newY - floorY;
      newY = floorY;
      const compressFactor = Math.min(overDistance / 90, 0.65);
      state.current.squishScaleY = 1 - compressFactor;
      state.current.squishScaleX = 1 + compressFactor * 0.6;
    } else {
      state.current.squishScaleY = 1;
      state.current.squishScaleX = 1;
    }

    state.current.x = newX;
    state.current.y = newY;

    updatePetDOM();
  };

  const handleStopDrag = () => {
    clearTimeout(state.current.holdTimeout);
    state.current.isDragging = false;
    state.current.isClicking = false;
    state.current.squishScaleX = 1;
    state.current.squishScaleY = 1;
    updatePetDOM();
  };

  return (
    <main className="w-full h-screen relative flex flex-col overflow-hidden bg-[#f4f4f6] select-none border-[6px] border-[#333342] shadow-2xl">
      
      {/* Botões Superiores de Configurações e Skins */}
      <div className="absolute top-5 left-5 z-50 flex gap-4">
        <button
          onClick={() => {
            setShowConfig(!showConfig);
            setShowSkins(false);
          }}
          className="w-14 h-14 bg-white hover:bg-gray-100 rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all text-2xl border border-black/10 cursor-pointer"
          title="Configurações"
        >
          ⚙️
        </button>

        <button
          onClick={() => {
            setShowSkins(!showSkins);
            setShowConfig(false);
          }}
          className="w-14 h-14 bg-white hover:bg-gray-100 rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-all text-2xl border border-black/10 cursor-pointer"
          title="Skins"
        >
          🎨
        </button>
      </div>

      {/* Modal Central de Configurações */}
      {showConfig && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-[380px] text-gray-800 border border-gray-200 animate-modal-pop relative">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="font-bold text-xl">Configurações</h3>
              <button
                onClick={() => setShowConfig(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-base">
              <div className="flex items-center justify-between">
                <span className="font-medium">Arrastar Pet:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.canDrag}
                    onChange={(e) => setConfig({ ...config, canDrag: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Efeito ao Clicar (Squish):</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.canClickEffect}
                    onChange={(e) => setConfig({ ...config, canClickEffect: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-medium">
                  <span>Nível de Gravidade:</span>
                  <span className="text-sm font-bold bg-gray-100 px-2.5 py-1 rounded-md text-blue-600">
                    {config.gravityLevel === 5 ? "Flutuando (5)" : `Nível ${config.gravityLevel}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.gravityLevel}
                  onChange={(e) => setConfig({ ...config, gravityLevel: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Caminhar Sozinho:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.canWalk}
                    onChange={(e) => setConfig({ ...config, canWalk: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Central de Skins */}
      {showSkins && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-[400px] text-gray-800 border border-gray-200 animate-modal-pop relative">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="font-bold text-xl">Escolher Skin do Pet</h3>
              <button
                onClick={() => setShowSkins(false)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {SKINS.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setSelectedSkinColor(skin.color)}
                  className={`h-14 rounded-xl ${skin.color} border-3 shadow-sm ${
                    selectedSkinColor === skin.color ? "border-black scale-105 shadow-md" : "border-transparent hover:scale-102"
                  } transition-all cursor-pointer`}
                  title={skin.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Área do Cômodo com Transição e Tela Preta de Fade */}
      <div
        ref={roomViewportRef}
        className={`w-full h-full relative overflow-hidden ${room.wallBg}`}
        onMouseMove={handleMovePet}
        onMouseUp={handleStopDrag}
        onTouchMove={handleMovePet}
        onTouchEnd={handleStopDrag}
      >
        {/* Overlay de Fade Preto */}
        <div
          className={`absolute inset-0 bg-black z-30 pointer-events-none transition-opacity duration-300 ${
            isFading ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Linha separadora entre parede e chão */}
        <div className="absolute bottom-[110px] left-0 w-full h-[3px] bg-[#22222d] z-20"></div>

        {/* Chão */}
        <div className={`absolute bottom-[65px] left-0 w-full h-[110px] ${room.floorBg} z-10`}></div>

        {/* Pet Virtual */}
        <div
          ref={petRef}
          className={`w-[100px] h-[100px] rounded-2xl ${selectedSkinColor} absolute cursor-grab shadow-2xl z-30 transition-transform origin-bottom border-2 border-black/20`}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
        />
      </div>

      {/* Barra Inferior (Fotbar) */}
      <Fotbar
        onPrev={() => handleRoomChange("prev")}
        onNext={() => handleRoomChange("next")}
        roomName={room.name}
      />
    </main>
  );
}