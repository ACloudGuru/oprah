'use strict';

const execa = require('execa');
const fs = require('fs');
const Bluebird = require('bluebird');
const path = require('path');

const runServerless = ({ serverlessYamlDirectory, stage }) => {
  if (!serverlessYamlDirectory) {
    return Bluebird.reject(new Error('Please specify serverlessYamlDirectory for runServerless'));
  }

  if (!stage) {
    return Bluebird.reject(new Error('Please specify stage for runServerless'));
  }

  const serverlessYamlPath = path.resolve(serverlessYamlDirectory, 'serverless.yml');

  if (!fs.existsSync(serverlessYamlPath)) {
    return Bluebird.reject(new Error(`Could not find serverless.yml: ${serverlessYamlPath}`))
  }

  const childProcess = execa('serverless', ['deploy', '--stage', stage], { cwd: serverlessYamlDirectory });

  childProcess.stdout.pipe(process.stdout);

  return childProcess;
};

module.exports = {
  runServerless
};
