import { Server } from 'socket.io';
import cors from 'cors';

export default function setupSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    let users: { userId: any; socketId: any }[] = [];
    const addUser = (userId: any, socketId: any) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId });
    };
    const removeUser = (socketId: string) => {
        users = users.filter((user) => user.socketId !== socketId);
    };
    const getUser = (userId: any) => {
        return users.find((user) => user.userId === userId);
    };
    io.on('connection', (socket) => {
        socket.on('addUser', (userId: any) => {
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
