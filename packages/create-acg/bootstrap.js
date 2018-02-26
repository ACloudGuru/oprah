#!/usr/bin/env node

'use strict';

const spawn = require('child_process').spawn;
const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');

const packageJson = require('./package.json');
const errors = require('./utils/printErrors');
const checkValid = require('./utils/checkService');
const checkYarn = require('./utils/checkYarn');

// get cli args
function getCliArgs() {
    let type;
    let name;

  // formerly: const program = bew commander.Command()
  new commander.Command('init')
    .version(packageJson.version)
    .usage('<type> <name>')
    .on('--help', function() {
      console.log('Only ' + chalk.cyan('<type> <name>') + ' is required.');
      console.log();
      console.log('for example:');
      console.log(chalk.cyan('<type>') + ': frontend | backend');
      console.log(
        chalk.cyan('<name>') + ': token | certification ...whatever you want'
      );
    })
    .arguments('<type> <name>')
    .action((serviceType, serviceName) => {
      type = serviceType;
      name = serviceName;

      checkValid.checkServiceTypeValid({ type });
      checkValid.checkServiceNameValid({ name });
    })
    .parse(process.argv);

  return { type, name };
}

// get acg-scripts, run acg-scripts/init()
function createService({ name, type }) {
  let relativeDirToCreate;

  switch (type) {
    case 'frontend':
      relativeDirToCreate = 'frontends/' + name;
      break;
    case 'backend':
      relativeDirToCreate = 'backend/services/' + name;
      break;
    default:
      errors.printInvalidTypeError({ type });
      process.exit(1);
  }

  // get the project root
  const createAcgExecutionPath = process.cwd();
  const newServiceFullPath = path.resolve(relativeDirToCreate);

  // create the dir, check if files exist that may conflict
  fs.ensureDirSync(relativeDirToCreate);
  if (
    !checkValid.isSafeToCreateProjectIn({
      name,
      newServiceFullPath,
      relativeDirToCreate,
    })
  ) {
    process.exit(1);
  }

  // change to dir of new service/project
  process.chdir(newServiceFullPath);

  // check if we can use yarn
  if (checkYarn.isYarnAvailable() !== true) {
    process.exit(1);
  }

  return { createAcgExecutionPath, newServiceFullPath };
}

function run({ createAcgExecutionPath, newServiceFullPath, name, type }) {
  console.log();
  console.log(`Creating ${chalk.cyan(type)} service ${chalk.cyan(name)} at`);
  console.log(`${chalk.magenta(newServiceFullPath)} with`);
  console.log(`${chalk.yellow('create-acg')} from`);
  console.log(`${chalk.magenta(createAcgExecutionPath)}`);
  console.log();

  console.log();
  console.log(`Installing acg-scripts:`);
  console.log();

  return initialiseYarn()
    .then(() => installAcgScripts(newServiceFullPath))
    .then(() => {
      console.log('')
      // require(acg-scripts)'s init.js script
      console.log();
      console.log(`Bootstrap project with ${chalk.yellow('acg-scripts')}`);
      console.log();
      const acgScriptsInitScriptPath = path.resolve(
        'node_modules',
        '@a-cloud-guru',
        'acg-scripts',
        type, // frontend | backend
        'init.js'
      );

      console.log({ createAcgExecutionPath, newServiceFullPath, acgScriptsInitScriptPath })

      const acgScriptsInit = require(acgScriptsInitScriptPath);
      acgScriptsInit({
        createAcgExecutionPath,
        newServiceFullPath,
        name,
        type,
      }); // run acg-scripts init.js script
    })
    .catch(reason => {
      console.log();
      console.log('Aborting Installation.');
      if (reason.command) {
        console.log(`  ${chalk.cyan(reason.command)} has failed.`);
      } else {
        console.log(chalk.red('Unexpected error. Please report it as a bug:'));
        console.log(reason);
      }
      console.log();

      // On 'exit' we will delete these files from target directory.
      const knownGeneratedFiles = ['package.json', 'node_modules'];
      const currentFiles = fs.readdirSync(path.join(root));
      currentFiles.forEach(file => {
        knownGeneratedFiles.forEach(fileToMatch => {
          // This remove all of knownGeneratedFiles.
          if (file === fileToMatch) {
            console.log(`Deleting generated file... ${chalk.cyan(file)}`);
            fs.removeSync(path.join(root, file));
          }
        });
      });
      const remainingFiles = fs.readdirSync(path.join(root));
      if (!remainingFiles.length) {
        // Delete target folder if empty
        console.log(
          `Deleting ${chalk.cyan(`${name}/`)} from ${chalk.cyan(
            path.resolve(root, '..')
          )}`
        );
        process.chdir(path.resolve(root, '..'));
        fs.removeSync(path.join(root));
      }
      console.log('Done.');
      process.exit(1);
    });
  // catch errors
}


function initialiseYarn() {
  return new Promise((resolve, reject) => {
    const cmd = 'yarn';
    const args = ['init', '--yes'];

    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${cmd} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
}

function installAcgScripts(servicePath) {
  return new Promise((resolve, reject) => {
    const cmd = 'yarnpkg';
    const args = ['add', '@a-cloud-guru/acg-scripts'];

    process.chdir(servicePath);

    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${cmd} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
}

// init a service
function init() {
  const { type, name } = getCliArgs();

  console.log(
    'Bootstrapping ' +
      chalk.cyan.bold(name) +
      ' as a ' +
      chalk.cyan.bold(type) +
      ' service'
  );
  const { createAcgExecutionPath, newServiceFullPath } = createService({ type, name });

  run({ type, name, createAcgExecutionPath, newServiceFullPath });

  // set the new services name in the package.json & now.json, set alias in now.json
}

module.exports = { init };
