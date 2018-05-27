'use strict';

const toISOString = date => {
    if (!date) {
        return null;
    }
    try {
        return new Date(date).toISOString();
    } catch (e) {
        return null;
    }
};

module.exports = {
  toISOString
};
