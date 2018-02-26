'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const resolveBin = require('../../utils/resolveBin').resolveBin;

const fileExistsInCallingProject = filename =>
  fs.existsSync(path.join(process.cwd(), filename));

['tslint.json', 'tsconfig.json'].forEach(
  file => !fileExistsInCallingProject(file) && console.log(`missing ${file}!`)
);

const config = ['--config', 'tslint.json'];
const project = ['--project', 'tsconfig.json'];
const args = process.argv.slice(2);

const result = spawn.sync(
  resolveBin('tslint'),
  [...config, ...project, ...args],
  { stdio: 'inherit' }
);

process.exitCode = result.status;
