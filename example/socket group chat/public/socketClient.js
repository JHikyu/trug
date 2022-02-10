const url = "ws://localhost:80";
const wsServer = new WebSocket(url);

wsServer.onopen = function() {
    console.log("Connected to " + url);
    
    wsServer.send(JSON.stringify({event: 'setDetails', data: { name, id }}));
};

wsServer.onmessage = function(event) {
    let { data } = event;
    data = JSON.parse(data);

    if(data.type === 'connected') {
        const messages = document.querySelector('#messages');
        const p = document.createElement('p');
        p.classList.add('log');
        p.innerText = `> ${data.data.name} connected`;
        messages.appendChild(p);
        return;
    }

    document.querySelector('#message').value = '';
    const messages = document.querySelector('#messages');
    const p = document.createElement('p');
    p.classList.add('message');
    if(data.id == id) p.innerText = `You: ${data.message}`;
    else p.innerText = `${data.name}: ${data.message}`;
    messages.appendChild(p);
};