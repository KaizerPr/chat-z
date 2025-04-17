const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = []; // Armazena as mensagens do chat

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Evita erro de favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('✅ Novo usuário conectado');

  // Envia mensagens anteriores
  socket.emit('previousMessages', messages);

  // Envia nova mensagem para todos
  socket.on('sendMessage', (data) => {
    messages.push(data);
    io.emit('receivedMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuário desconectado');
  });
});

// 🔧 Aqui é onde a mágica acontece pro Render funcionar:
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
