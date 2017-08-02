"use strict";
//
// Version.js
//
// Return the current set version form the package.json.
// If we are in a git repo, we add the current (short) HEAD
// also to the version.

const packageJSON = require('../package.json');

var version;
try {
  version = packageJSON.version + "-" + require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
}
catch (e){
  version = packageJSON.version;
}

module.exports = version;
