interface MockData {
    err: number;
    data?: object;
}

export default MockData;

export const mockGetRest = {
    err: 0,
    data: {
        type: 'GET_respose',
        id: 1
    }
};

export const mockPostRest = {
    err: 0,
    data: {
        type: 'POST_respose',
        id: 2
    }
};

export const mockJsonpRest = {
    err: 0,
    data: {
        type: 'JSONP_respose',
        id: 3
    }
};