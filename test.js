'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');

var rimraf = require('rimraf');

var istanbulCoveralls = require('require-main')();
var pkg = require('./package.json');

var fixtureLcov = 'TN:\nSF:' +
                  path.resolve('fixture.js') +
                  '\nFNF:0\nFNH:0\nLF:0\nLH:0\nBRF:0\nBRH:0\nend_of_record\n';
var writeLcov = fs.outputFile.bind(null, 'coverage/lcov.info', fixtureLcov);

describe('istanbulCoveralls()', function() {
  beforeEach(rimraf.bind(null, 'coverage'));

  it('should pass an error when lcov.info doesn\'t exist.', function(done) {
    istanbulCoveralls(function(err) {
      assert(err);
      assert.strictEqual(err.code, 'ENOENT');
      done();
    });
  });

  it('should pass an error when it cannot parse lcov.info.', function(done) {
    fs.outputFile('coverage/lcov.info', 'dummy', function(err) {
      assert.ifError(err);
      istanbulCoveralls(function(err) {
        assert.strictEqual(err.message, 'Failed to parse string');
        done();
      });
    });
  });

  it('should not pass an error when it takes valid lcov.info.', function(done) {
    writeLcov(function(err) {
      assert.ifError(err);
      istanbulCoveralls(done);
    });
  });

  it('should not remove ./coverage when `rimraf` option is enabled.', function(done) {
    writeLcov(function(err) {
      assert.ifError(err);
      istanbulCoveralls({rimraf: false}, function(err) {
        assert.ifError(err);
        fs.exists('./coverage', function(exists) {
          assert(exists);
          done();
        });
      });
    });
  });
});

describe('"istanbul-coveralls" command', function() {
  beforeEach(rimraf.bind(null, 'coverage'));

  it('should run index.js script.', function(done) {
    writeLcov(function(err) {
      assert.ifError(err);
      exec('node cli.js', done);
    });
  });

  it('should print error message when the script throws an error.', function(done) {
    fs.outputFile('coverage/lcov.info', 'dummy', function(err) {
      assert.ifError(err);
      exec('node cli.js', function(err) {
        assert(err);
        assert(/Failed to parse string/.test(err.message));
        done();
      });
    });
  });

  it('should not remove ./coverage when `--no-rm` flag is enabled.', function(done) {
    writeLcov(function(err) {
      assert.ifError(err);
      exec('node cli.js --no-rm', function(err) {
        assert.ifError(err);
        fs.exists('./coverage', function(exists) {
          assert(exists);
          done();
        });
      });
    });
  });

  it('should print usage informaion when `--help` flag is enabled.', function(done) {
    exec('node cli.js --help', function(err, stdout) {
      assert(/print usage information/.test(stdout));
      done(err);
    });
  });

  it('should accept `-h` alias.', function(done) {
    exec('node cli.js -h', function(err, stdout) {
      assert(/Example/.test(stdout));
      done(err);
    });
  });

  it('should print version when `--version` flag is enabled.', function(done) {
    exec('node cli.js --version', function(err, stdout) {
      assert.strictEqual(stdout, pkg.version + '\n');
      done(err);
    });
  });

  it('should accept `-v` alias.', function(done) {
    exec('node cli.js -v', function(err, stdout) {
      assert.strictEqual(stdout, pkg.version + '\n');
      done(err);
    });
  });
});
