const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
  console.log('Connected to server');
});

socket.addEventListener('message', (event) => {
  const chatBox = document.getElementById('chat-box') as HTMLDivElement;
  const message = document.createElement('div');
  message.textContent = event.data;  // event.data deve ser uma string
  chatBox.appendChild(message);
});

const sendMessage = () => {
  const input = document.getElementById('message') as HTMLInputElement;
  const message = input.value;
  socket.send(message);
  input.value = '';
};

document.getElementById('send-button')?.addEventListener('click', sendMessage);
