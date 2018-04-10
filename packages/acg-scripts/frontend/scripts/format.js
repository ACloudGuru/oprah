'use strict';

const spawn = require('cross-spawn');
const resolveBin = require('../../utils/resolveBin').resolveBin;

const config = ['--config', 'prettierrc.config.js', 'src/**/*.{ts,tsx,js,jsx,json}', '--write'];
const args = process.argv.slice(2);

const result = spawn.sync(resolveBin('prettier'), [...config, ...args], {
  stdio: 'inherit',
});

process.exitCode = result.status;
