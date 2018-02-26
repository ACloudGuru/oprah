'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const resolveBin = require('../../utils/resolveBin').resolveBin;

const configPath = require(path.join(__dirname, '../..', 'config', 'jest.config.js'));

const config = ['--config', JSON.stringify(configPath)];
const args = process.argv.slice(2);

const result = spawn.sync(
  resolveBin('jest'),
  [...config, ...args],
  { stdio: 'inherit' }
);

process.exitCode = result.status;
