import path = require('path');
import program = require('commander');
import childProcess = require('child_process');
const fse = require('fs-extra');

const addPages = require('./addPage');
const packageConf = require('../package.json');

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
            const cloneProcess = childProcess.exec(`git clone https://github.com/yukilzw/prince .${project}/ --depth=1`);

            cloneProcess.on('exit', async () => {
                console.log(`checking out init template from git...`);
                await fse.move(path.join(cwd, `./.${project}/template/init`), path.join(cwd, `./${project}`));
                await fse.remove(path.join(cwd, `./.${project}`));
                console.log('init successfully');
            });
        } else {
            console.log(`checking out init template from local...`);
            await fse.copy(path.join(__dirname, '../template/init'), path.join(cwd, `./${project}`));
            console.log('init successfully');
        }
    });

program
    .command('add <project>')
    .description('add new page template into current path')
    .action((project: string) => {
        addPages(path.join(__dirname, '../template/page'), cwd + `/${project}`, project);
    });

program
    .command('*')
    .action(() => {
        program.help();
    });

program.parse(process.argv);