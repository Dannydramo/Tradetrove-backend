const { Server } = require('socket.io');
const cors = require('cors');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    let users = [];
    const addUser = (userId, socketId) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId });
    };
    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    };
    const getUser = (userId) => {
        return users.find((user) => user.userId === userId);
    };
    io.on('connection', (socket) => {
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id);
            io.emit('getUsers', users);
        });
        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
            const user = getUser(senderId);

            io.to(user?.socketId).emit('getMessage', {
                senderId,
                text,
            });
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            removeUser(socket.id);
        });
    });
}

module.exports = setupSocket;
