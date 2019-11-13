/**
 * compile typescript used node API.
 * run the result of javascript server file.
 */
import path = require('path');
import ts = require('typescript');

const formatHost = {
    getCanonicalFileName: (path: any) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};

const watchCompile = () => {
    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');

    if (!configPath) {
        throw new Error(`Could not find a valid 'tsconfig.json'`);
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

    host.createProgram = (rootNames: any, options: any, host: any, oldProgram: any) => {
        console.log(`start creat develop environment`);
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = (program: any) => {
        console.log('compile typescript server successfully');
        origPostProgramCreate(program);
    };

    ts.createWatchProgram(host);

    import(path.join(process.cwd(), './.build/script/server'));
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
            console.log(`Mock Data has been changed, please 'npm run ${process.argv[2]}' again`);
            process.exit(0);
        }
        compileChange = true;
    }
};

watchCompile();