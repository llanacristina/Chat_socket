var _a;
var socket = new WebSocket('ws://localhost:3000');
socket.addEventListener('open', function () {
    console.log('Connected to server');
});
socket.addEventListener('message', function (event) {
    var chatBox = document.getElementById('chat-box');
    var message = document.createElement('div');
    message.textContent = event.data; // event.data deve ser uma string
    chatBox.appendChild(message);
});
var sendMessage = function () {
    var input = document.getElementById('message');
    var message = input.value;
    socket.send(message);
    input.value = '';
};
(_a = document.getElementById('send-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', sendMessage);
