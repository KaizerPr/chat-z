const socket = io();

const chatBox = document.getElementById('messagesContainer');
const chatForm = document.getElementById('chat-form');
const nicknameInput = document.getElementById('nickname');
const messageInput = document.getElementById('message');

// Função pra pegar a hora formatada (HH:MM)
function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função pra adicionar uma nova mensagem no chat
function addMessage(data) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('message');

  msgElement.innerHTML = `<strong>${data.nickname}</strong> [${data.time}]: ${data.message}`;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  playSound(); // Toca o som sempre que chega nova mensagem
}

// Função pra tocar um som quando chegar mensagem nova
function playSound() {
  const audio = new Audio('pop.mp3'); // certifique-se que esse arquivo está na pasta "public"
  audio.play();
}

// Recebe mensagens antigas quando entra
socket.on('previousMessages', (msgs) => {
  msgs.forEach(addMessage);
});

// Recebe mensagem nova
socket.on('receivedMessage', addMessage);

// Envia mensagem
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();

  if (nickname && message) {
    const msgData = {
      nickname,
      message,
      time: getTime()
    };

    socket.emit('sendMessage', msgData);
    messageInput.value = '';
    messageInput.focus();
  }
});
