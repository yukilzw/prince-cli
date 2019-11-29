
import { commonService } from '@common/service/commonService';

class FirstPageService {
    constructor() {
        commonService.ws.subscribe('wzl', data => {

        });
    }
    request() {
        commonService.get('/mockGetRest', null, { mock: true }).then(res => {
            console.log('GET response:', res);
        });
        commonService.post('/mockPostRest', { a: 1 }).then(res => {
            console.log('POST response:', res);
        });
        commonService.jsonp('/mockJsonpRest', { a: 2 }).then(res => {
            console.log('JSONP response:', res);
        });
    }
}

export const firstPageService = new FirstPageService();