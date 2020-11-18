/**
 * compile typescript used node API.
 * run the result of javascript server file.
 */
import fs = require('fs');
import path = require('path');
import ts = require('typescript');

const formatHost = {
    getCanonicalFileName: (path: any) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};

const watchCompile = (res) => {
    const configPath = ts.findConfigFile(__dirname, ts.sys.fileExists, 'tsconfig.dev-server.json');

    if (!configPath) {
        throw new Error(`Could not find a valid 'tsconfig.dev-server.json'`);
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
        configPath,
        {},
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged
    );

    const origCreateProgram = host.createProgram;

    host.createProgram = (rootNames, options, host, oldProgram) => {
        if (process.env.MODE !== 'build') {
            console.log(`start creat develop environment`);
        }
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = (program) => {
        if (process.env.MODE !== 'build') {
            console.log('compile typescript server successfully');
        }
        origPostProgramCreate(program);
    };

    ts.createWatchProgram(host);

    res();
};

const reportDiagnostic = (diagnostic: any) => {
    console.log(
        'Error',
        diagnostic.code,
        ':',
        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
    );
};

let compileChange = false;
const reportWatchStatusChanged = (diagnostic: any) => {
    let message = ts.formatDiagnostic(diagnostic, formatHost);

    if (message.indexOf('TS6194') > 0) {
        if (compileChange) {
            console.log(`Mock server files have been changed, please 'prince dev ${process.argv[3]}' again!`);
            process.exit(0);
        }
        compileChange = true;
    }
};

const tp = `{
    "include": ["${path.join(process.cwd(), './mock')}"],
    "compilerOptions": {
        "typeRoots": [
            "node_modules/@types"
        ],
        "allowSyntheticDefaultImports": true,
        "experimentalDecorators": true,
        "allowJs": true,
        "module": "commonjs",
        "target": "es5",
        "moduleResolution": "node",
        "lib": ["es2015"],
        "sourceMap": false,
        "outDir": "${path.join(__dirname, './user_mock')}",
        "pretty": true,
        "strictFunctionTypes": false,
        "importHelpers": true,
        "noImplicitAny": false,
        "downlevelIteration": true
    }
}`;

const compiler = () => new Promise((res) => {
    fs.writeFileSync(path.join(__dirname, './tsconfig.dev-server.json'), tp);

    watchCompile(res);
});

export default compiler;