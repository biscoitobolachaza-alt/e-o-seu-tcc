
"use client";

const ROOM_TOOLS = {
  sala: [
    { id: "ball", icon: "⚽", name: "Brincar com a bolinha" },
  ],
  quarto: [
    { id: "lamp", icon: "💡", name: "Ligar ou desligar o abajur" },
  ],
  cozinha: [
    { id: "food", icon: "🍖", name: "Dar comida ao pet" },
  ],
  banheiro: [
    { id: "soap", icon: "🧼", name: "Dar banho no pet" },
  ],
};

export default function CenterStatus({
  room,
  onToolUse,
  onBallDragStart,
  roomMessage,
}) {
  const tools = ROOM_TOOLS[room?.id] || [];

  function handlePointerDown(event, tool) {
    // A bolinha da sala é o único objeto arrastável por enquanto.
    if (tool.id !== "ball" || room?.id !== "sala") return;

    // Aceita somente o botão esquerdo do mouse.
    if (event.button !== 0) return;

    event.preventDefault();

    onBallDragStart?.(event, tool);
  }

  function handleClick(tool) {
    // A bolinha será controlada pelo sistema de arraste.
    if (tool.id === "ball" && room?.id === "sala") return;

    // Os outros objetos continuam funcionando por clique.
    onToolUse?.(tool);
  }

  return (
    <div className="room-tools-oval">
      <div className="room-tools-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`room-tool-button ${
              tool.id === "ball"
                ? "cursor-grab active:cursor-grabbing"
                : ""
            }`}
            title={tool.name}
            aria-label={tool.name}
            onPointerDown={(event) =>
              handlePointerDown(event, tool)
            }
            onClick={() => handleClick(tool)}
            draggable={false}
          >
            <span>{tool.icon}</span>
          </button>
        ))}
      </div>

      {roomMessage && (
        <span className="room-tool-message">
          {roomMessage}
        </span>
      )}
    </div>
  );
}
