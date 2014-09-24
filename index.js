/*!
 * istanbul-coveralls | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/istanbul-coveralls
*/

'use strict';

var fs = require('fs');

var handleInput = require('coveralls').handleInput;
var rimraf = require('rimraf');

module.exports = function istanbulCoveralls(_option, cb) {
  var option;
  if (cb === undefined) {
    cb = _option;
    option = {rimraf: true};
  } else {
    option = _option;
  }

  fs.readFile('./coverage/lcov.info', {encoding: 'utf-8'}, function(err, buf) {
    if (err) {
      cb(err);
      return;
    }

    handleInput(buf.toString(), function(msg) {
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
