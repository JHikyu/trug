let sockets = [];

module.exports = function(ws) {

    // Connection event
    ws.on('connection', (socket) => {
        sockets.push(socket);
    });

    // Close event
    ws.on('close', (socket) => {
        sockets.splice(sockets.indexOf(socket), 1);
    });

    ws.on('setDetails', (socket, data) => {
        // Edit socket in sockets
        const socketIndex = sockets.findIndex(s => s == socket);
        sockets[socketIndex].name = data.name;
        sockets[socketIndex].id = data.id;

        // Send to all sockets
        sockets.forEach(s => {
            if(s != socket) {
                s.send(JSON.stringify({
                    type: 'connected',
                    data: { name: data.name }
                }));
            }
        });
    });

    // Custom event
    ws.on('sendMessage', (socket, data) => {
        // Send message to all sockets
        sockets.forEach(s => {
            s.send(JSON.stringify(data));
        });
    });

};