import MockData, * as mockData from './data/mockData';

const mockApi: Map<Array<any>, MockData> = new Map();

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

export default mockApi;