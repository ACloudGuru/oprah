'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const resolveBin = require('../../utils/resolveBin').resolveBin;

const configPath = path.join(__dirname, '../..', 'config', '.prettierrc.yml');

const config = ['--config', configPath, '--write'];
const args = process.argv.slice(2);

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...args],
  { stdio: 'inherit' }
);

process.exitCode = result.status;
