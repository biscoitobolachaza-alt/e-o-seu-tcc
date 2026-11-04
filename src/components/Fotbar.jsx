"use client";

import Image from "next/image";

export default function Fotbar({ onPrev, onNext, roomName }) {
  return (
    <div className="relative shrink-0 w-full h-[62px] flex items-center justify-between z-40" style={{ backgroundColor: "#171720", borderTop: "2px solid #2a2a38" }}>
      {/* Botão da Seta Esquerda */}
      <button
        onClick={onPrev}
        className="absolute left-[34%] -translate-x-1/2 w-12 h-12 transition-transform active:scale-90 flex items-center justify-center cursor-pointer opacity-95 hover:opacity-100 rounded-xl hover:bg-white/10"
        aria-label="Cômodo Anterior"
      >
        <Image
          src="/angulo-esquerdo.png"
          alt="Anterior"
          width={36}
          height={36}
          className="brightness-0 invert filter"
        />
      </button>

      {/* Nome do Cômodo no centro */}
      <div className="absolute left-1/2 -translate-x-1/2 uppercase text-center select-none" style={{ color: "#ffffff", fontSize: "24px", lineHeight: 1, fontWeight: 700, letterSpacing: "0.04em" }}>
        {roomName}
      </div>

      {/* Botão da Seta Direita */}
      <button
        onClick={onNext}
        className="absolute right-[34%] translate-x-1/2 w-12 h-12 transition-transform active:scale-90 flex items-center justify-center cursor-pointer opacity-95 hover:opacity-100 rounded-xl hover:bg-white/10"
        aria-label="Próximo Cômodo"
      >
        <Image
          src="/angulo-direito.png"
          alt="Próximo"
          width={36}
          height={36}
          className="brightness-0 invert filter"
        />
      </button>
    </div>
  );
}