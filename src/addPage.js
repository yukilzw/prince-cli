const fs = require('fs');
const stat = fs.stat;

String.prototype.render = function(context) {
    const tokenReg = /(\\)?\{\{([^\{\}\\]+)(\\)?\}\}/g;

    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        const variables = token.replace(/\s/g, '').split('.');

        let currentObject = context;

        let i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) {
                return '';
            }
        }
        return currentObject;
    });
};

let PN;

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
                    const rDist =  _dst.render({ PN });

                    readable = fs.createReadStream(_src);
                    writable = fs.createWriteStream(rDist);
                    readable.pipe(writable);
                    writable.on('close', function() {
                        fs.readFile(rDist, 'utf8', (err, files) => {
                            if (err) {
                                throw err;
                            }
                            const result = files.render({ PN });

                            fs.writeFile(rDist, result, 'utf8', () => {
                                console.log('\x1B[32m[prince]\x1B[0m file---%s', rDist);
                            });
                        });
                    });
                } else if (st.isDirectory()) {
                    addPage(_src, _dst);
                }
            });
        });
    });
};

const addPage = (src, dst, project) => {
    if (project) {
        PN = project;
    }
    fs.exists(dst, exists => {
        if (exists) {
            console.log('\x1B[31m[prince]\x1B[0m page \'%s\' is exist!', project);
        } else {
            fs.mkdir(dst, () => {
                console.log('\x1B[32m[prince]\x1B[0m dir---%s', dst);
                copy(src, dst);
            });
        }
    });
};

module.exports = addPage;