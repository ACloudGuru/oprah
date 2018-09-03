'use strict';

const execa = require('execa');
const chalk = require('chalk');
const fs = require('fs');
const Bluebird = require('bluebird');
const path = require('path');

const runServerless = ({ serverlessYamlDirectory, stage }) => {
  if (!serverlessYamlDirectory) {
    console.log(chalk.red('serverlessYamlDirectory is required'));
    return Bluebird.reject(new Error('Please specify serverlessYamlDirectory for runServerless'));
  }

  if (!stage) {
    console.log(chalk.red('stage is required'));
    return Bluebird.reject(new Error('Please specify stage for runServerless'));
  }

  const serverlessYamlPath = path.resolve(serverlessYamlDirectory, 'serverless.yml');
  if (!fs.existsSync(serverlessYamlPath)) {
    console.log(chalk.red(`Could not find serverless.yml: ${serverlessYamlPath}`));
    return Bluebird.reject(new Error(`Could not find serverless.yml for runServerless`))
  }

  const childProcess = execa('serverless', ['deploy', '--stage', stage, '--force'], { cwd: serverlessYamlDirectory });

  childProcess.stdout.pipe(process.stdout);

  return childProcess;
};

module.exports = {
  runServerless
};
