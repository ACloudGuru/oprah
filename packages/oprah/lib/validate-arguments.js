'use strict';

const Joi = require('joi');
const chalk = require('chalk');

const schema = Joi.object().keys({
  stage: Joi.string().required(),
  service: Joi.string().required(),
  stackName: Joi.string(),
  config: Joi.object().keys({
    defaultPath: Joi.string().required(),
    overridePath: Joi.string().required()
  }).required(),
  secret: Joi.object().keys({
    requiredPath: Joi.string().required(),
    skip: Joi.boolean()
  }).required()
});

const validateArguments = args => {
  Joi.validate(args, schema, err => {
    if (err) {
      console.log(chalk.red(err))
      process.exit(1);
    }
  });
}

module.exports = {
  validateArguments
}