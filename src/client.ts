let nickname: string | undefined;

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
  let input: string | null;
  
  do {
    input = prompt('Enter your nickname:');
  } while (!input || input.trim() === '');

  nickname = input;
  
  if (nickname) {
    socket.send(JSON.stringify({ type: 'nickname', data: nickname }));
    console.log('Connected to server');
  } else {
    // Lógica para o caso onde o nickname não é fornecido
    console.error('Nickname is required');
  }
});

socket.addEventListener('message', (event) => {
  const chatBox = document.getElementById('chat-box') as HTMLDivElement;
  const { nickname, message } = JSON.parse(event.data);
  const messageElement = document.createElement('div');
  messageElement.textContent = `${nickname}: ${message}`;
  messageElement.classList.add('message', 'received');
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll para a última mensagem
});

const sendMessage = () => {
  const input = document.getElementById('message') as HTMLInputElement;
  const message = input.value;
  if (message.trim() !== '' && nickname) {
    // Adicionar a mensagem localmente ao chat box
    const chatBox = document.getElementById('chat-box') as HTMLDivElement;
    const messageElement = document.createElement('div');
    messageElement.textContent = `${nickname}: ${message}`;
    messageElement.classList.add('message', 'sent');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll para a última mensagem

    // Enviar a mensagem ao servidor
    socket.send(JSON.stringify({ type: 'message', data: message }));
    input.value = '';
  }
};

document.getElementById('send-button')?.addEventListener('click', sendMessage);
document.getElementById('message')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
