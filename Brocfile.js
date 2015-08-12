var pickFiles = require('broccoli-static-compiler');
var compileModules = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');

var libTreeES6 = pickFiles('lib', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/'
});

var libTree = compileModules(libTreeES6, {
  modules: 'umd'
});

module.exports = mergeTrees([
  libTree
]);
