#!/usr/bin/env node
'use strict';

const execSync = require('child_process').execSync;
const errors = require('./printErrors');

function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    errors.printYarnNotAvailableError(process.cwd());
    return false;
  }
}

module.exports = {
  isYarnAvailable,
};
