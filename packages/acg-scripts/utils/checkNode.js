#!/usr/bin/env node
'use strict';

var chalk = require('chalk');

function checkNodeVersion() {
  var currentNodeVersion = process.versions.node;
  var semver = currentNodeVersion.split('.');
  var major = semver[0];

  if (major < 8) {
    console.error(
      chalk.red(
        "You're running Node " +
          currentNodeVersion +
          '.\n' +
          'create-acg requires Node 8 or higher. Please update your version of Node.'
      )
    );
    process.exit(1);
  }
}

module.exports = { checkNodeVersion };
