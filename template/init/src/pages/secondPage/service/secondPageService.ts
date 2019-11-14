
import { commonService } from '@common/service/commonService';
import countAction from '../actions/countAction';

class SecondPageService {
    store = commonService.store
    add() {
        this.store.dispatch(countAction.add());
    }
    minus() {
        const { count } = this.store.getState();

        if (count === 0) {
            return;
        }
        this.store.dispatch(countAction.minus());
    }
}

export const secondPageService = new SecondPageService();