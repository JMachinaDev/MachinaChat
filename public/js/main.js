const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// JOIN CHATROOM
socket.emit('joinRoom', { username, room });


// Get room and usesr
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// MESSAGE FROM SERVER
socket.on('message', message => {
    // ALL THE 'message' variables are getting caught here

    outputMessage(message);


    // SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// MESSAGE SUBMIT
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();


    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    //Emitting message to serveer
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// OUTPUT message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
};


// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
};
