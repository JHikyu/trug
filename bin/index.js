#!/usr/bin/env node

//* Node Requirements
    const http = require('http');
    const https = require('https');
    const fs = require('fs');
    const path = require("path");
//****************************************************************/

//* External Requirements
    const argv = require('minimist')(process.argv.slice(2));
    const color = require('colors');
//****************************************************************/

//* Config
    const PORT = isNaN(argv.port) ? 80 : argv.port || argv.p || 80;
    const HTTPS_PORT = isNaN(argv.sslport) ? 443 : argv.sslport || 443;
    const PROJECT_PATH = path.resolve(argv.path ? argv.path : '.');
    const ssl = argv.ssl == true ? {
        key: fs.readFileSync(path.join(PROJECT_PATH, 'ssl', 'key.pem')),
        cert: fs.readFileSync(path.join(PROJECT_PATH, 'ssl', 'cert.pem'))
    } : {};
//****************************************************************/


//* Lib
    const { log } = require('../lib/utils');
    const fullServer = require('../lib/fullServer');
    const webSocket = require('../lib/webSocket');
//****************************************************************/


//* Startup
log(`Booting Trug in ${PROJECT_PATH}`);

// Check if project is setup correctly
log('Checking project folders...');
log(`views folder: ${PROJECT_PATH}/views ${fs.existsSync(PROJECT_PATH + '/views') ? 'found'.green : 'not found'.red}`);
log(`public folder: ${PROJECT_PATH}/public ${fs.existsSync(PROJECT_PATH + '/public') ? 'found'.green : 'not found'.red}`);
log(`src folder: ${PROJECT_PATH}/src ${fs.existsSync(PROJECT_PATH + '/src') ? 'found'.green : 'not found'.red}`);
if(!fs.existsSync(`${PROJECT_PATH}/views`)) {
    log('Project not setup correctly. Please run '.red + '`trug-init`'.yellow + ' to setup your project.'.red);
    process.exit(1);
}



if(ssl.key) {
    https.createServer(ssl, async (req, res) => {
        fullServer(req, res, server);
    }).listen(HTTPS_PORT, () => {
        console.log(`Trug is running on port ${HTTPS_PORT} via ssl!`.green.bold);
    });
}
const server = http.createServer(async (req, res) => {
    fullServer(req, res, server);
}).listen(PORT, () => {
    console.log(`Trug is running on port ${PORT}`.green.bold);
});

webSocket.init(server);

// Look for socket.js in root
if(fs.existsSync(`${PROJECT_PATH}/socket.js`)) {
    const socket = require(`${PROJECT_PATH}/socket.js`)(webSocket);
}