import { COUNT_ADD, COUNT_MINUS } from '../actions/countAction';

const count = (state = 2, { type }) => {
    switch (type) {
        case COUNT_ADD:
            state++;
            return state;
        case COUNT_MINUS:
            state--;
            return state;
        default :
            return state;
    }
};

export default {
    count
};