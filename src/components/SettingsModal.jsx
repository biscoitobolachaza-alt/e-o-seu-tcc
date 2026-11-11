
export default function SettingsModal({
  config,
  setConfig,
  onClose,
}) {
  const updateConfig = (key, value) => {
    setConfig((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-[380px] text-gray-800 border border-gray-200 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h3 className="font-bold text-xl">
            Configurações
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar configurações"
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-base">
          <label className="flex items-center justify-between">
            <span className="font-medium">
              Arrastar Pet:
            </span>

            <input
              type="checkbox"
              checked={config.canDrag}
              onChange={(event) =>
                updateConfig("canDrag", event.target.checked)
              }
              className="w-5 h-5 accent-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="font-medium">
              Efeito ao Clicar (Squish):
            </span>

            <input
              type="checkbox"
              checked={config.canClickEffect}
              onChange={(event) =>
                updateConfig(
                  "canClickEffect",
                  event.target.checked
                )
              }
              className="w-5 h-5 accent-green-500"
            />
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center font-medium">
              <span>Nível de Gravidade:</span>

              <span className="text-sm font-bold bg-gray-100 px-2.5 py-1 rounded-md text-blue-600">
                {config.gravityLevel === 5
                  ? "Flutuando (5)"
                  : `Nível ${config.gravityLevel}`}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              value={config.gravityLevel}
              onChange={(event) =>
                updateConfig(
                  "gravityLevel",
                  Number(event.target.value)
                )
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <label className="flex items-center justify-between">
            <span className="font-medium">
              Caminhar Sozinho:
            </span>

            <input
              type="checkbox"
              checked={config.canWalk}
              onChange={(event) =>
                updateConfig("canWalk", event.target.checked)
              }
              className="w-5 h-5 accent-green-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
