const socket = io();
const chat_messages = document.querySelector(".chat-messages");
const chat_form = document.getElementById('chat-form');
const name_bar = document.getElementById('room-name');
const user_bar = document.getElementById('users');

// Get username and room from url
const { username, chatroom } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join the chatroom
socket.emit('join-room', {username, chatroom});

socket.on("message", message => {
    message.preventDefault;
    let div = document.createElement("div");
    div.innerHTML = `
        <p class="meta">${message.username} <span> ${message.time} </span></p>
        <p class="text">
            ${message.msg}
        </p>
    `;
    div.classList.add('message');
    chat_messages.appendChild(div);
    chat_messages.scrollTop = chat_messages.scrollHeight;
})

socket.on('room-users', ({ room, users }) => {
    name_bar.innerText = room;
    console.log(users);
    user_bar.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
});

chat_form.addEventListener('submit', e => {
    e.preventDefault();

    let text = e.target.elements.msg.value;

    socket.emit('chat-message', text);
    chat_form.reset();
    chat_form.focus;
})