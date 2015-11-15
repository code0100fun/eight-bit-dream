import R from './recurrent';

class Model {
  constructor(inputSize, hiddenLayers) {
    this.hiddenLayers = hiddenLayers;
    this.inputSize = inputSize;
    this.model = R.initLSTM(inputSize, hiddenLayers, inputSize);
    this.solver = new R.Solver();
    this.learningRate = 0.01;
    this.regc = 0.000001;
    this.clip = 5.0;
  }
  train(rows) {
    const graph = new R.Graph();
    let lastOutput = {};

    for(let [i, row] of rows.entries()) {
      const nextRow = rows[i + 1];
      if(!nextRow) {
        break;
      }
      const input = this.rowToMatrix(row);
      const output = R.forwardLSTM(graph, this.model, this.hiddenLayers, input, lastOutput);

      for(let [j, value] of nextRow.entries()) {
        // output.o.dw[j] = value - output.o.dw[j];
        output.o.dw[j] = output.o.dw[j] - value;
      }

      graph.backward();
      this.solver.step(this.model, this.learningRate, this.regc, this.clip);

      lastOutput = output;
    }
  }
  rowToMatrix(row) {
    const matrix = new R.Mat(this.inputSize, 1);
    if(typeof(row) === 'array') {
      for(let [i, w] of row.entries()) {
        matrix.w[i] = w;
      }
    }else{
      for(let i = 0; i < row.length; i++) {
        matrix.w[i] = row[i];
      }
    }
    return matrix;
  }
  emptyRow(size) {
    return Array.apply(null, Array(size)).map(function() { return 0; });
  }
  predict(sampleCount) {
    const graph = new R.Graph(false);
    let lastOutput = {};
    const rows = [];

    let input = this.rowToMatrix(this.emptyRow(this.inputSize));
    console.log('input', input);
    // let input = this.model.bd;

    for(let i = 0; i < sampleCount; i++) {
      const output = R.forwardLSTM(graph, this.model, this.hiddenLayers, input, lastOutput);
      lastOutput = output;
      input = output.o;
      console.log('next input', input);

      rows.push(output.o.w);
    }
    return rows;
  }
}

export default Model;
