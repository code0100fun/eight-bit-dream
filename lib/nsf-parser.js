function hex2Ascii(bytes) {
  const output = [];
  for (let i = 0; i < bytes.length; i++) {
    let hex = bytes[i];
    let char = String.fromCharCode(parseInt(hex, 16));
    if(char === '\u0000') {
      break;
    }
    output.push(char);
  }
  return output.join('');
}

class Bytes {
  constructor(bytes) {
    this.bytes = bytes;
  }
  number(offset, length) {
    return parseInt(this.bytes[offset], 16);
  }
  string(offset, length) {
    return hex2Ascii(this.bytes.slice(offset, offset + length));
  }
}

class Parser {
  parse(nsfBytes) {
    const nsf     = new NSF();
    const bytes   = new Bytes(nsfBytes);
    nsf.version   = bytes.number(0x0005, 1);
    nsf.songCount = bytes.number(0x0006, 1);
    nsf.startSong = bytes.number(0x0007, 1);
    nsf.name      = bytes.string(0x000e, 32);
    nsf.author    = bytes.string(0x002e, 32);
    nsf.copyright = bytes.string(0x004e, 32);
    return nsf;
  }
}

class NSF {
  constructor() {
    this.version = null;
    this.songCount = null;
    this.startSong = null;
    this.name = null;
    this.author = null;
    this.copyright = null;
  }
}

export default function(nsfBytes) {
  return new Parser().parse(nsfBytes);
}
