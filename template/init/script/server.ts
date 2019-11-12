import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import url from 'url';
import fs from 'fs';
import { webpackConfig, isDebug } from './webpack.config';
import mockApi from '../mock/mock.api';
import socketApi from '../mock/socket.api';
import { REMOTE, LOCAL } from './config';
const WebSocket = require('ws');
// const op = require('op');

const routeConfig = require('../src/route/config');

interface KoaRouter {
    [keys: string]: any
}

const app = new Koa();
const router: KoaRouter = new Router();

// create dynamic router for each page
const creatRouterFile = () => {
    const moduleNameList = Object.keys(routeConfig);
    const config = moduleNameList.map(moduleName => {
        const { path: location, src } = routeConfig[moduleName];

        let code = `{ path: '${location}', modules:` +
            `() => import(/* webpackChunkName: '${moduleName}' */ '${path.join(__dirname, '../src/route', src).replace(/\\/g, '/')}')` +
        ` }`;

        return code;
    });
    const temp = 'export default [' + config.join(',') + '];';

    fs.writeFileSync(path.join(__dirname, './routeImage.js'), temp);
};

// clean path
const deleteFolderDist = (path: string) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file: string) => {
            const curPath = path + '/' + file;

            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderDist(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

// mock server
const portListen = () => {
    // api server：LOCAL.apiPort
    for (let [k, value] of mockApi) {
        const method = k[0].toLowerCase();
        const rest = k[1];
        const timeout =  k[2] || 0;
        let way = method;

        if (method === 'jsonp') {
            way = 'get';
        }

        router[way](rest, async (ctx: any) => {
            let reqData;

            await new Promise(resolve => {
                setTimeout(resolve, timeout);
            });
            ctx.set('Access-Control-Allow-Origin', '*');
            if (method === 'post') {
                reqData = ctx.request.body;
                ctx.body = value;
            } else if (method === 'get') {
                reqData = ctx.request.query;
                ctx.body = value;
            } else if (method === 'jsonp') {
                reqData = ctx.request.query;
                ctx.body = `${ reqData.callback }(${ JSON.stringify(value) })`;
            }
            console.log(`\x1B[33m[prince]\x1B[0m ${ method.toUpperCase() } request: ${ ctx.request.path }`);
        });
    }
    app.use(bodyParser());
    app.use(router.routes());
    app.listen(LOCAL.apiPort);

    console.log(`\x1B[33m[prince]\x1B[0m mock api server is starting at ${LOCAL.api}`);

    // webSocket server：LOCAL.socketPort
    const wss = new WebSocket.Server({ port: LOCAL.socketPort });

    wss.broadcast = (data: object | string, ws: object) => {
        wss.clients.forEach((client: any) => {
            if (client === ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };
    wss.on('connection', (ws: any, req: any) => {
        console.log(`\x1B[33m[prince]\x1B[0m new client has connected webSocket.Server`);
        const query = url.parse(req.url, true).query;

        ws.timerArr = [];
        for (let [k, value] of socketApi) {
            if (typeof value !== 'object') {
                return;
            }
            if (k[0] === 'timeout') {
                setTimeout(() => {
                    const data = JSON.stringify(value);

                    wss.broadcast(data, ws);
                    console.log(`\x1B[33m[prince]\x1B[0m WebSocket send msg: ${ value.sign || 'undefined sign' }`);
                }, k[1]);
            } else if (k[0] === 'interval') {
                ws.timerArr.push(
                    setInterval(() => {
                        const data = JSON.stringify(value);

                        wss.broadcast(data, ws);
                        console.log(`\x1B[33m[prince]\x1B[0m WebSocket send msg: ${ value.sign || 'undefined sign' }`);
                    }, k[1])
                );
            }
        }

        ws.on('message', (message: string | object) => {
            if (typeof message === 'string') {
                console.log(`\x1B[33m[prince]\x1B[0m webSocket on msg: ${ message }`);
            } else if (typeof message === 'object') {
                console.log('\x1B[33m[prince]\x1B[0m webSocket msg is binary');
            }
        });
        ws.on('close', () => {
            ws.timerArr.forEach((timer: any) => clearInterval(timer));
            delete ws.timerArr;
            console.log(`\x1B[33m[prince]\x1B[0m webSocket closed`);
        });
        ws.on('error', (err: object) => {
            console.log(`\x1B[31m[prince]\x1B[0m ${err}`);
        });
    });

    console.log(`\x1B[33m[prince]\x1B[0m mock WebSocket.Server is starting at ${LOCAL.socket}`);
    console.log('');

    /* if (process.env.NODE_ENV === 'development') {
        op(LOCAL.devPort);
    } */
};

// webpack start
deleteFolderDist(path.join(__dirname, '../dist'));
creatRouterFile();
if (isDebug) {
    webpackConfig.entry['dev-server'] = `webpack-dev-server/client?http://localhost:${LOCAL.devPort}`;
    const options: WebpackDevServer.Configuration = {
        quiet: true,
        hot: true,
        inline: true,
        host: 'localhost',
        port: LOCAL.devPort,
        stats: 'minimal',
        overlay: {
            errors: true,
            warnings: true
        },
        setup(app: any) {
            app.use('*', (req: any, res: any, next: Function) => {
                res.header('Access-Control-Allow-Origin', '*');
                next();
            });
        }
    };

    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, options);

    server.listen(LOCAL.devPort);
    console.log(`\x1B[33m[prince]\x1B[0m dev server is starting at http://localhost:${LOCAL.devPort}`);
    portListen();
} else {
    let compiler = webpack(webpackConfig);

    compiler.run((err: object, stats: any) => {
        if (err || stats.hasErrors()) {
            console.log(stats.compilation.errors);
        } else {
            let htmlTemplate = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
            const re = new RegExp(REMOTE.api + '/static/prince', 'g');

            htmlTemplate = htmlTemplate.replace(re, `http://localhost:${LOCAL.devPort}`).replace(/_[0-9a-z]{5}\.js/g, '.js');

            fs.writeFileSync(path.join(__dirname, '../dist/prince-dev.html'), htmlTemplate);
            fs.renameSync(path.join(__dirname, '../dist/index.html'), path.join(__dirname, '../dist/prince.html'));
            console.log(stats.toString({
                chunks: false,
                colors: true
            }));
            console.log('\x1B[32m[prince]\x1B[0m set bundle production!');
        }
    });
}