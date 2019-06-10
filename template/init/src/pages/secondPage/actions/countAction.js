export const COUNT_ADD = 'COUNT_ADD';
export const COUNT_MINUS = 'COUNT_MINUS';

export default class firstPageAction {
    static add() {
        return {
            type: COUNT_ADD
        };
    }
    static minus() {
        return {
            type: COUNT_MINUS
        };
    }
}