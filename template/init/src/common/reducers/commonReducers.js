import { PAGE_GO, PAGE_BACK } from '@common/actions/commonActions';

// 路由方向reducer
const routecss = (state = 'go', action) => {
    switch (action.type) {
        case PAGE_GO:
            return 'go';
        case PAGE_BACK:
            return 'back';
        default :
            return state;
    }
};

export default {
    routecss
};