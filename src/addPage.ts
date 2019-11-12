import fs = require('fs');

interface FilterTemp {
    [key: string]: string;
}

let PN: string;

const filterTemp = (str: string, context: FilterTemp) : string => {
    const tokenReg: RegExp = /(\\)?\{\{([^\{\}\\]+)(\\)?\}\}/g;

    return str.replace(tokenReg, function (word: string, slash1: any, token: string, slash2: any): string {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        const variables = token.replace(/\s/g, '').split('.');

        let i, length, variable, currentStr;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentStr = context[variable];
            if (currentStr === undefined || currentStr === null) {
                return '';
            }
        }
        return currentStr;
    });
}

const copy = (src: string, dst: string) => {
    fs.readdir(src, (err, paths: Array<string>) => {
        if (err) {
            throw err;
        }
        paths.forEach(path => {
            const _src: string = src + '/' + path;
            const _dst: string = dst + '/' + path;

            let readable: fs.ReadStream;
            let writable: fs.WriteStream;

            fs.stat(_src, (err: object, st: fs.Stats) => {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {
                    const rDist: string =  filterTemp(_dst, { PN });

                    readable = fs.createReadStream(_src);
                    writable = fs.createWriteStream(rDist);
                    readable.pipe(writable);
                    writable.on('close', function() {
                        fs.readFile(rDist, 'utf8', (err, files) => {
                            if (err) {
                                throw err;
                            }
                            const result: string = filterTemp(files, { PN });

                            fs.writeFile(rDist, result, 'utf8', () => {
                                console.log('\x1B[32m[prince]\x1B[0m file---%s', rDist);
                            });
                        });
                    });
                } else if (st.isDirectory() && path !== 'node_modules') {
                    addPage(_src, _dst);
                }
            });
        });
    });
};

const addPage = (src: string, dst: string, project?: string) => {
    if (project) {
        PN = project;
    }
    fs.exists(dst, (exists) => {
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