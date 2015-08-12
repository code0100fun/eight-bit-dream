class Parser {
  parse(nsfBytes) {
    const nsf = new NSF();
    nsf.version = parseInt(nsfBytes[0x0005], 16);
    nsf.songCount = parseInt(nsfBytes[0x0006], 16);
    nsf.startSong = parseInt(nsfBytes[0x0007], 16);
    return nsf;
  }
}

class NSF {
  constructor() {
    this.version = null;
    this.songCount = null;
    this.startSong = null;
  }
}

export default function(nsfBytes) {
  return new Parser().parse(nsfBytes);
}
