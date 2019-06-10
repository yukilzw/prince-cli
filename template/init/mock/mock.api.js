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