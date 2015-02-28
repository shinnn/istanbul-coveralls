// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* eslint no-shadow: 0 */
'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var outputFile = require('output-file');
var rimraf = require('rimraf');

var istanbulCoveralls = require('./');
var pkg = require('./package.json');

var fixtureLcov;
/* istanbul ignore if */
if (process.env.npm_lifecycle_event === 'coveralls') {
  fixtureLcov = fs.readFileSync('coverage/lcov.info');
} else {
  fixtureLcov = 'TN:\nSF:' + path.resolve('fixture.js') +
                '\nFNF:0\nFNH:0\nLF:0\nLH:0\nBRF:0\nBRH:0\nend_of_record\n';

  // Set temporary JOB ID for testing
  process.env.COVERALLS_SERVICE_JOB_ID = '33674997';
}

var writeLcov = outputFile.bind(null, 'coverage/lcov.info', fixtureLcov);

before(fs.writeFile.bind(null, './fixture.js', ''));
beforeEach(rimraf.bind(null, './coverage'));
after(rimraf.bind(null, './fixture.js'));

describe('istanbulCoveralls()', function() {
  it('should pass an error when lcov.info doesn\'t exist.', function(done) {
    istanbulCoveralls(function(err) {
      assert(err);
      assert.strictEqual(err.code, 'ENOENT');
      done();
    });
  });

  it('should not overwrite arguments.', function(done) {
    var callback = function() {
      assert.strictEqual(typeof callback, 'function');
      done();
    };
    istanbulCoveralls(callback);
  });

  it('should pass an error when it cannot parse lcov.info.', function(done) {
    outputFile('coverage/lcov.info', 'dummy', function(err) {
      assert.strictEqual(err, null);
      istanbulCoveralls(function(err) {
        assert.strictEqual(err.message, 'Failed to parse string');
        done();
      });
    });
  });

  it('should not pass an error when it takes valid lcov.info.', function(done) {
    writeLcov(function(err) {
      assert.strictEqual(err, null);
      istanbulCoveralls(done);
    });
  });

  it('should not remove ./coverage when `rimraf` option is enabled.', function(done) {
    writeLcov(function(err) {
      assert.strictEqual(err, null);
      istanbulCoveralls({rimraf: false}, function(err) {
        assert.strictEqual(err, undefined);
        assert.equal(arguments.length, 0);
        fs.stat('./coverage', function(err, stat) {
          assert.strictEqual(err, null);
          assert(stat.isDirectory());
          done();
        });
      });
    });
  });
});

describe('"istanbul-coveralls" command', function() {
  it('should run index.js script.', function(done) {
    writeLcov(function(err) {
      assert.strictEqual(err, null);
      exec('node cli.js', done);
    });
  });

  it('should print error message when the script throws an error.', function(done) {
    outputFile('coverage/lcov.info', 'dummy', function(err) {
      assert.ifError(err);
      exec('node cli.js', function(err) {
        assert(err);
        assert(/Failed to parse string/.test(err.message));
        done();
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

  it('should not remove ./coverage when `--no-rm` flag is enabled.', function(done) {
    writeLcov(function(err) {
      assert.strictEqual(err, null);
      exec('node cli.js --no-rm', function(err) {
        assert.strictEqual(err, null);
        fs.stat('./coverage', function(err, stat) {
          assert.strictEqual(err, null);
          assert(stat.isDirectory());
          done();
        });
      });
    });
  });
});
