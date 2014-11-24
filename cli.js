#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version'
  },
  boolean: ['help', 'rm', 'version']
});

if (argv.version) {
  console.log(require('./package.json').version);
} else if (argv.help) {
  var chalk = require('chalk');
  var pkg = require('./package.json');

  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description,
    '',
    'Example:',
    '  istanbul cover test.js && istanbul-coveralls',
    'Options:',
    chalk.yellow('  --h, --help   ') + '  print usage information',
    chalk.yellow('  --v, --version') + '  print version',
    chalk.yellow('  --no-rm       ') + '  preserve ./coverage directory after coverage reporting'
  ].join('\n'));
} else {
  require('./')({rimraf: argv.rm}, function(err) {
    if (err) {
      throw err;
    }
  });
}
