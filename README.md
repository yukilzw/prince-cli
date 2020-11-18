# About prince
![license](https://img.shields.io/badge/license-MIT-green.svg) ![node](https://img.shields.io/badge/node-8.0%2B-brightgreen.svg)

fast & light React SPA mobile tooling.
- connect Redux.
- webpack-dev-server provides hot reload.
- Starting new programe at localhost(local mode); online programe code develop by proxy of localhost(debug mode).
- page turning animation imitates native app.
- each page is splited the trunks for router, and connect reducers with global store when it is onloaded.
- support get、post、jsonp、webSocket mock function, support requesting localhost in the debug mode.

### Use command
- use `npm i prince-cli -g` install prince-cli for global
- use `prince new myApp` create new react SPA app from local template
- use `prince dev local` start local mode
- use `prince build` create release bundle
- use `prince add xxx` create a new page(xxx is your page name)
- use `npm test` run unit testing
 
### Development rule
    ########### myApp formation ###########
    ├── mock
    │   ├── mock.api.js         // http mock
    │   ├── socket.api.js       // websocket mock
    │   └── data
    │       ├── mockData.js     // rest mock data
    │       └── socketData.js   // websocket mock data
    ├── script
    │   ├── config.js           // environment host config
    │   ├── webpack.config.js   // webpack config
    │   └── server.js           // local server
    ├── src
    │   ├── common                  // common function
    │   │   ├── action              // actions
    │   │   ├── assests             // static files
    │   │   ├── component           // components
    │   │   ├── less                // styles
    │   │   ├── reducers            // stores
    │   │   └── service             // methods
    │   ├── page
    │   │   ├── firstPage           // page 1
    │   │   │   ├── action              // actions
    │   │   │   ├── assests             // static files
    │   │   │   ├── component           // components
    │   │   │   ├── less                // styles
    │   │   │   ├── reducers            // stores
    │   │   │   ├── service             // methods
    │   │   │   ├── firstPage.test.js   // unit test
    │   │   │   └── index.js            // page entry
    │   │   ├── secondPage          // page 2   
    │   │   └── thirdPage           // page 3
    │   └── route
    │       ├── router.js           // router core
    │       └── config.js           // router config
    ├── entry.js                // main entry
    ├── package.json            // npm config
    ├── .eslintrc               // Eslint config
    └── temp.html               // template
  
### Development guide
- in the path of pages use`prince add xxx`to create new page template<br/>

- add page routers at route/config.js (you can change the port anyway)：exemple <br/>
static files server：`http://localhost:4396` (static files and hot reload)<br/>
http requests server：`http://localhost:4397` (return ajax and jsonp mock request)<br/>
webSocket server：`ws://localhost:4398` (send and push socket mock message)<br/>

- http requests
``` 
import { commonService } from '@common/service';
/**
* @description GET,POST,JSONP request
* @param {string} url request url
* @param {obj} data request data
* @param {obj} options(optional)
*/
commonService.get('/mockGetRest', null, { mock: true }).then(res => {
      console.log('GET response:', res);
});
commonService.post('/mockPostRest', { a: 1 }).then(res => {
      console.log('POST response:', res);
});
commonService.jsonp('/mockJsonpRest', { a: 2 }).then(res => {
      console.log('JSONP response:', res);
});
``` 
you can inject`{ mock, headers }`at the third parameter to get mock server return during debug mode, `headers`config will add custom request headers, if you request url start with `http` or `https`, it will use absolute path, otherwise will use relative path.

- send or push webSocket message
``` 
import { commonService } from '@common/service';
/**
* @description subscribe socket message
* @param {string} sign name
* @param {obj} data callback data
*/
commonService.ws.subscribe('lzw', data => {
	//...
});
commonService.ws.send({ a: 3 });
``` 
first param of subscribe method define the sign which is confirmed by server side document,common
Service create event subscribe for each sign,when the messages are sended to client, it will just trgger the callback that bind the same sign.

- development and debug data mock<br/>

http mock:
``` 
const mockData = require('./data/mockData');

const mockApi = new Map();

/**
* @description rest api mock
* @example mockApi.set([method, url, timeout], response);
* @param {string} method api type, support'GET','POST','JSONP'
* @param {string} url api url path
* @param {number} timeout request return delay (optional)
* @param {object} response request return data
*/
mockApi.set(['GET', '/mockGetRest', 2000], mockData.mockGetRest);
mockApi.set(['POST', '/mockPostRest', 200], mockData.mockPostRest);
mockApi.set(['JSONP', '/mockJsonpRest'], mockData.mockJsonpRest);

module.exports = mockApi;
``` 

webScoket mock:
``` 
const socketData = require('./data/socketData');

const socketApi = new Map();

/**
* @description webSocket msg mock
* @example mockApi.set([type, time], response);
* @param {string} type push message times,'timeout' for once，'interval' for interval
* @param {number} time interval time
* @param {object} response socket push data
*/
socketApi.set(['timeout', 2500], socketData.wzl);
socketApi.set(['interval', 1000 * 20], socketData.lzw);

module.exports = socketApi;
``` 

- page turning

``` 
import { commonService } from '@common/service';

commonService.pageJump('push', {
      pathname: '/thirdPage'
});
commonService.pageBack('go', -1);
``` 
add turning animation liked native is based on react-router, `pageJump`is animate to next page, `pageBack`is animate previous page, first param of this method is react-router history proto method, and the second param is history method options.

- common folder content page component actions, reducers, methods needed many times, use path like`@common/`in the code.
- `debug`mode require that you shuold build server side bufore using it, then edit file script/config.js and`build` program. At last commit dist folder to server side.<br/>
