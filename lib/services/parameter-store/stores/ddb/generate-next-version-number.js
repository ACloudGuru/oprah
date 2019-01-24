const padStart = require('lodash.padstart');
const Decimal = require('decimal.js-light');

const padVersionNumber = toPad => padStart(toPad, 20, '0');

const generateNextVersionNumber = ({ currentVersionNumber }) => {
  if (!currentVersionNumber) {
    return padVersionNumber('1');
  }

  try {
    const nextVersionNumber = new Decimal(currentVersionNumber).plus(1).toString();

    return padVersionNumber(nextVersionNumber);
  } catch (error) {
    throw new Error(`Cannot generate next version number for '${currentVersionNumber}'. Current version number must be number.`);
  }
};

module.exports = { generateNextVersionNumber };
