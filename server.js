const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers } = require('./utils/users');
// const users = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// CHATBOT NAME
const botName = 'MachinaBot';

// RUN WHEN CLIENT CONNECTS
io.on('connection', socket => {

    // JOIN ROOM
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);

        // WELCOME MESSAGE
        socket.emit('message', formatMessage(botName, 'Welcome to the ChatRoom!'));

        //BROADCAST  when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} : Has joined the chat!`));

        // SEND USERS and ROOM info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    // LISTEN FOR chatMessage 
    socket.on('chatMessage', msg => {
        // get USER
        const user = getCurrentUser(socket.id);
        // show message to ALL USERS
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });


    // runs when CLIENT DISCONNECTS
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);


        if (user) {
            // USER HAS LEFT MESSAGE
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat...`)
            );

            // SEND USERS and ROOM info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));