const program = require('commander');
const shell = require('shelljs');
const path = require('path');
const { exec } = require('child_process');

const copyFolder = require('./copy');
const addPage = require('./addPage');
const packageConf = require('../package.json');

const pwd = shell.pwd();

program
    .version(packageConf.version, '-v, --version')
    .description(packageConf.name);

program
    .command('new <project>')
    .description('creat new app from local')
    .action(project => {
        copyFolder(path.join(__dirname, '../template/init'), pwd + `/${project}`);
    });

program
    .command('clone <project>')
    .description('clone new app from github')
    .action(project => {
        console.log(`download into file path : ${pwd}\\${project}\\ ...`);
        exec(`git clone https://github.com/yukilzw/prince ${project}/ --depth=1`, (error, stdout, stderr) => {
            shell.rm('-rf', pwd + `/${project}/.git`);
            console.log('clone suucess');
        });
    });

program
    .command('add <project>')
    .description('add new page template into current path')
    .action(project => {
        addPage(path.join(__dirname, '../template/page'), pwd + `/${project}`, project);
    });

program
    .command('*')
    .action(() => {
        program.help();
    });

program.parse(process.argv);