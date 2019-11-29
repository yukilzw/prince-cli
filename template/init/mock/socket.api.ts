import SocketData, * as socketData from './data/socketData';

const socketApi: Map<Array<any>, SocketData> = new Map();

/**
* @description webSocket msg mock
* @example mockApi.set([type, time], response);
* @param {string} type push message times,'timeout' for once，'interval' for interval
* @param {number} time interval time
* @param {object} response socket push data
*/
socketApi.set(['timeout', 2500], socketData.wzl);
socketApi.set(['interval', 4000], socketData.lzw);

export default socketApi;