const fs = require('fs');
const stat = fs.stat;

const copy = (src, dst) => {
    fs.readdir(src, (err, paths) => {
        if (err) {
            throw err;
        }
        paths.forEach(path => {
            const _src = src + '/' + path;
            const _dst = dst + '/' + path;

            let readable;
            let writable;

            stat(_src, (err, st) => {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {
                    readable = fs.createReadStream(_src);
                    writable = fs.createWriteStream(_dst);
                    readable.pipe(writable);
                    console.log('\x1B[32m[prince]\x1B[0m file---%s', _dst);
                } else if (st.isDirectory() && path !== 'node_modules') {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};

const exists = (src, dst) => {
    fs.exists(dst, exists => {
        if (exists) {
            copy(src, dst);
        } else {
            fs.mkdir(dst, () => {
                console.log('\x1B[32m[prince]\x1B[0m dir---%s', dst);
                copy(src, dst);
            });
        }
    });
};

module.exports = exists;