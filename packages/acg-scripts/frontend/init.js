#!/usr/bin/env node
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const os = require('os');

module.exports = function({
  createAcgExecutionPath,
  newServiceFullPath,
  name,
  type,
}) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;

  const ownPath = path.join(newServiceFullPath, 'node_modules', ownPackageName);
  console.log({ ownPackageName, ownPath })
  const appPackage = require(path.join(newServiceFullPath, 'package.json'));

  fs.writeFileSync(
    path.join(newServiceFullPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(
    path.join(newServiceFullPath, 'README.md')
  );
  if (readmeExists) {
    fs.renameSync(
      path.join(newServiceFullPath, 'README.md'),
      path.join(newServiceFullPath, 'README.old.md')
    );
  }

  // copy the template
  const templatePath = path.join(ownPath, 'frontend/template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, newServiceFullPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // run yarn install
  let command = 'yarnpkg';
  let args = ['install'];

  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    return;
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (
    createAcgExecutionPath &&
    path.join(createAcgExecutionPath, `${type}/${name}`) === newServiceFullPath
  ) {
    cdpath = name;
  } else {
    cdpath = newServiceFullPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = 'yarn';

  console.log();
  console.log(`Success! Created ${name} at ${newServiceFullPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} build`));
  console.log('    Bundles the app into for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} dev`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
};
