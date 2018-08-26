'use strict';

const mapValues = require('lodash.mapvalues');
const format = require('string-template');

const interpolate = ({ values, variables }) =>
  mapValues(values, value => format(value.toString().replace('$', ''), variables));

module.exports = { interpolate };
