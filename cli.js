#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');

if (argv.v || argv.version) {
  console.log(pkg.version);
} else if (argv.h || argv.help) {
  var chalk = require('chalk');
  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description,
    '',
    'Example:',
    '  istanbul cover test.js && istanbul-coveralls',
    'Option:',
    chalk.yellow('  --h, --help   ') + '  print usage information',
    chalk.yellow('  --v, --version') + '  print version',
    chalk.yellow('  --no-rm       ') + '  preserve ./coverage directory after coverage reporting'
  ].join('\n'));
} else {
  var option = {rimraf: true};
  if (argv.rm === false) {
    option.rimraf = false;
  }

  require('./')(option, function(err) {
    if (err) {
      throw err;
    }
  });
}
