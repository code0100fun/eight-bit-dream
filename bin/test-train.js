var Model = require('../dist/eight-bit-dream/model');
var parse = require('../dist/eight-bit-dream/ftm-text-parser');
var encode = require('../dist/eight-bit-dream/encoder')['default'];
var decode = require('../dist/eight-bit-dream/decoder')['default'];
var ftmText = require('../dist/tests/fixtures/M2TF.txt');
// var ftmText = require('../dist/tests/fixtures/short.txt');
var print = require('../dist/eight-bit-dream/printer');

var ast = parse(ftmText);
var ftm = encode(ast);
var inputSize = ftm.rows[0].length;
var model = new Model(inputSize, [inputSize * 2, inputSize * 2]);

var rows = ftm.rows.slice(0, 1);
model.train(ftm.rows.slice(0, 100));

var outputs = model.predict(4);

// console.log(outputs);
var outAst = decode(outputs);
// console.log(print(outAst));

// console.log('Prediction:');
// console.log(rows);
