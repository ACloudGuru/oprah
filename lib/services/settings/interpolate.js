'use strict';

const template = require('lodash.template');

const interpolate = ({ value, variables}) => template(value)(variables);

module.exports = { interpolate };
