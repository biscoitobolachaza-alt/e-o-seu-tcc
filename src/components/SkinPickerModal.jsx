
"use client";

import { SKINS } from "@/constants/gameConfig";

const SKIN_PRICE = 5;

export default function SkinPickerModal({
  selectedSkinColor,
  setSelectedSkinColor,
  unlockedSkins = ["blue"],
  coins = 0,
  onBuySkin,
  onClose,
}) {
  const isUnlocked = (skinId) => unlockedSkins.includes(skinId);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-[420px] text-gray-800 border border-gray-200"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <div>
            <h3 className="font-bold text-xl">
              Loja de skins
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Escolha uma nova cor para seu pet!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar loja de skins"
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Saldo */}
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <span className="font-semibold text-gray-700">
            Suas moedas
          </span>

          <span className="font-bold text-amber-600">
            🪙 {coins}
          </span>
        </div>

        {/* Skins */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {SKINS.map((skin) => {
            const unlocked = isUnlocked(skin.id);
            const selected = selectedSkinColor === skin.color;
            const canAfford = coins >= SKIN_PRICE;

            return (
              <div
                key={skin.id}
                className="flex flex-col items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (unlocked) {
                      setSelectedSkinColor(skin.color);
                    } else if (canAfford) {
                      onBuySkin?.(skin);
                    }
                  }}
                  disabled={!unlocked && !canAfford}
                  className={`
                    relative w-full h-16 rounded-xl
                    ${skin.color}
                    border-2 shadow-sm transition-all
                    ${
                      selected
                        ? "border-black scale-105 shadow-md"
                        : "border-gray-200"
                    }
                    ${
                      !unlocked && !canAfford
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:scale-105 cursor-pointer"
                    }
                  `}
                  title={skin.name}
                  aria-label={
                    unlocked
                      ? `Selecionar skin ${skin.name}`
                      : `Comprar skin ${skin.name} por 5 moedas`
                  }
                  aria-pressed={selected}
                >
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white drop-shadow-md">
                      ✓
                    </span>
                  )}

                  {!unlocked && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl drop-shadow">
                      🔒
                    </span>
                  )}
                </button>

                <span className="text-xs font-semibold text-gray-700">
                  {skin.name}
                </span>

                {unlocked ? (
                  <span className={`text-xs font-bold ${
                    selected ? "text-green-600" : "text-blue-600"
                  }`}>
                    {selected ? "Em uso" : "Desbloqueada"}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600">
                    🪙 {SKIN_PRICE}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {!SKINS.every((skin) => isUnlocked(skin.id)) && (
          <p className="text-center text-xs text-gray-500 mt-5">
            Cada nova skin custa 5 moedas.
          </p>
        )}

        {!canAffordAnyLockedSkin(unlockedSkins, coins) && (
          <p className="text-center text-sm text-red-500 font-semibold mt-3">
            Você precisa de mais moedas para comprar skins.
          </p>
        )}
      </div>
    </div>
  );
}

function canAffordAnyLockedSkin(unlockedSkins, coins) {
  return SKINS.some(
    (skin) => !unlockedSkins.includes(skin.id) && coins >= SKIN_PRICE
  );
}
