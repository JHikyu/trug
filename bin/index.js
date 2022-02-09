#!/usr/bin/env node

// Requirements
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require("path");

const argv = require('minimist')(process.argv.slice(2));
const colors = require('colors');

const ejs = require('ejs');
const pug = require('pug');

const PORT = isNaN(argv.port) ? 80 : argv.port || argv.p || 80;
const PROJECT_PATH = argv.path || '.';
log(`Booting Trug 🧺 in ${PROJECT_PATH}`);

// Check if project is setup correctly
log('Checking project folders...');
log(`views folder: ${PROJECT_PATH}/views ${fs.existsSync(`${PROJECT_PATH}/views`) ? '✓' : '✗'}`);
log(`public folder: ${PROJECT_PATH}/public ${fs.existsSync(`${PROJECT_PATH}/public`) ? '✓' : '✗'}`);
log(`src folder: ${PROJECT_PATH}/src ${fs.existsSync(`${PROJECT_PATH}/src`) ? '✓' : '✗'}`);

if(!fs.existsSync(`${PROJECT_PATH}/views`) || !fs.existsSync(`${PROJECT_PATH}/public`) || !fs.existsSync(`${PROJECT_PATH}/src`)) {
    log('Project not setup correctly. Please run '.red + '`trug init`'.yellow + ' to setup your project.'.red);
    process.exit(1);
}

// Run http server
http.createServer(async (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const fullPath = path.join(PROJECT_PATH, 'views', pathname, pathname === '/' ? 'index' : '');

    //? Favicon redirect to public/favicon.ico
    if(pathname === '/favicon.ico' && fs.existsSync(path.join(PROJECT_PATH, 'public', 'favicon.ico'))) {
        res.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream(path.join(PROJECT_PATH, 'public', 'favicon.ico')).pipe(res);
        return;
    }

    //? Check if file is found at path
    log(`request on ${pathname} checking ${fullPath}`);
    const extension = fileExtension(fullPath) ?? fileExtension(path.join(fullPath, 'index'));
    const index = !fileExtension(fullPath);
    if(!extension) {
        log(`${pathname} not found`.underline);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Cannot ${req.method} ${req.url}`);
        return;
    }
    const fullFilePath = `${fullPath}${index ? '\\index' : ''}.${extension}`;
    log(`${fullFilePath} found`.underline);
    

    //? Run script of route
    const fullFilePathJs = `${fullPath}${index ? '\\index' : ''}`;
    let script;
    if(fs.existsSync(fullFilePathJs + '.js')) {
        // nocache(path.resolve(`${fullFilePathJs}.js`));

        try {
            script = await require(path.resolve(`${fullFilePathJs}.js`))();
        } catch (error) {
            log(`Error running script ${fullFilePathJs}.js`.red);
            log(error.stack.red);
        }

        log(`${fullFilePathJs} found`.underline);
    }

    //? Render file
    fs.readFile(fullFilePath, (err, data) => {
        if(err) {
            log(`${pathname} not found`.underline);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Cannot ${req.method} ${req.url}`);
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        if(extension === 'pug') {
            fn = pug.compile(data, {
                filename: fullFilePath,
                pretty: true
            });
            res.end(fn(script?.data));
        }
        else if(extension === 'ejs') {
            fn = ejs.compile(fullFilePath.toString());
            res.end(fn(script.data));
        }
        else if(extension === 'html') res.end(data);
        else res.end('');

        return;
    });


}).listen(PORT, () => {
    console.log(`Trug 🧺 is running on port ${PORT} 👍`.green.bold);
});

(async () => {
    fromDir(path.join(PROJECT_PATH), '.js');

    // fs.watchFile(path.resolve(module), () => {
    //     log(`${module} changed`);
    //     delete require.cache[require.resolve(module)];
    // });
})();

function fileExtension(path) {
    if(fs.existsSync(path + '.pug'))
        return 'pug';
    if(fs.existsSync(path + '.html'))
        return 'html';
    if(fs.existsSync(path + '.ejs'))
        return 'ejs';
    return undefined;
}
function log(msg) {
    console.log(`[LOG]`.bgGray, msg.grey);
}




async function fromDir(startPath,filter){
    if (!fs.existsSync(startPath)){
        return;
    }
    var files = fs.readdirSync(startPath);
    for(var i = 0 ; i < files.length ; i++) {
        var filename = path.join(startPath,files[i]);
        var stat = await fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        }
        else if (filename.indexOf(filter) >= 0) {
            log(`watching ${filename}`);
            fs.watchFile(path.resolve(filename), () => {
                log(`${filename} changed`);
                delete require.cache[path.resolve(filename)];
            });
        }
    }
}
