
"use client";

import { FLOOR_HEIGHT } from "@/constants/gameConfig";
import Pet from "@/components/Pet";

export default function RoomScene({
  room,
  petRef,
  roomViewportRef,
  selectedSkinColor,
  handleStartDrag,
  handleMovePet,
  handleStopDrag,
  onPetClick,
  interactionKey,
  isFading,
  lightsOff,
}) {
  return (
    <div
      ref={roomViewportRef}
      className="w-full flex-1 min-h-0 relative overflow-hidden"
      style={{
        backgroundColor: room.wallColor,
        touchAction: "none",
      }}
      onPointerMove={handleMovePet}
      onPointerUp={handleStopDrag}
      onPointerCancel={handleStopDrag}
    >
      {/* Chão */}
      <div
        className="absolute bottom-0 left-0 w-full z-10"
        style={{
          height: FLOOR_HEIGHT,
          backgroundColor: room.floorColor,
        }}
      />

      {/* Linha de separação */}
      <div
        className="absolute left-0 w-full z-20"
        style={{
          bottom: FLOOR_HEIGHT - 1,
          height: 3,
          backgroundColor: "#22222d",
        }}
      />

      {/* Escurecimento do quarto */}
      {lightsOff && room.id === "quarto" && (
        <div className="absolute inset-0 z-[25] bg-[#101426]/65 pointer-events-none transition-opacity duration-500" />
      )}

      {/* Transição entre cômodos */}
      <div
        className={`
          absolute inset-0 bg-black z-[35]
          pointer-events-none transition-opacity duration-300
          ${isFading ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Personagem */}
      <Pet
        petRef={petRef}
        selectedSkinColor={selectedSkinColor}
        handleStartDrag={handleStartDrag}
        onPetClick={onPetClick}
        interactionKey={interactionKey}
      />
    </div>
  );
}
