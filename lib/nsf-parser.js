class Parser {
  parse(nsfBytes) {
    const nsf = new NSF();
    nsf.version = parseInt(nsfBytes[0x0005], 16);
    return nsf;
  }
}

class NSF {
  constructor() {
    this.version = null;
  }
}

export default function(nsfBytes) {
  return new Parser().parse(nsfBytes);
}
