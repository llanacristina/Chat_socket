let nickname: string | undefined;

const socket = new WebSocket('ws://localhost:3000');

const updateNickname = () => {
  let input: string | null;
  
  do {
    input = prompt('Enter your new nickname:');
  } while (!input || input.trim() === '');

  const oldNickname = nickname;
  nickname = input;

  if (nickname) {
    socket.send(JSON.stringify({
      type: 'update-nickname',
      data: nickname
    }));
    console.log(`Nickname changed from ${oldNickname} to ${nickname}`);
  } else {
    console.error('Nickname is required');
  }
};

const pokeUser = () => {
  const targetNickname = prompt('Enter the nickname of the user you want to poke:');
  
  if (targetNickname && targetNickname.trim() !== '') {
    socket.send(JSON.stringify({
      type: 'poke',
      data: targetNickname
    }));
  } else {
    console.error('Nickname is required');
  }
};


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
    console.error('Nickname is required');
  }
});

socket.addEventListener('message', (event) => {
  const chatBox = document.getElementById('chat-box') as HTMLDivElement;
  const usersList = document.getElementById('users-list') as HTMLUListElement;
  const { nickname, message, type, data } = JSON.parse(event.data);

  if (type === 'system') {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('system-message');
    chatBox.appendChild(messageElement);
  } else if (type === 'user-list') {
    // Atualizar a lista de usuários conectados
    usersList.innerHTML = '';
    data.forEach((user: string) => {
      const userElement = document.createElement('li');
      userElement.textContent = user;
      usersList.appendChild(userElement);
    });
  } else {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${nickname}: ${message}`;
    messageElement.classList.add('message', type === 'sent' ? 'sent' : 'received');
    chatBox.appendChild(messageElement);
  }
  
  chatBox.scrollTop = chatBox.scrollHeight;
});

const sendMessage = () => {
  const input = document.getElementById('message') as HTMLInputElement;
  const message = input.value;
  if (message.trim() !== '' && nickname) {
    const chatBox = document.getElementById('chat-box') as HTMLDivElement;
    const messageElement = document.createElement('div');
    messageElement.textContent = `${nickname}: ${message}`;
    messageElement.classList.add('message', 'sent');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

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

document.getElementById('update-nickname-button')?.addEventListener('click', updateNickname);
document.getElementById('poke-button')?.addEventListener('click', pokeUser);
