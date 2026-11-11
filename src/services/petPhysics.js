
export const GRAVITY_VALUES = {
  1: 0.9,
  2: 0.5,
  3: 0.25,
  4: 0.1,
  5: 0,
};

export function calculateFloorY(
  viewport,
  pet,
  floorHeight
) {
  if (!viewport || !pet) return 300;

  return (
    viewport.clientHeight -
    floorHeight -
    pet.offsetHeight
  );
}

export function calculateGravity(
  gravityLevel
) {
  return GRAVITY_VALUES[gravityLevel] ?? 0.9;
}

export function calculateSquish(overDistance) {
  const compressFactor = Math.min(
    overDistance / 90,
    0.65
  );

  return {
    scaleY: 1 - compressFactor,
    scaleX: 1 + compressFactor * 0.6,
  };
}

export function clampPosition(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
