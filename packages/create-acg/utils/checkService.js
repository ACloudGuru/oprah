#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

const errors = require('./printErrors');

// check service type is valid
function checkServiceTypeValid({ type }) {
  if (type !== 'frontend' && type !== 'backend') {
    errors.printInvalidTypeError({ type });
    process.exit(1);
  }
}

// check service name
function checkServiceNameValid({ name }) {
  // TODO: check proposed name against existing services
  // existing services
  const duplicateName = false;
  if (duplicateName) {
    errors.printInvalidNameError({ name });
    process.exit(1);
  }
}

// These files should be allowed to remain on a failed install,
// but then silently removed during the next create.
const errorLogFilePatterns = [
  'npm-debug.log',
  'yarn-error.log',
  'yarn-debug.log',
];

function isSafeToCreateProjectIn({
  name,
  newServiceFullPath,
  relativeDirToCreate,
}) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes',
  ];

  const conflicts = fs
    .readdirSync(newServiceFullPath)
    .filter(file => !validFiles.includes(file))
    // Don't treat log files from previous installation as conflicts
    .filter(
      file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0)
    );

  if (conflicts.length > 0) {
    errors.printInvalidDirError({
      name,
      newServiceFullPath,
      relativeDirToCreate,
      fileConflicts: conflicts,
    });

    return false;
  }

  // Remove any remnant files from a previous installation
  const currentFiles = fs.readdirSync(path.join(newServiceFullPath));
  currentFiles.forEach(file => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(newServiceFullPath, file));
      }
    });
  });
  return true;
}

module.exports = {
  checkServiceTypeValid,
  checkServiceNameValid,
  isSafeToCreateProjectIn,
};
