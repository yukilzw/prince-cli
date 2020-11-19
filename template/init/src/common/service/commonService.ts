import commonActions from '@common/actions/commonActions';
import fetchJsonp = require('fetch-jsonp');
import { combineReducers } from 'redux';

interface HttpOption {
    mock?: boolean;
    headers?: object;
    cbName?: string;
}

interface HttpConfig {
    method?: string;
    headers?: object;
    body?: string;
}

class CommonService {
    store                  // global store
    router                 // global router
    // webSocket object (if you don't need webSocket,you can delete 'ws' property)
    ws = {
        /**
        * @description webSocket subscribe
        * @param {string} sign name
        * @param {function} callBack function
        */
        subscribe(sign: string, callBack: Function, instance?: object) {
            this.unSubscribe(sign, callBack, instance);

            const eventFunction = e => {
                instance ? callBack.call(instance, e.detail) : callBack(e.delete);
            };
            const key = (instance ? instance.constructor.name : '') + sign + '::' + callBack.toString();

            this.callBackRegister[key] = eventFunction;
            document.addEventListener(`onsocketmsg${sign}`, eventFunction, false);
        },
        unSubscribe(sign: string, callBack: Function, instance?: object) {
            const key = (instance ? instance.constructor.name : '') + sign + '::' + callBack.toString();

            if (key in this.callBackRegister) {
                document.removeEventListener(`onsocketmsg${sign}`, this.callBackRegister[key]);
                delete this.callBackRegister[key];
            }
        },

        /**
        * @description webSocket send message
        * @param {string|object} data send data
        */
        send(data: string|object) {
            this.sendMsgList.push(data);
        },
        callBackRegister: {},
        sendMsgList: []
    };
    // global HOST: according to the file 'script/config.js' to init enviroment
    host = {
        req: REQUEST_HOST,    // http host
        socket: SOCKET_HOST   // webSocket host
    };
    // applyMiddleware: localStorage reducer middleware
    reducersStorage = store => next => action => {
        next(action);
        localStorage.setItem('princeReducersData', JSON.stringify(store.getState()));
    };


    constructor() {
        this.setPixel();
        this.connectWebSocket();
    }
    // set app rem
    setPixel() {
        document.documentElement.style.fontSize = (document.documentElement.clientWidth / 750) * 100 + 'px';
    }
    // connect webSocket server: subscribe, push. (if you don't need webSocket,you can delete 'connectWebSocket' method)
    connectWebSocket() {
        const that = this;
        const webSocket = new WebSocket(this.host.socket);

        webSocket.addEventListener('open', () => {
            that.ws = {
                ...that.ws,
                send(data) {
                    if (typeof data === 'object') {
                        data = JSON.stringify(data);
                    }
                    webSocket.send(data);
                }
            };
            that.ws.sendMsgList.forEach(data => that.ws.send(data));
            delete that.ws.sendMsgList;
        });

        webSocket.addEventListener('message', event => {
            const data = JSON.parse(event.data);

            if (DEBUG) {
                console.log('socket onmessage:', data);
            }

            const msgEvent = document.createEvent('CustomEvent');

            msgEvent.initCustomEvent(`onsocketmsg${data.sign}`, true, true, data);
            document.dispatchEvent(msgEvent);
        });

        window.addEventListener('beforeunload', () => {
            webSocket.close();
        });
    }
    // signal turning
    swipePage(e) {
        if (e.direction === 'Right') {
            this.router.history.go(-1);
        }
    }

    /* ------------------Nexts are exposed services function for page modules------------------ */

    /**
    * @description json to query
    * @param {object} obj json object
    */
    param(obj) {
        const arr = [];

        for (let k in obj) {
            arr.push(k + '=' + encodeURI(obj[k] instanceof Object ? JSON.stringify(obj[k]) : obj[k]));
        }

        return arr.join('&').replace(/\+/g, '%2B').replace(/"/g, '%22').replace(/'/g, '%27').replace(/\//g, '%2F');
    }
    /**
    * @description query to json
    * @param {string} obj query string
    */
    parse(string) {
        const obj = new Object();
        const arr = string.split('#');

        let strs;

        for (let j = 0; j < arr.length; j++) {
            let line = arr[j];

            if (line.indexOf('?') !== -1) {
                line = line.substr(line.indexOf('?') + 1);
                strs = line.split('&');
                for (let i = 0; i < strs.length; i++) {
                    const tempArr = strs[i].split('=');

                    obj[tempArr[0]] = tempArr[1];
                }
            }
        }

        return obj;
    }
    /**
    * @description POST request
    * @param {string} url request url
    * @param {obj} data request data(optional)
    * @param {obj} option request option(optional)
    */
    post(url, data = {}, option: HttpOption = {}) {
        const config: HttpConfig = {
            method: 'post',
            headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: data ? this.param(data) : undefined
        };

        if (option.headers) {
            config.headers = option.headers;
        }
        let reqPath = MOCK_PATH + url;

        if (!option.mock || !DEBUG) {
            reqPath = this.getPath(url);
        }

        return fetch(reqPath, config as RequestInit).then(res => res.json());
    }
    /**
    * @description GET request
    * @param {string} url request url
    * @param {obj} data request data(optional)
    * @param {obj} option request option(optional)
    */
    get(url, data = {}, option: HttpOption = {}) {
        const config: HttpConfig = {
            method: 'get'
        };

        if (option.headers) {
            config.headers = option.headers;
        }
        let reqPath = MOCK_PATH + url;

        if (!option.mock || !DEBUG) {
            reqPath = this.getPath(url);
        }

        return fetch(`${reqPath}?${data ? this.param(data) : ''}`, config as RequestInit).then(res => res.json());
    }
    /**
    * @description JSONP request
    * @param {string} url request url
    * @param {obj} data request data(optional)
    * @param {string} jsonpCallbackFunction JSONP callBack function name
    */
    jsonp(url, data = {}, option: HttpOption = {}) {
        let cbName = 'PrinceJsonpCallBack';

        if (option.cbName) {
            cbName = option.cbName;
        }
        let reqPath = MOCK_PATH + url;

        if (!option.mock || !DEBUG) {
            reqPath = this.getPath(url);
        }

        return fetchJsonp(`${reqPath}?${data ? this.param(data) : ''}`, cbName as fetchJsonp.Options).then(res => res.json());
    }
    getPath(url) {
        if (url.match(/^http|^https/)) {
            return url;
        } else {
            return this.host.req + url;
        }
    }
    /**
    * @description dynamic injection reducer
    * @param {object} reducers need to inject reducer object
    */
    registReducer(reducers) {
        this.store.replaceReducer(combineReducers(Object.assign(this.store.asyncReducers, reducers)));
    }

}

export const commonService = new CommonService();