const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./util/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getRooms } = require('./util/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Listen for connection
io.on('connection', socket => {
    socket.on('join-room', ({ username, chatroom }) => {
        const user = userJoin(socket.id, username, chatroom);

        socket.join(user.room);

        socket.emit(
            'message', formatMessage(chatroom, 'Welcome to the ChatRoom!'));

        socket.broadcast.to(user.room).emit(
            'message', formatMessage(username, `${username} has joined the chat`));

        io.to(user.room).emit('room-users', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    // Listen for disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message', formatMessage('System', `${user.username} has left the chat`));

            io.to(user.room).emit('room-users', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    })

    // Listen for message
    socket.on('chat-message', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    socket.on('get-rooms', () => {
        socket.emit('rooms', getRooms());
    })
})

let PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})