'use strict';

function OprahError(message) {
    this.name = 'OprahError';
    this.message = message;
    this.stack = (new Error()).stack;
}

OprahError.prototype = new Error;

module.exports = { OprahError };
