'use strict';

const execa = require('execa');
const fs = require('fs');
const Bluebird = require('bluebird');
const path = require('path');

const runServerless = ({ serverlessYamlDirectory, stage }) => {
  if (!serverlessYamlDirectory) {
    return Bluebird.reject(new Error('serverlessYamlDirectory is required.'));
  }

  if (!stage) {
    return Bluebird.reject(new Error('stage is required.'));
  }

  const serverlessYamlPath = path.resolve(serverlessYamlDirectory, 'serverless.yml');
  if (!fs.existsSync(serverlessYamlPath)) {
    return Bluebird.reject(new Error(`Could not find serverless.yml: ${serverlessYamlPath}`))
  }

  return execa('serverless', ['info', '--stage', stage], {
    cwd: serverlessYamlDirectory
  });
};

module.exports = {
  runServerless
};
