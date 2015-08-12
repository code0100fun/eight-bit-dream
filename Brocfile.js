var pickFiles = require('broccoli-static-compiler');
var compileModules = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var concat = require('broccoli-concat');

var libTreeES6 = pickFiles('lib', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/eight-bit-dream'
});

var testsTreeES6 = pickFiles('tests', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/tests'
});

var libTree = compileModules(libTreeES6, {
  modules: 'umd',
  moduleIds: true
});

var testsTree = compileModules(testsTreeES6, {
  modules: 'umd',
  moduleIds: true
});

var libConcat = concat(libTree, {
  inputFiles: [ '**/*.js' ],
  outputFile: '/eight-bit-dream.js'
});

var testsConcat = concat(testsTree, {
  inputFiles: [ '**/*.js' ],
  outputFile: '/tests.js'
});

var cpToTest = function(absPath) {
  var dir = path.dirname(absPath);
  var filename = path.basename(absPath);
  return pickFiles(dir, {
    srcDir: '/',
    files: [filename],
    destDir: '/tests'
  });
}

var testIndex = cpToTest('tests/index.html');
var loader = cpToTest('node_modules/loader.js/loader.js');

module.exports = mergeTrees([
  libTree,
  testsTree,
  testIndex,
  testsConcat,
  libConcat,
  loader
]);
