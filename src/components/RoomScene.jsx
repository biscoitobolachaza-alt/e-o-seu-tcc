
import { FLOOR_HEIGHT, PET_SIZE } from "@/constants/gameConfig";

export default function RoomScene({
  room,
  petRef,
  roomViewportRef,
  selectedSkinColor,
  handleStartDrag,
  handleMovePet,
  handleStopDrag,
  isFading,
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
      {/* Transição entre cômodos */}
      <div
        className={`
          absolute inset-0 bg-black z-30
          pointer-events-none transition-opacity duration-300
          ${isFading ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Chão */}
      <div
        className="absolute bottom-0 left-0 w-full z-10"
        style={{
          height: FLOOR_HEIGHT,
          backgroundColor: room.floorColor,
        }}
      />

      {/* Linha que separa a parede do chão */}
      <div
        className="absolute left-0 w-full z-20"
        style={{
          bottom: FLOOR_HEIGHT - 1,
          height: 3,
          backgroundColor: "#22222d",
        }}
      />

      {/* Personagem */}
      <div
        ref={petRef}
        className={`
          absolute rounded-2xl ${selectedSkinColor}
          cursor-grab active:cursor-grabbing
          shadow-2xl z-30 border-2 border-black/30
          origin-bottom
        `}
        style={{
          width: PET_SIZE,
          height: PET_SIZE,
          touchAction: "none",
        }}
        onPointerDown={handleStartDrag}
      />
    </div>
  );
}
