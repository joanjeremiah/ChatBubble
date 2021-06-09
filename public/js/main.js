const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const roomUsers = document.querySelector('#users');

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

const socket = io();

socket.on('roomUsers',({room,users}) => {
    outputRoom(room);
    outputUers(users);
})

socket.emit('joinRoom',{username,room});

socket.on('message',message => {
    output(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    socket.emit('chatMsg',msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

function output(msg){
    div = document.createElement('div');
    div.classList.add('message');
    if(msg.username === username){
        div.classList.add('sent');
    }
    div.innerHTML = `<p class="meta">${msg.username}<span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoom(room){
    roomName.innerText = room;
}

function outputUers(users){
    roomUsers.innerHTML = '';
    users.forEach(user => {
        li = document.createElement('li');
        li.innerText = user.username;
        roomUsers.appendChild(li);
    })
}