
"use client";

import { useState } from "react";

export default function ProfileButton({ coins = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="profile-container">
      <button
        type="button"
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir perfil"
      >
        <span>👤</span>
        <span>Perfil</span>
      </button>

      {isOpen && (
        <div className="profile-popup">
          <h3>Meu Perfil</h3>

          <p>Jogador: Visitante</p>

          <p>
            Moedas: 🪙 {coins.toLocaleString("pt-BR")}
          </p>

          <p>Nível: 1</p>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
