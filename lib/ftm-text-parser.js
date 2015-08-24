import parse from './parser/ftm-text';

class Parser {
  parse(ftmText) {
    return parse(ftmText);
  }
}

export default function(ftmText) {
  return new Parser().parse(ftmText);
}
