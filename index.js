#!/usr/bin/env node
if (parseInt(process.version.slice(1), 10) >= 8) {
    require('./src/prince');
} else {
    console.log('current Node version: %s', process.version);
    console.log('\x1B[31m[prince]\x1B[0m You should update Node version to v8.0+');
}