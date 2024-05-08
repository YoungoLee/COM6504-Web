exports.init = function (io) {
    const chat = io
        .of('/chatroom')
        .on('connection', function (socket) {
            console.log('Connection Socket Successful!')
            try {
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    chat.to(room).emit('joined', room, userId);
                });
                socket.on('chat', function (room, userId, chatText) {
                    chat.to(room).emit('chat', room, userId, chatText);
                });
                socket.on('disconnect', function () {
                    console.log('someone disconnected');
                });
            } catch (e) {
                console.log('errorororo', e)
                console.error(e)
            }
        });
}
