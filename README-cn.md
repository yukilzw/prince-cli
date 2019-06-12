# prince 简介
![license](https://img.shields.io/badge/license-MIT-green.svg)

一个轻巧、全能、体验优秀的React-SPA应用开发脚手架
- 支持状态管理调试
- 支持修改文件自刷新
- 支持本地新项目开发（local模式）、线上项目代理本地开发（debug模式）
- 拥有类似native的页面转场体验
- 每个路由页面所有代码拆分打包，切换路由加载代码动态注入状态管理
- 提供get、post、jsonp、webSocket接口api，支持线上代理本地时mock请求与消息推送

### 使用命令
 1. 安装node.js（v8.0.0+）
 2. 执行 `npm install prince-cli -g` 全局安装prince-cli
 3. 执行 `prince new myApp` 从本地模板新建react SPA项目
 4. 执行 `prince new myApp -r` 从远程git仓库模板新建react SPA项目
 5. 在pages路径下 `prince add xxx` 新建一个页面(xxx为自定义模板名)
 6. 执行 `npm install` 拉取项目依赖包
 7. 执行 `npm run dev:local` 启动开发新项目环境
 8. 执行 `npm run dev:debug` 启动线上项目代理环境
 9. 执行 `npm run build` 打包生成发布代码
 10. 执行 `npm test` 进行模块单元测试
 
### 开发规范
    ########### myApp 项目结构 ###########
    ├── mock
    │   ├── mock.api.js         // http请求接口
    │   ├── socket.api.js       // websocket消息接口
    │   └── data
    │       ├── mockData.js     // rest请求mock数据
    │       └── socketData.js   // websocket推送mock数据
    ├── script
    │   ├── config.js           // 环境域名配置
    │   ├── webpack.config.js   // webpack配置文件
    │   └── server.js           // 本地服务端
    ├── src
    │   ├── common                  // 通用业务
    │   │   ├── action              // 事件
    │   │   ├── assests             // 静态文件
    │   │   ├── component           // 组件
    │   │   ├── less                // 样式
    │   │   ├── reducers            // 状态管理
    │   │   └── service             // 方法
    │   ├── page
    │   │   ├── firstPage           // 第1页
    │   │   │   ├── action              // 事件
    │   │   │   ├── assests             // 静态文件
    │   │   │   ├── component           // 组件
    │   │   │   ├── less                // 样式
    │   │   │   ├── reducers            // 状态管理
    │   │   │   ├── service             // 方法
    │   │   │   ├── firstPage.test.js   // 单元测试
    │   │   │   └── index.js            // 页面分包入口文件
    │   │   ├── secondPage          // 第2页   
    │   │   └── thirdPage           // 第3页
    │   └── route
    │       ├── router.js           // 路由核心逻辑
    │       └── config.js           // 路由配置文件
    ├── entry.js                // 总入口文件
    ├── package.json            // npm配置
    ├── .eslintrc               // Eslint规则
    └── temp.html               // 模板
  
### 开发指南
- 在 page 目录下使用`prince add xxx`创建新页面模板<br/>

- 在 route/config.js 为页面添加路由（可自行修改地址端口）：以下为例子 <br/>
静态资源服务：`http://localhost:4396`（用于代理本地资源，与自刷新浏览器）<br/>
http请求服务：`http://localhost:4397`（用于接受ajax，jsonp请求，返回mock数据）<br/>
webSocket服务：`ws://localhost:4398`（用于收发webSocket消息）<br/>

- 发送http请求
``` 
import { commonService } from '@common/service';
/**
* @description GET,POST,JSONP请求
* @param {string} url 请求rest地址
* @param {obj} data 请求数据
* @param {obj} 附加配置（可选）
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
可以在第三个配置参数中传入`{ mock, headers }`，mock在dev模式下会请求本地模拟数据，headers会像请求中添加自定义请求头，如果请求url为http或https开头，将请求绝对路径，否则请求相对路径。

- 接受与推送webSocket
``` 
import { commonService } from '@common/service';
/**
* @description 监听socket消息
* @param {string} sign 数据的标签名
* @param {obj} data 接受的数据
*/
commonService.ws.subscribe('lzw', data => {
	//...
});
commonService.ws.send({ a: 3 });
``` 
subscribe第一个参数为与服务端定义的消息标签名，commonService会为每个标签注册单独的事件，当消息到达时，只会触发已注册消息标签名中的回调函数。

- 开发与调试接口数据mock<br/>

http请求模拟：
``` 
const mockData = require('./data/mockData');

const mockApi = new Map();

/**
* @description rest请求模拟数据
* @example mockApi.set([method, url, timeout], response);
* @param {string} method 请求方式，支持'GET','POST','JSONP'
* @param {string} url 请求接口地址
* @param {number} timeout 返回数据延时（可选）
* @param {object} response 接口返回数据
*/
mockApi.set(['GET', '/mockGetRest', 2000], mockData.mockGetRest);
mockApi.set(['POST', '/mockPostRest', 200], mockData.mockPostRest);
mockApi.set(['JSONP', '/mockJsonpRest'], mockData.mockJsonpRest);

module.exports = mockApi;
``` 

webScoket推送模拟：
``` 
const socketData = require('./data/socketData');

const socketApi = new Map();

/**
* @description socket推送模拟数据
* @example mockApi.set([type, time], response);
* @param {string} type 推送方式，'timeout'为一次性推送，'interval'为间隔循环推送
* @param {number} time 推送延时或间隔
* @param {object} response 接口返回数据
*/
socketApi.set(['timeout', 2500], socketData.wzl);
socketApi.set(['interval', 1000 * 20], socketData.lzw);

module.exports = socketApi;
``` 

- 页面间跳转

``` 
import { commonService } from '@common/service';

commonService.pageJump('push', {
      pathname: '/thirdPage'
});
commonService.pageBack('go', -1);
``` 
基于react-router封装的转场动画路由，pageJump为下一页的动画，pageBack为返回上一页的动画，第一个参数为react-router中history对面的原生方法名，第二个参数为传入原生方法的参数对象。

- common文件夹用于存放所有共用的组件、状态、样式、方法等，通过`@common/`路径方便引入
- `debug`使用前需要部署你自己的服务端环境，在环境域名配置。并将`build`后的文件提交到服务端<br/>

### 开发者信息
有任何问题或建议请邮件作者：
334652479@qq.com
