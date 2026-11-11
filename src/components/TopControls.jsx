
"use client";

export default function TopControls({
  onOpenConfig,
  onOpenSkins,
}) {
  const buttonStyle = {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.25)",
    background: "rgba(255,255,255,.10)",
    color: "#fff",
    fontSize: 23,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background .2s",
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenConfig}
        aria-label="Abrir configurações"
        title="Configurações"
        style={buttonStyle}
      >
        ⚙️
      </button>

      <button
        type="button"
        onClick={onOpenSkins}
        aria-label="Mudar cor do pet"
        title="Mudar cor do pet"
        style={buttonStyle}
      >
        🎨
      </button>
    </div>
  );
}
