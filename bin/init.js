#!/usr/bin/env node

const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const colors = require('colors');

const PROJECT_PATH = argv.path || '.';

(async () => {

    const response = await prompts([
    {
        type: 'toggle',
        name: 'basicFolders',
        message: 'Create basic folders?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    },
    {
        type: 'toggle',
        name: 'starterProject',
        message: 'Generate starter project?',
        initial: true,
        active: 'yes',
        inactive: 'no'
    },
    {
        type: 'toggle',
        name: 'socket',
        message: 'Create socket template?',
        initial: false,
        active: 'yes',
        inactive: 'no'
    }
    ]);
  
    if(response.basicFolders || response.starterProject) {
        // Create basic folders
        fs.mkdirSync(`${PROJECT_PATH}/views`);
        fs.mkdirSync(`${PROJECT_PATH}/public`);
        fs.mkdirSync(`${PROJECT_PATH}/src`);
    }
    if(response.starterProject) {
        // Create starter project
        // create file
        fs.mkdirSync(`${PROJECT_PATH}/views/api`);
        fs.writeFileSync(`${PROJECT_PATH}/views/api/index.pug`,
`doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Document
        link(rel="stylesheet", href="/style.css")
    body 
        p localhost/api
        p= title
        p= someVariables
`);
        fs.writeFileSync(`${PROJECT_PATH}/views/api/index.js`,
`module.exports = function() {
    //* Run once on page load [api/index.pug]
    console.log('hello world from api/index.js!');

    return {
        data: {
            title: 'Trug 🧺',
            someVariable: 123
        }
    };
}`);
        fs.writeFileSync(`${PROJECT_PATH}/views/api/endpoint.js`,
`module.exports = function(trug) {
    return {
        method: 'GET',
        data: trug
    }
}`);
        fs.writeFileSync(`${PROJECT_PATH}/views/index.html`,
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    Landing page runnig on trug 🧺
    reachable > localhost/
</body>
</html>`);
        fs.writeFileSync(`${PROJECT_PATH}/public/style.css`,
`body {
    font-family: Arial, Helvetica, sans-serif;
}`);
        fs.writeFileSync(`${PROJECT_PATH}/views/index.js`,
`module.exports = async (trug) => {
    //* Run once on page load [index.html]
};`);
    }

    if(response.socket) {
        fs.writeFileSync(`${PROJECT_PATH}/socket.js`,
`let sockets = [];

module.exports = function(socket) {

    // Connection event
    socket.on('connection', (socket) => {
        sockets.push(socket);
    });

    // Close event
    socket.on('close', (socket) => {
        sockets.splice(sockets.indexOf(socket), 1);
    });

    // Custom event
    socket.on('myEvent', (socket, data) => {
        console.log('received myEvent', data, 'sending back to all clients');
        sockets.forEach(s => {
            s.send(data);
        });
    });

};`);
        fs.writeFileSync(`${PROJECT_PATH}/views/index.html`,
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    Landing page runnig on trug 🧺
    reachable > localhost/
</body>
<script src="/socketClient.js"></script>
</html>`);

        fs.writeFileSync(`${PROJECT_PATH}/public/socketClient.js`,
`const url = "ws://localhost:80";
const wsServer = new WebSocket(url);

wsServer.onopen = function() {
    console.log("Connected to " + url);

    // Send test message
    wsServer.send(JSON.stringify({event: 'myEvent', data: 'Hello from client!'}));
};

wsServer.onmessage = function(event) {
    const { data } = event;
    console.log(data);
};`);

    }

    console.log(`Enjoy your new project!`.green);
    console.log('Run ' + '`trug`'.yellow + ' to start your server');

  })();