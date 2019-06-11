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