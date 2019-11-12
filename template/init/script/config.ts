const REMOTE = {
    api: 'http://127.0.0.1:1236',
    socket: 'ws://127.0.0.1:1236/pysocket',
    publicPath: 'http://127.0.0.1:1236/static/prince/'
};

const LOCAL = {
    api: 'http://localhost:4397',
    socket: 'ws://localhost:4398',
    publicPath: 'http://localhost:4396/',
    devPort: 4396,
    apiPort: 4397,
    socketPort: 4398
};

export {
    REMOTE,
    LOCAL
};