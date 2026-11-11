
"use client";

export default function MoneyCounter({ coins = 0 }) {
  return (
    <div className="money-counter flex items-center gap-2 rounded-xl border border-white/20 bg-black/20 px-3 py-2">
      <span className="text-xl" aria-hidden="true">
        🪙
      </span>

      <span className="text-base font-bold text-white tabular-nums">
        {Math.max(0, Number(coins) || 0).toLocaleString("pt-BR")}
      </span>
    </div>
  );
}
