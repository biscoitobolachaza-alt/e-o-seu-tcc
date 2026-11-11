
import { SKINS } from "@/constants/gameConfig";

export default function SkinPickerModal({
  selectedSkinColor,
  setSelectedSkinColor,
  onClose,
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-[400px] text-gray-800 border border-gray-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h3 className="font-bold text-xl">
            Escolher Skin do Pet
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar seleção de cores"
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {SKINS.map((skin) => (
            <button
              key={skin.id}
              type="button"
              onClick={() => setSelectedSkinColor(skin.color)}
              className={`
                h-14 rounded-xl ${skin.color}
                border-3 shadow-sm transition-all cursor-pointer
                ${
                  selectedSkinColor === skin.color
                    ? "border-black scale-105 shadow-md"
                    : "border-transparent hover:scale-105"
                }
              `}
              title={skin.name}
              aria-label={`Escolher cor ${skin.name}`}
              aria-pressed={selectedSkinColor === skin.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
