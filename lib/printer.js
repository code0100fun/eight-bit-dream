class Printer {
  printRow(row) {
    console.log(row);
    return row.values.join('');
  }
  print(ast) {
    const output = [];
    for(let [i, row] of ast.rows.entries()) {
      console.log('row', row);
      output.push(this.printRow(row));
    }
    return output;
  }
}

export default function(ast) {
  return new Printer().print(ast);
}
