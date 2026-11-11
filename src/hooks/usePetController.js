
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
    isWalking: false,
    walkTargetX: 300,
    squishScaleX: 1,
    squishScaleY: 1,
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
    pet.style.transform = `scale(${state.current.squishScaleX}, ${state.current.squishScaleY})`;
  }, []);

  useEffect(() => {
    if (
      !roomViewportRef.current ||
      !petRef.current ||
      initializedRef.current
    ) return;

    state.current.x =
      roomViewportRef.current.clientWidth / 2 -
      petRef.current.offsetWidth / 2;

    state.current.y = getFloorY();

    updatePetDOM();
    initializedRef.current = true;
  }, [getFloorY, updatePetDOM]);

  useEffect(() => {
    const handleResize = () => {
      if (!roomViewportRef.current || !petRef.current) return;

      state.current.x = clampPosition(
        state.current.x,
        0,
        roomViewportRef.current.clientWidth -
          petRef.current.offsetWidth
      );

      state.current.y = getFloorY();
      updatePetDOM();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [getFloorY, updatePetDOM]);

  useEffect(() => {
    let animationFrameId;

    const gravity = calculateGravity(config.gravityLevel);

    const gameLoop = () => {
      const current = state.current;
      const floorY = getFloorY();

      if (!current.isDragging) {
        if (config.gravityLevel === 5) {
          current.y = Math.min(current.y, floorY);
          current.velocityY = 0;
        } else if (current.y < floorY) {
          current.velocityY += gravity;
          current.y += current.velocityY;

          if (current.y >= floorY) {
            current.y = floorY;
            current.velocityY = 0;
          }
        } else {
          current.y = floorY;
        }

        if (config.canWalk && roomViewportRef.current) {
          if (!current.isWalking && Math.random() < 0.0015) {
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
                current.x < current.walkTargetX ? speed : -speed;
            } else {
              current.x = current.walkTargetX;
              current.isWalking = false;
            }
          }
        }

        updatePetDOM();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [config.gravityLevel, config.canWalk, getFloorY, updatePetDOM]);

  const handleStartDrag = useCallback((event) => {
    if (!config.canDrag) return;

    const current = state.current;

    current.velocityY = 0;
    current.isWalking = false;
    current.isDragging = true;
  }, [config.canDrag]);

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

  const handleStopDrag = useCallback(() => {
    const current = state.current;

    current.isDragging = false;
    current.squishScaleX = 1;
    current.squishScaleY = 1;

    updatePetDOM();
  }, [updatePetDOM]);

  return {
    roomViewportRef,
    petRef,
    handleStartDrag,
    handleMovePet,
    handleStopDrag,
  };
}
