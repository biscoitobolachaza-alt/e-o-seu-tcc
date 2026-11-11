
import { useEffect, useRef, useCallback } from "react";

import {
  calculateFloorY,
  calculateGravity,
  calculateSquish,
  clampPosition,
} from "@/services/petPhysics";

import { FLOOR_HEIGHT } from "@/constants/gameConfig";

export default function usePetController(config) {
  const roomViewportRef = useRef(null);
  const petRef = useRef(null);
  const initializedRef = useRef(false);

  const state = useRef({
    x: 300,
    y: 200,
    velocityY: 0,

    isDragging: false,
    isClicking: false,
    isWalking: false,
    isSquishing: false,

    walkTargetX: 300,

    squishScaleX: 1,
    squishScaleY: 1,

    holdTimeout: null,
    squishTimeout: null,
  });

  const getFloorY = useCallback(() => {
    return calculateFloorY(
      roomViewportRef.current,
      petRef.current,
      FLOOR_HEIGHT
    );
  }, []);

  const updatePetDOM = useCallback(() => {
    const pet = petRef.current;

    if (!pet) return;

    pet.style.left = `${state.current.x}px`;
    pet.style.top = `${state.current.y}px`;

    pet.style.transform = `scale(
      ${state.current.squishScaleX},
      ${state.current.squishScaleY}
    )`;
  }, []);

  const triggerSquish = useCallback(() => {
    if (!config.canClickEffect) return;

    const current = state.current;

    clearTimeout(current.squishTimeout);

    current.isSquishing = true;
    current.squishScaleX = 1.35;
    current.squishScaleY = 0.65;

    updatePetDOM();

    current.squishTimeout = setTimeout(() => {
      current.isSquishing = false;
      current.squishScaleX = 1;
      current.squishScaleY = 1;

      updatePetDOM();
    }, 180);
  }, [config.canClickEffect, updatePetDOM]);

  // Inicialização do personagem
  useEffect(() => {
    if (
      !roomViewportRef.current ||
      !petRef.current ||
      initializedRef.current
    ) {
      return;
    }

    state.current.x =
      roomViewportRef.current.clientWidth / 2 -
      petRef.current.offsetWidth / 2;

    state.current.y = getFloorY();

    updatePetDOM();

    initializedRef.current = true;
  }, [getFloorY, updatePetDOM]);

  // Reposicionamento quando a janela muda de tamanho
  useEffect(() => {
    const handleResize = () => {
      if (!roomViewportRef.current || !petRef.current) return;

      const current = state.current;

      current.x = clampPosition(
        current.x,
        0,
        roomViewportRef.current.clientWidth -
          petRef.current.offsetWidth
      );

      current.y = getFloorY();

      updatePetDOM();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getFloorY, updatePetDOM]);

  // Loop de física
  useEffect(() => {
    let animationFrameId;

    const gravity = calculateGravity(config.gravityLevel);

    const gameLoop = () => {
      const current = state.current;
      const floorY = getFloorY();

      if (!current.isDragging) {
        if (config.gravityLevel === 5) {
          if (current.y > floorY) {
            current.y = floorY;
          }

          current.velocityY = 0;
        } else if (current.y < floorY) {
          current.velocityY += gravity;
          current.y += current.velocityY;

          if (current.y >= floorY) {
            current.y = floorY;

            if (
              current.velocityY > 4 &&
              config.canClickEffect
            ) {
              triggerSquish();
            }

            current.velocityY = 0;
          }
        } else {
          current.y = floorY;
        }

        // Movimento automático
        if (config.canWalk && roomViewportRef.current) {
          if (
            !current.isWalking &&
            Math.random() < 0.0015
          ) {
            current.isWalking = true;

            const maxWidth =
              roomViewportRef.current.clientWidth -
              (petRef.current?.offsetWidth || 90);

            current.walkTargetX =
              Math.random() * Math.max(0, maxWidth);
          }

          if (current.isWalking) {
            const speed = 1;

            if (
              Math.abs(current.x - current.walkTargetX) > speed
            ) {
              current.x +=
                current.x < current.walkTargetX
                  ? speed
                  : -speed;
            } else {
              current.x = current.walkTargetX;
              current.isWalking = false;
            }
          }
        }

        if (!current.isSquishing) {
          current.squishScaleX = 1;
          current.squishScaleY = 1;
        }

        updatePetDOM();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, getFloorY, triggerSquish, updatePetDOM]);

  // Início do arrasto
  const handleStartDrag = useCallback((event) => {
    event.preventDefault();

    const current = state.current;

    if (!config.canDrag) {
      if (config.canClickEffect) triggerSquish();
      return;
    }

    current.isClicking = true;
    current.velocityY = 0;
    current.isWalking = false;

    if (config.canClickEffect) {
      triggerSquish();
    }

    event.currentTarget.parentElement?.setPointerCapture?.(
      event.pointerId
    );

    clearTimeout(current.holdTimeout);

    current.holdTimeout = setTimeout(() => {
      if (current.isClicking) {
        current.isDragging = true;
      }
    }, 100);
  }, [config, triggerSquish]);

  // Movimento do personagem
  const handleMovePet = useCallback((event) => {
    const current = state.current;

    if (!current.isDragging) return;

    if (!roomViewportRef.current || !petRef.current) return;

    const parentRect =
      roomViewportRef.current.getBoundingClientRect();

    const floorY = getFloorY();

    let newX =
      event.clientX -
      parentRect.left -
      petRef.current.offsetWidth / 2;

    let newY =
      event.clientY -
      parentRect.top -
      petRef.current.offsetHeight / 2;

    newX = clampPosition(
      newX,
      0,
      parentRect.width - petRef.current.offsetWidth
    );

    if (newY > floorY) {
      const overDistance = newY - floorY;

      newY = floorY;

      const squish = calculateSquish(overDistance);

      current.squishScaleY = squish.scaleY;
      current.squishScaleX = squish.scaleX;
    } else {
      current.squishScaleY = 1;
      current.squishScaleX = 1;
    }

    current.x = newX;
    current.y = newY;

    updatePetDOM();
  }, [getFloorY, updatePetDOM]);

  // Finalização do arrasto
  const handleStopDrag = useCallback(() => {
    const current = state.current;

    clearTimeout(current.holdTimeout);

    current.isDragging = false;
    current.isClicking = false;

    current.squishScaleX = 1;
    current.squishScaleY = 1;

    updatePetDOM();
  }, [updatePetDOM]);

  // Limpeza dos temporizadores
  useEffect(() => {
    return () => {
      clearTimeout(state.current.holdTimeout);
      clearTimeout(state.current.squishTimeout);
    };
  }, []);

  return {
    roomViewportRef,
    petRef,

    handleStartDrag,
    handleMovePet,
    handleStopDrag,
  };
}
