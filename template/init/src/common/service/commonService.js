import commonActions from '@common/actions/commonActions';
import fetchJsonp from 'fetch-jsonp';
import { combineReducers } from 'redux';

class CommonService {
    store                  // 全局store对象
    router                 // 全局路由对象
    currentLoation         // 当前页面URL缓存
    // webSocket方法对象（不需要可删除）
    ws = {
        /**
        * @description webSocket订阅
        * @param {string} sign 协议名
        * @param {function} callBack 订阅回调函数
        */
        subscribe(sign, callBack) {
            callBack && document.addEventListener(`onsocketmsg${sign}`, e => callBack(e.detail), false);
        },

        /**
        * @description webSocket发送消息
        * @param {string|object} data 推送的数据
        */
        send(data) {
            this.sendMsgList.push(data);
        },

        sendMsgList: []
    };
    // 全局配置HOST，字符串为上线打包地址，空为采用相对地址
    host = {
        req: REQUEST_HOST,    // http host
        socket: SOCKET_HOST   // webSocket host
    };
    // applyMiddleware:本地缓存reducer中间件
    reducersStorage = store => next => action => {
        next(action);
        localStorage.setItem('princeReducersData', JSON.stringify(store.getState()));
    };

    // 初始化服务
    constructor() {
        this.setPixel();
        this.listenTurn();
        this.connectWebSocket();
    }
    // 设置rem
    setPixel() {
        document.documentElement.style.fontSize = (document.documentElement.clientWidth / 750) * 100 + 'px';
    }
    // 监听页面跳转方向，设置对应的进出切换动画
    listenTurn() {
        window.addEventListener('popstate', (e) => {
            if (this.pageTurning) {
                window.history.pushState(null, null, this.currentLoation);

                return;
            }
            this.pageTurning = true;
            setTimeout(() => {
                this.pageTurning = false;
            }, 350);
            if (this.pageDirect) {
                this.store.dispatch(commonActions.pageGo());
            } else {
                this.store.dispatch(commonActions.pageBack());
            }
            this.currentLoation = window.location.href;
        }, false);
    }
    // 连接webSocket服务，订阅、推送消息（不需要可删除）
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
    // 手势翻页
    swipePage(e) {
        if (e.direction === 'Left') {
            this.pageJump('go', 1);
        } else {
            this.pageBack('go', -1);
        }
    }

    /* ------------------以下为提供外部调用的服务------------------ */

    /**
    * @description 跳转页面调用
    */
    pageBack(method, option) {
        if (this.pageTurning) {
            return;
        }
        const { history } = this.router;

        history[method](option);
    }
    pageJump(method, option) {
        if (this.pageTurning) {
            return;
        }
        const { history } = this.router;

        this.pageDirect = 1;
        setTimeout(() => {
            this.pageDirect = 0;
        }, 300);
        history[method](option);
    }
    /**
    * @description json转query
    * @param {object} obj json对象
    */
    param(obj) {
        const arr = [];

        for (let k in obj) {
            arr.push(k + '=' + encodeURI(obj[k] instanceof Object ? JSON.stringify(obj[k]) : obj[k]));
        }

        return arr.join('&').replace(/\+/g, '%2B').replace(/"/g, '%22').replace(/'/g, '%27').replace(/\//g, '%2F');
    }
    /**
    * @description query转json
    * @param {string} obj query字符串
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
    * @description POST请求
    * @param {string} url 请求rest地址
    * @param {obj} data 请求数据
    * @param {obj} headers 请求头
    */
    post(url, data = {}, option = {}) {
        const config = {
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

        return fetch(reqPath, config).then(res => res.json());
    }
    /**
    * @description GET请求
    * @param {string} url 请求rest地址
    * @param {obj} data 请求数据
    * @param {obj} headers 请求头
    */
    get(url, data = {}, option = {}) {
        const config = {
            method: 'get'
        };

        if (option.headers) {
            config.headers = option.headers;
        }
        let reqPath = MOCK_PATH + url;

        if (!option.mock || !DEBUG) {
            reqPath = this.getPath(url);
        }

        return fetch(`${reqPath}?${data ? this.param(data) : ''}`, config).then(res => res.json());
    }
    /**
    * @description JSONP请求
    * @param {string} url 请求rest地址
    * @param {obj} data 请求数据
    * @param {string} jsonpCallbackFunction JSONP回调函数名
    */
    jsonp(url, data = {}, option = {}) {
        let cbName = 'PrinceJsonpCallBack';

        if (option.cbName) {
            cbName = option.cbName;
        }
        let reqPath = MOCK_PATH + url;

        if (!option.mock || !DEBUG) {
            reqPath = this.getPath(url);
        }

        return fetchJsonp(`${reqPath}?${data ? this.param(data) : ''}`, cbName).then(res => res.json());
    }
    getPath(url) {
        if (url.match(/^http|^https/)) {
            return url;
        } else {
            return this.host.req + url;
        }
    }
    /**
    * @description 动态注入reducer
    * @param {object} reducers 需要注册的reducer对象
    */
    registReducer(reducers) {
        this.store.replaceReducer(combineReducers(Object.assign(this.store.asyncReducers, reducers)));
    }

}

export const commonService = new CommonService();