#!/usr/bin/env node
'use strict';

 // check node version
 const node = require('./utils/checkNode');
 node.checkNodeVersion();

// check internet activity
const network = require('./utils/checkIfOnline');
network.checkIfOnline();

// execute bootstrap
const bootstrap = require('./bootstrap');
bootstrap.init();
