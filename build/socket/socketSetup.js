"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function setupSocket(server) {
    const io = new socket_io_1.Server(server, {
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
            io.to(user === null || user === void 0 ? void 0 : user.socketId).emit('getMessage', {
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
exports.default = setupSocket;
