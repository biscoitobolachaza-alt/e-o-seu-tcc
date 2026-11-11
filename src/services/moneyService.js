
export const INITIAL_COINS = 0;
export const PET_CLICK_REWARD = 1;

export function getPetClickReward() {
  return PET_CLICK_REWARD;
}

export function addCoins(currentCoins, amount) {
  return Math.max(0, currentCoins + amount);
}
