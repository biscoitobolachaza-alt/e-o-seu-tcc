"use client";

import Image from "next/image";

export default function Fotbar({ onPrev, onNext, roomName }) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[65px] bg-[#1a1a24] border-t-2 border-[#2a2a38] flex items-center justify-between px-8 z-40">
      {/* Botão da Seta Esquerda */}
      <button
        onClick={onPrev}
        className="p-2 transition-transform active:scale-75 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100"
        aria-label="Cômodo Anterior"
      >
        <Image
          src="/angulo-esquerdo.png"
          alt="Anterior"
          width={28}
          height={28}
          className="brightness-0 invert filter"
        />
      </button>

      {/* Nome do Cômodo no centro */}
      <div className="text-white text-sm font-semibold uppercase tracking-widest text-center select-none">
        {roomName}
      </div>

      {/* Botão da Seta Direita */}
      <button
        onClick={onNext}
        className="p-2 transition-transform active:scale-75 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100"
        aria-label="Próximo Cômodo"
      >
        <Image
          src="/angulo-direito.png"
          alt="Próximo"
          width={28}
          height={28}
          className="brightness-0 invert filter"
        />
      </button>
    </div>
  );
}