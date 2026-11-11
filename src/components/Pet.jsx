
"use client";

import { useEffect, useRef, useState } from "react";
import { PET_SIZE } from "@/constants/gameConfig";

export default function Pet({
  petRef,
  selectedSkinColor = "bg-[#2f80ed]",
  handleStartDrag,
  onPetClick,
  interactionKey = 0,
}) {
  const [isSquishing, setIsSquishing] = useState(false);

  const pointerStart = useRef(null);
  const wasDragged = useRef(false);
  const squishTimeout = useRef(null);

  function playSquish() {
    clearTimeout(squishTimeout.current);

    setIsSquishing(false);

    requestAnimationFrame(() => {
      setIsSquishing(true);

      squishTimeout.current = setTimeout(() => {
        setIsSquishing(false);
      }, 400);
    });
  }

  useEffect(() => {
    if (interactionKey > 0) {
      playSquish();
    }
  }, [interactionKey]);

  useEffect(() => {
    return () => clearTimeout(squishTimeout.current);
  }, []);

  function handlePointerDown(event) {
    if (event.button !== 0) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };

    wasDragged.current = false;

    // Mantém os eventos de movimento e soltura no pet.
    event.currentTarget.setPointerCapture(event.pointerId);

    handleStartDrag?.(event);
  }

  function handlePointerMove(event) {
    if (!pointerStart.current) return;

    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;

    if (Math.hypot(dx, dy) > 7) {
      wasDragged.current = true;
    }
  }

  function handlePointerUp(event) {
    if (!pointerStart.current) return;

    const dragged = wasDragged.current;

    pointerStart.current = null;
    wasDragged.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragged) {
      onPetClick?.();
      playSquish();
    }
  }

  function handlePointerCancel() {
    pointerStart.current = null;
    wasDragged.current = false;
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPetClick?.();
      playSquish();
    }
  }

  return (
    <div
      ref={petRef}
      className={`
        pet-character
        ${selectedSkinColor}
        ${isSquishing ? "pet-squish" : ""}
        absolute rounded-2xl
        cursor-grab active:cursor-grabbing
        shadow-2xl z-30
        border-2 border-black/30
        origin-bottom
      `}
      style={{
        width: PET_SIZE,
        height: PET_SIZE,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Interagir com seu pet"
    />
  );
}
