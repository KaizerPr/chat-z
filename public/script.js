const socket = io("https://chat-z-pkp6.onrender.com");

socket.on('connect', () => {
  console.log('✅ Conectado ao servidor');
});

const chatBox = document.getElementById('messagesContainer');
const chatForm = document.getElementById('chat-form');
const nicknameInput = document.getElementById('nickname');
const messageInput = document.getElementById('message');

const fixedNickname = 'zKira'; // Nick que será destacado

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(data) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('message');

  // Ajuste para garantir que o nickname seja comparado sem espaços extras
  if (data.nickname.trim().toLowerCase() === fixedNickname.trim().toLowerCase()) {
    msgElement.classList.add('highlight');
  }

  msgElement.innerHTML = `<strong>${data.nickname}</strong> [${data.time}]: ${data.message}`;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  playSound();
}

function playSound() {
  const audio = new Audio('pop.mp3');

  // Só tenta tocar o som se houver interação
  if (document.hasFocus()) {
    audio.play().catch((err) => {
      console.warn('🔇 Som bloqueado até que o usuário interaja com a página.');
    });
  }
}

socket.on('previousMessages', (msgs) => {
  msgs.forEach(addMessage);
});

socket.on('receivedMessage', addMessage);

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();

  // Verifica se a mensagem e o nickname são válidos
  if (nickname && message) {
    const msgData = {
      nickname,
      message,
      time: getTime()
    };

    console.log('Enviando mensagem:', msgData); // Para debugar e garantir que a mensagem está sendo enviada

    socket.emit('sendMessage', msgData);
    messageInput.value = '';
    messageInput.focus();
  }
});
