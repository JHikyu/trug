let sockets = [];

module.exports = function(socket) {

    socket.on('connection', (socket) => {
        sockets.push(socket);
    });

    socket.on('close', (socket) => {
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('message', (socket, data) => {
        sockets.forEach(s => {
            s.send(data);
        });
    });

};