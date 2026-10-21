// Lista de Cômodos
const rooms = [
  { name: 'Quarto', class: 'room-quarto' },
  { name: 'Sala', class: 'room-sala' },
  { name: 'Cozinha', class: 'room-cozinha' },
  { name: 'Banheiro', class: 'room-banheiro' }
];

let currentRoomIndex = 0;

// Elementos
const roomViewport = document.getElementById('roomViewport');
const roomTitle = document.getElementById('roomTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pet = document.getElementById('pet');

// Parâmetros de Física e Estado
let petX = 200;
let petY = 200;
let velocityY = 0;
let velocityX = 0;
const gravity = 0.8;
const bounce = -0.3; // Amortecimento de quique

let isDragging = false;
let isClicking = false;
let holdTimeout = null;
let isWalking = false;
let walkTargetX = petX;

// Ajusta a posição inicial no chão
function initPetPosition() {
  const floorY = getFloorY();
  petX = roomViewport.clientWidth / 2 - 55;
  petY = floorY;
  updatePetDOM();
}

// Retorna a posição Y correspondente ao chão
function getFloorY() {
  const floorHeight = 120;
  return roomViewport.clientHeight - floorHeight - pet.offsetHeight;
}

function updatePetDOM() {
  pet.style.left = `${petX}px`;
  pet.style.top = `${petY}px`;
}

// Troca de Cômodos
function updateRoom() {
  roomViewport.className = `room-viewport ${rooms[currentRoomIndex].class}`;
  roomTitle.textContent = rooms[currentRoomIndex].name;
}

prevBtn.addEventListener('click', () => {
  currentRoomIndex = (currentRoomIndex - 1 + rooms.length) % rooms.length;
  updateRoom();
});

nextBtn.addEventListener('click', () => {
  currentRoomIndex = (currentRoomIndex + 1) % rooms.length;
  updateRoom();
});

// --- INTERAÇÕES DE ARRASTE E CLIQUE ---

function startDrag(e) {
  e.preventDefault();
  isClicking = true;
  velocityY = 0;
  velocityX = 0;

  // Efeito achatadinho (squish) ao clicar
  pet.classList.add('squish');

  holdTimeout = setTimeout(() => {
    if (isClicking) {
      isDragging = true;
      pet.classList.remove('squish');
      pet.classList.add('holding');
    }
  }, 150);
}

function movePet(e) {
  if (!isDragging && !isClicking) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const parentRect = roomViewport.getBoundingClientRect();

  // Fixa o mouse na CABEÇA (topo do pet)
  petX = clientX - parentRect.left - (pet.offsetWidth / 2);
  petY = clientY - parentRect.top - 15; // Offset para alinhar com a cabeça

  // Limites da sala
  petX = Math.max(0, Math.min(petX, parentRect.width - pet.offsetWidth));
  petY = Math.max(0, Math.min(petY, parentRect.height - pet.offsetHeight));

  updatePetDOM();
}

function stopDrag() {
  clearTimeout(holdTimeout);

  if (isDragging) {
    // Soltou no ar -> Ativa gravidade
    isDragging = false;
  } else if (isClicking) {
    // Clique simples -> Mantém o efeito squish temporário
    setTimeout(() => {
      pet.classList.remove('squish');
    }, 200);
  }

  isClicking = false;
  pet.classList.remove('holding');
}

pet.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', movePet);
window.addEventListener('mouseup', stopDrag);

pet.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('touchmove', movePet, { passive: false });
window.addEventListener('touchend', stopDrag);

// --- LOOP DE FÍSICA E MOVIMENTO ALEATÓRIO (LOOP DO JOGO) ---

function triggerSquishEffect() {
  pet.classList.add('squish');
  setTimeout(() => {
    pet.classList.remove('squish');
  }, 180);
}

function gameLoop() {
  const floorY = getFloorY();

  // Se não estiver sendo segurado pelo mouse
  if (!isDragging) {
    // Aplica Gravidade se estiver acima do chão
    if (petY < floorY) {
      velocityY += gravity;
      petY += velocityY;

      // Colisão com o Chão
      if (petY >= floorY) {
        petY = floorY;
        
        // Se caiu com velocidade suficiente, faz o efeito achatadinho
        if (velocityY > 3) {
          triggerSquishEffect();
        }
        
        velocityY = 0;
      }
    } else {
      // Pet no chão: Caminhada Aleatória
      petY = floorY;

      if (!isWalking && Math.random() < 0.008) { // Chance de começar a andar
        isWalking = true;
        const maxRoomWidth = roomViewport.clientWidth - pet.offsetWidth;
        walkTargetX = Math.random() * maxRoomWidth;
      }

      if (isWalking) {
        const speed = 1.8;
        if (Math.abs(petX - walkTargetX) > speed) {
          petX += petX < walkTargetX ? speed : -speed;
        } else {
          petX = walkTargetX;
          isWalking = false; // Parou
        }
      }
    }

    updatePetDOM();
  }

  requestAnimationFrame(gameLoop);
}

// Inicialização
setTimeout(() => {
  initPetPosition();
  gameLoop();
}, 100);

window.addEventListener('resize', () => {
  if (petY > getFloorY()) {
    petY = getFloorY();
  }
});