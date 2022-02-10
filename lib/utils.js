//* Node Requirements
const fs = require('fs');
const path = require("path");
//****************************************************************/

function fileExtension(path) {
    if(fs.existsSync(path + '.pug'))
        return 'pug';
    if(fs.existsSync(path + '.html'))
        return 'html';
    if(fs.existsSync(path + '.ejs'))
        return 'ejs';
    if(fs.existsSync(path + '.js'))
        return 'js';
    return undefined;
}
function log(msg) {
    console.log(`[LOG]`.bgGray, msg.grey);
}



function getPostBody(request) {
    return new Promise((resolve, reject) => {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const singles = body.split('&');
            body = {};
            singles.forEach(single => {
                const [key, value] = single.split('=');
                body[key] = value;
            });
            resolve(body);
        });
    });
}


module.exports = {
    fileExtension,
    log,
    getPostBody
};