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