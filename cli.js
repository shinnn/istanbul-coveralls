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
  var sumUp = require('sum-up');
  var yellow = require('chalk').yellow;

  var pkg = require('./package.json');

  console.log([
    sumUp(pkg),
    '',
    'Example:',
    '  istanbul cover test.js && istanbul-coveralls',
    'Options:',
    yellow('  -h, --help   ') + '  print usage information',
    yellow('  -v, --version') + '  print version',
    yellow('      --no-rm  ') + '  preserve ./coverage directory after coverage reporting'
  ].join('\n'));
} else {
  require('./')({rimraf: argv.rm}, function(err) {
    if (err) {
      throw err;
    }
  });
}
