"use client";

import Image from "next/image";

export default function Fotbar({ onPrev, onNext, roomName }) {
  return (
    <div className="relative shrink-0 w-full h-[96px] bg-[#171720] border-t-2 border-[#2a2a38] flex items-center justify-between z-40">
      {/* Botão da Seta Esquerda */}
      <button
        onClick={onPrev}
        className="absolute left-[32%] -translate-x-1/2 w-14 h-14 transition-transform active:scale-90 flex items-center justify-center cursor-pointer opacity-95 hover:opacity-100 rounded-xl hover:bg-white/10"
        aria-label="Cômodo Anterior"
      >
        <Image
          src="/angulo-esquerdo.png"
          alt="Anterior"
          width={40}
          height={40}
          className="brightness-0 invert filter"
        />
      </button>

      {/* Nome do Cômodo no centro */}
      <div className="absolute left-1/2 -translate-x-1/2 text-white text-2xl font-bold uppercase tracking-wide text-center select-none">
        {roomName}
      </div>

      {/* Botão da Seta Direita */}
      <button
        onClick={onNext}
        className="absolute right-[32%] translate-x-1/2 w-14 h-14 transition-transform active:scale-90 flex items-center justify-center cursor-pointer opacity-95 hover:opacity-100 rounded-xl hover:bg-white/10"
        aria-label="Próximo Cômodo"
      >
        <Image
          src="/angulo-direito.png"
          alt="Próximo"
          width={40}
          height={40}
          className="brightness-0 invert filter"
        />
      </button>
    </div>
  );
}