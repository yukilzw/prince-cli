import path = require('path');
import program = require('commander');
import childProcess = require('child_process');
import compiler from './compile';
const fse = require('fs-extra');

const addPages = require('./addPage');
const packageConf = require('../../package.json');

const cwd = process.cwd();

program
    .version(packageConf.version, '-v, --version')
    .description(packageConf.name);

program
    .option('-r, --remote', 'use \'new\' command to create app from github');

program
    .command('new <project>')
    .description('create app from local')
    .action(async (project: string) => {
        if (program.remote) {
            console.log(`Clone template from https://github.com/yukilzw/prince into file path : "${cwd}\\${project}\\" ...`);
            const cloneProcess: childProcess.ChildProcess = childProcess.exec(`git clone https://github.com/yukilzw/prince .${project}/ --depth=1`);

            cloneProcess.on('exit', async () => {
                console.log(`checking out template from git...`);
                await fse.move(path.join(cwd, `./.${project}/template/init`), path.join(cwd, `./${project}`));
                await fse.remove(path.join(cwd, `./.${project}`));
                console.log('init successfully');
            });
        } else {
            console.log(`checking out template from local...`);
            await fse.copy(path.join(__dirname, '../../template/init'), path.join(cwd, `./${project}`));
            console.log('package install...');
            const subprocess = childProcess.spawn(`npm`, ['install'], {
                cwd: path.join(cwd, `./${project}`)
            });

            // subprocess.stdout.on('data', (data) => {
            //     console.log(`${data}`);
            // });
            subprocess.on('exit', () => {
                console.log('init successfully');
            });
        }
    });

program
    .command('add <project>')
    .description('add new page template into current path')
    .action((project: string) => {
        addPages(path.join(__dirname, '../template/page'), cwd + `/${project}`, project);
    });

program
    .command('dev <mode>')
    .description('start develop mode')
    .action((mode: string) => {
        if (mode === 'local') {
            process.env.DEBUG = '1';
            process.env.NODE_ENV = 'development';
        } else if (mode === 'debug') {
            process.env.DEBUG = '1';
            process.env.NODE_ENV = 'production';
        }
        const run = require('./script/server').default;

        compiler(run);
    });

program
    .command('build')
    .description('build app bundles')
    .action(() => {
        process.env.MODE = 'build';
        process.env.NODE_ENV = 'production';
        import('./compile');
    });

program
    .command('*')
    .action(() => {
        program.help();
    });

program.parse(process.argv);