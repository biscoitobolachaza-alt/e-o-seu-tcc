
export default function TopControls({
  onOpenConfig,
  onOpenSkins,
}) {
  const buttonStyle = {
    width: 46,
    height: 46,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.65)",
    background: "rgba(23,23,32,.92)",
    color: "#fff",
    fontSize: 25,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="absolute top-3 left-3 z-[60] flex items-center gap-3">
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
        aria-label="Mudar cor do boneco"
        title="Mudar cor do boneco"
        style={buttonStyle}
      >
        🎨
      </button>
    </div>
  );
}
