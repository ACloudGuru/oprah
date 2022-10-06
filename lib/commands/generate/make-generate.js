/* eslint-disable no-template-curly-in-string */
const { writeFile, existsSync } = require('fs');
const { dump } = require('js-yaml');

const defaultConfig = {
  service: 'my-service',
  provider: {
    name: 'ssm'
  },
  config: {
    path: '/${stage}/config',
    defaults: {
      DB_NAME: 'my-database',
      DB_HOST: 3200
    },
    required: {
      DB_TABLE: 'some database table name for ${stage}'
    }
  },
  secret: {
    path: '/${stage}/secret',
    required: {
      DB_PASSWORD: 'secret database password'
    }
  }
};

const makeGenerate = () => async () => {
  if (existsSync('oprah.yml')) {
    throw new Error(
      `oprah.yml file already exists in the following directory -- ${process.cwd()}`
    );
  }

  writeFile('oprah.yml', dump(defaultConfig), () => {});
};

module.exports = {
  defaultConfig,
  makeGenerate
};
