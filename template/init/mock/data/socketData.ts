interface SocketData {
    sign: string;
    data?: string;
}

export default SocketData;

export const wzl = {
    sign: 'wzl',
    data: 'this is a timeout msg~'
};

export const lzw = {
    sign: 'lzw',
    data: 'this is an interval msg~'
};