const WebSocket = require("ws");
const ev = require('events');
const eventEmitter = new ev.EventEmitter();

function init(server) {
    const wsServer = new WebSocket.Server({
        noServer: true
    });

    wsServer.on("connection", function(ws) {
        console.log("[WS]".bgYellow.black, "Connection established".grey);
        eventEmitter.emit('connection', { data: null, socket: ws });
    
        ws.on("message", function(msg) {
            msg = JSON.parse(msg.toString() || {}) || { event: 'error', data: '' };
            const { event, data } = msg;

            console.log("[WS]".bgYellow.black, `Event: ${event}`.grey);
    
            eventEmitter.emit(event, { data, socket: ws });
            
        });

        ws.on("close", function() {
            eventEmitter.emit('close', { data: null, socket: ws });
            console.log("[WS]".bgYellow.black, "Connection closed".grey);
        });
    });

    server.on('upgrade', async function upgrade(request, socket, head) {
        console.log('[WS]'.bgYellow.black, 'Upgrade request received'.grey);
    
        wsServer.handleUpgrade(request, socket, head, function done(ws) {
            console.log('[WS]'.bgYellow.black, 'Request upgraded'.grey);
    
            wsServer.emit('connection', ws, request);
    
        });
    });
}

function on(event, callback) {
    eventEmitter.on(event, ({ data, socket }) => {
        callback(socket, data);
    });
}





module.exports = {
    init,
    on
};