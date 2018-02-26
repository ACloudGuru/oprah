#!/usr/bin/env node
'use strict';

const chalk = require('chalk');

function printInvalidDirError({
  name,
  newServiceFullPath,
  relativeDirToCreate,
  fileConflicts,
}) {
  console.log();
  console.log(
    `${chalk.red.bold('Error:')} a service named ${chalk.green.bold(
      name
    )} exists.`
  );
  console.log(`The path:`);
  console.log(`\t${chalk.magenta('./' + relativeDirToCreate)}`);
  console.log(`\t${chalk.magenta(newServiceFullPath)}`);
  console.log(`contains files that could conflict:`);
  console.log();
  for (const file of fileConflicts) {
    console.log(chalk.red(`  ${file}`));
  }
  console.log();
  console.log(
    `Either try using a ${chalk.cyan(
      'new service name'
    )}, or remove the files listed above.`
  );
  console.log();
}

function printInvalidTypeError({ type }) {
  console.log(chalk.red('Invalid <type> provided: ' + chalk.bold(type)));
  console.log(
    chalk.cyan('<type>') +
      ' must be either: ' +
      chalk.cyan.bold('frontend') +
      ' | ' +
      chalk.cyan.bold('backend')
  );
}

function printInvalidNameError({ name }) {
  console.log(chalk.red('Invalid <name> provided: ' + chalk.bold(name)));
  console.log(
    chalk.cyan('<name>') + ' must not be the same as an existing service.'
  );
}

function printYarnNotAvailableError({ currentDir }) {
  console.log();
  console.log(
    `${chalk.red.bold('Error:')} Yarn is unavailable or cannot run in the path:`
  );
  console.log(`\t${chalk.magenta(currentDir)}`);
  console.log();
  console.log(
    'Check your system terminal shell configuration or folder permissions'
  );
}

module.exports = {
  printInvalidDirError,
  printInvalidTypeError,
  printInvalidNameError,
  printYarnNotAvailableError,
};
