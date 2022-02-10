//* Node Requirements
    const url = require('url');
    const fs = require('fs');
    const path = require("path");
//****************************************************************/

//* External Requirements
    const argv = require('minimist')(process.argv.slice(2));
    const mime = require('mime/lite');
    const ejs = require('ejs');
    const pug = require('pug');
//****************************************************************/

//* Config
    const PORT = isNaN(argv.port) ? 80 : argv.port || argv.p || 80;
    const HTTPS_PORT = isNaN(argv.sslport) ? 443 : argv.sslport || 443;
    const PROJECT_PATH = path.resolve(argv.path ? argv.path : '.');
    const SRC_PATH = path.join(PROJECT_PATH, 'src');
    const src = (p) => path.join(PROJECT_PATH, 'src', p);
    const PUBLIC_PATH = path.join(PROJECT_PATH, 'public');
    const public = (p) => path.join(PROJECT_PATH, 'public', p);
    const VIEWS_PATH = path.join(PROJECT_PATH, 'views');
    const views = (p) => path.join(PROJECT_PATH, 'views', p);
    const NO_CACHE = argv.nocache;

    let trug = {
        PORT, HTTPS_PORT,
        PROJECT_PATH,
        SRC_PATH, src,
        PUBLIC_PATH, public,
        VIEWS_PATH, views,
    };
//****************************************************************/

//* Lib
    const { fileExtension, log, getPostBody } = require('../lib/utils');
    const webSocket = require('../lib/webSocket');
//****************************************************************/


module.exports = async function(req, res, server) {
    const { pathname } = url.parse(req.url, true);
    const fullPath = path.join(PROJECT_PATH, 'views', pathname, pathname === '/' ? 'index' : '');

    const query = url.parse(req.url, true).query;
    const postBody = await getPostBody(req);
    const method = req.method;


    //? Favicon redirect to public/favicon.ico
    if(pathname === '/favicon.ico' && fs.existsSync(path.join(PROJECT_PATH, 'public', 'favicon.ico'))) {
        res.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream(path.join(PROJECT_PATH, 'public', 'favicon.ico')).pipe(res);
        return;
    }

    //? Check if file is found at path
    log(`request on ${pathname} checking ${fullPath}`);
    let extension = fileExtension(fullPath);
    let index = fileExtension(path.join(fullPath, 'index'));

    if(index) extension = index;

    if(!extension) {
        //? Check if it's a file in public
        if(fs.existsSync(path.join(PROJECT_PATH, 'public', pathname))) {
            log(`serving ${pathname} from public folder`);
            res.setHeader('Content-Type', mime.getType(path.join(PROJECT_PATH, 'public', pathname)));
            fs.createReadStream(path.join(PROJECT_PATH, 'public', pathname)).pipe(res);
            return;
        }
        
        log(`${pathname} not found`.underline);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Cannot ${req.method} ${req.url}`);
        return;
    }
    const fullFilePath = `${fullPath}${index ? '/index' : ''}.${extension}`;
    log(`${fullFilePath} found`.underline);

    //? Run script of route
    const fullFilePathJs = `${fullPath}${index ? '/index' : ''}`;
    let script;
    if(fs.existsSync(fullFilePathJs + '.js')) {
        if(NO_CACHE)
            delete require.cache[path.resolve(fullFilePathJs + '.js')];

        try {
            script = await require(path.resolve(`${fullFilePathJs}.js`))({...trug, route: pathname, query, postBody, method, socket: { on: webSocket.on }});
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
            res.end(fn(script?.data));
        }
        else if(extension === 'html') res.end(data);
        else if(extension === 'js') {
            // Do js stuff
            // Check if method is correct
            if(req.method !== script?.method) {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.end(`Cannot ${req.method} ${req.url}`);
                return;
            }


            // If data exists, display it as json
            if(script?.data) {
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end(JSON.stringify(script.data));
            }
        }
        res.end('');

        return;
    });
};