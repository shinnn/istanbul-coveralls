/*!
 * istanbul-coveralls | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/istanbul-coveralls
*/

'use strict';

var fs = require('fs');

var handleInput = require('coveralls').handleInput;
var rimraf = require('rimraf');

module.exports = function istanbulCoveralls(option, cb) {
  if (cb === undefined) {
    cb = option;
    option = {rimraf: true};
  }

  fs.readFile('./coverage/lcov.info', 'utf8', function(err, content) {
    if (err) {
      cb(err);
      return;
    }

    handleInput(content, function(msg) {
      if (msg) {
        cb(new Error(msg));
        return;
      }

      if (option.rimraf) {
        rimraf('./coverage', cb);
      } else {
        cb();
      }
    });
  });
};
