export const PAGE_GO = 'PAGE_GO';
export const PAGE_BACK = 'PAGE_BACK';

export default class commonActions {
    static pageGo() {
        return {
            type: PAGE_GO
        };
    }
    static pageBack() {
        return {
            type: PAGE_BACK
        };
    }
}