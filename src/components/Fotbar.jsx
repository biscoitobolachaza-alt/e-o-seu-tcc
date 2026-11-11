
export default function Fotbar({
  onPrev,
  onNext,
  roomName,
}) {
  const arrowStyle = {
    width: 48,
    height: 42,
    borderRadius: 7,
    border: "1px solid rgba(255,255,255,.35)",
    background: "#454550",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "background .2s, transform .2s",
    lineHeight: 1,
  };

  return (
    <footer
      className="relative w-full flex items-center justify-center bg-[#191922] shrink-0"
      style={{
        height: 68,
        minHeight: 68,
      }}
    >
      <div className="flex items-center justify-center gap-20">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Cômodo anterior"
          title="Cômodo anterior"
          style={arrowStyle}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#606070";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "#454550";
          }}
        >
          ‹
        </button>

        <span
          className="text-white font-bold text-xl text-center uppercase"
          style={{
            minWidth: 140,
            letterSpacing: "0.5px",
          }}
        >
          {roomName}
        </span>

        <button
          type="button"
          onClick={onNext}
          aria-label="Próximo cômodo"
          title="Próximo cômodo"
          style={arrowStyle}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#606070";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "#454550";
          }}
        >
          ›
        </button>
      </div>
    </footer>
  );
}
