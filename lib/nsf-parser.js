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
    return parseInt(this.bytes.slice(offset, offset + length).join(''), 16);
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
    nsf.load      = bytes.number(0x0008, 2);
    nsf.init      = bytes.number(0x000a, 2);
    nsf.play      = bytes.number(0x000c, 2);
    nsf.name      = bytes.string(0x000e, 32);
    nsf.author    = bytes.string(0x002e, 32);
    nsf.copyright = bytes.string(0x004e, 32);
    const palNtsc = bytes.number(0x007a, 1);
    nsf.standard  = palNtsc & 0b0010 ? "PAL/NTSC" : palNtsc & 0b0001 ? "PAL" : "NTSC";
    const chipBit = bytes.number(0x007b, 1);
    let chip;
    switch(chipBit) {
      case 0b00000001: chip = 'VRCVI'; break;
      case 0b00000010: chip = 'VRCVII'; break;
      case 0b00000100: chip = 'FDS Sound'; break;
      case 0b00001000: chip = 'MMC5 audio'; break;
      case 0b00010000: chip = 'Namco 106'; break;
      case 0b00100000: chip = 'Sunsoft FME-07'; break;
      default:         chip = '';
    }
    nsf.chip = chip;
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
    this.standard = null;
  }
}

export default function(nsfBytes) {
  return new Parser().parse(nsfBytes);
}
