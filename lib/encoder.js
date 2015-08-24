class Encoder {
  noteStop(noteOctave) {
    return noteOctave && noteOctave.type === 'stop' ? 1 : 0;
  }
  volumeEffect(hex) {
    if(!hex) {
      return 0;
    }
    const value = parseInt(hex.slice(1,3), 16);
    const min = 0, max = 3;
    const scaled = (value + 1 - min) * 1/(max - min + 1);
    return scaled;
  }
  pitchEffect(hex) {
    if(!hex) {
      return 0;
    }
    const value = parseInt(hex.slice(1,3), 16);
    const min = 0x7C, max = 0x80;
    const scaled = (value + 1 - min) * 1/(max - min + 1);
    return scaled;
  }
  noteVolume(value) {
    if(value === '') {
      return 0;
    }
    const min = 0, max = 15;
    const scaled = (value + 1 - min) * 1/(max - min + 1);
    return scaled;
  }
  noteOctave(noteOctave) {
    if(!noteOctave || noteOctave.type !== 'note') {
      return 0;
    }
    const octave = noteOctave.value.slice(2, 3);
    const min = 2, max = 5;
    return (~~octave - min) * 1/(max - min);
  }
  noiseValue(noise) {
    if(!noise || noise.type !== 'noise' ) {
      return 0;
    }
    const min = 0, max = 0xF;
    const value = parseInt(noise.value.slice(0, 1), 16);
    return (value - min + 1) * 1/(max - min + 1);
  }
  noteValue(noteOctave) {
    //              C     D     E  F     G     A     B
    const value = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if(!noteOctave || noteOctave.type === 'stop' ) {
      return value;
    }

    const note = noteOctave.value.slice(0, 1);
    const halfstep = noteOctave.value.slice(1, 2);
    const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
    const halfstepMap = { '-' : 0, '#' : 1 };
    value[noteMap[note] + halfstepMap[halfstep]] = 1;
    return value;
  }
  encodeRow(row) {
    return [
      ...(this.noteValue(row.values[0])), // note 1 halfstep
      this.noteStop(row.values[0]),       // note 1 stop
      this.noteOctave(row.values[0]),     // note 1 octave
      this.noteVolume(row.values[2]),     // note 1 volume
      this.pitchEffect(row.values[3]),    // note 1 pitch effect
      this.volumeEffect(row.values[4]),   // note 1 volume effect

      ...(this.noteValue(row.values[7])), // note 2 halfstep
      this.noteStop(row.values[7]),       // note 2 stop
      this.noteOctave(row.values[7]),     // note 2 octave
      this.noteVolume(row.values[9]),     // note 2 volume
      this.pitchEffect(row.values[10]),   // note 2 pitch effect
      this.volumeEffect(row.values[11]),  // note 2 volume effect

      ...(this.noteValue(row.values[14])), // note 3 halfstep
      this.noteStop(row.values[14]),       // note 3 stop
      this.noteOctave(row.values[14]),     // note 3 octave
      this.pitchEffect(row.values[17]),    // note 3 pitch effect

      this.noiseValue(row.values[19]),     // note 4 noise value
      this.noteVolume(row.values[21])      // note 4 volume effect
    ];
  }
  encode(ast) {
    const rows = [];
    for(let node of ast) {
      if(node.type === 'pattern') {
        for(let row of node.rows) {
          rows.push(this.encodeRow(row));
        }
      }
    }
    return { rows: rows };
  }
}

export { Encoder };

export default function(ast) {
  return new Encoder().encode(ast);
}
