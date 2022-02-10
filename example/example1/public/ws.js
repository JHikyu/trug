const url = "ws://localhost:80";
const mywsServer = new WebSocket(url);


mywsServer.onopen = function() {
    console.log("Connected to " + url);
};

mywsServer.onmessage = function(event) {
    const { data } = event;
    console.log(data);
};