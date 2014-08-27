# istanbul-coveralls 

[![NPM version](https://badge.fury.io/js/istanbul-coveralls.svg)](https://www.npmjs.org/package/istanbul-coveralls)
[![Build Status](https://travis-ci.org/shinnn/istanbul-coveralls.svg?branch=master)](https://travis-ci.org/shinnn/istanbul-coveralls)
[![Dependency Status](https://david-dm.org/shinnn/istanbul-coveralls.svg)](https://david-dm.org/shinnn/istanbul-coveralls)
[![devDependency Status](https://david-dm.org/shinnn/istanbul-coveralls/dev-status.svg)](https://david-dm.org/shinnn/istanbul-coveralls#info=devDependencies)

A simple alias for [istanbul](https://github.com/gotwarlost/istanbul) + [node-coveralls](https://github.com/cainus/node-coveralls)

```
istanbul cover test.js && cat ./coverage/lcov.info | coveralls && rm -rf ./coverage
```

↓

```
istanbul cover test.js && istanbul-coveralls
```

## Installation

[Install with npm](https://www.npmjs.org/doc/cli/npm-install.html). (Make sure you have installed [Node](http://nodejs.org/))

```
npm install --save istanbul istanbul-coveralls
```

## Usage

1. Write a coverage information file under `./coverage` by using [`istanbul cover` command](https://github.com/gotwarlost/istanbul#the-cover-command) or [the API of istanbul](https://github.com/gotwarlost/istanbul#api).
2. Run `istanbul-coveralls` command. See [the docs of node-coveralls](https://github.com/cainus/node-coveralls#usage) for more information about its usage.

### Option

#### `--no-rm`

By default, it removes `./coverage` after coverage reporting. If `--no-rm` flag is enabled, it doesn't remove the directory.

```
istanbul cover test.js && istanbul-coveralls --no-rm
```

## Example

### [Mocha](http://visionmedia.github.io/mocha/) and [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter)

```
istanbul cover ./node_modules/.bin/_mocha && ./node_modules/.bin/istanbul-coveralls
```

If you run the test as a [npm script](https://www.npmjs.org/doc/misc/npm-scripts.html), [you can omit directory names from the command](https://www.npmjs.org/doc/misc/npm-scripts.html#path).

```
istanbul cover _mocha && istanbul-coveralls
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT LIcense](./LICENSE).
