function scale(value, max, min, nullOffset) {
  min = typeof(min) === 'undefined' ? 0 : min;
  nullOffset = nullOffset ? 1 : 0;
  const range = max - min;
  const inclusive = 1;
  const shift = min - nullOffset - 0.5;
  const bucketRange = (range + inclusive + nullOffset);
  const scaled = bucketRange * value + shift;
  value = Math.round(scaled);
  if(value > max) {
    value = max;
  }
  if(value < min - nullOffset) {
    value = min - nullOffset;
  }
  return nullOffset && value === (min - nullOffset) ? '' : value.toString(16).toUpperCase();
}

function pad(value) {
  return value && ( '0' + value).substr(-2);
}

function prefix(chars, value) {
  return value && chars + value;
}

function postfix(chars, value) {
  return value && value + chars;
}

function maxi(array) {
  let max = array[0];
  let i = 0;
  for(let [j, value] of array.entries()) {
    if(value > max) {
      max = value;
      i = j;
    }
  }
  return i;
}

class Decoder {
  note(note, octave, stop) {
    if(Math.round(stop)) {
      return { type: 'stop' };
    } else {
      return { type: 'note', value: note + octave };
    }
  }
  noteStop(stop) {
    return stop > 0.5 ? { type: 'stop' } : '';
  }
  noteOctave(octave) {
    return scale(octave, 5, 2);
  }
  volume(vol) {
    return scale(vol, 15, 0, 1);
  }
  pitchEffect(pitch) {
    // p = 0.0 => '', p = 1.0 => P80
    return prefix('P', pad(scale(pitch, 0x80, 0x7C, 1)));
  }
  noiseValue(noise){
    return postfix('-#', scale(noise, 0xF, 0, 1));
  }
  volumeEffect(vol) {
    // v = 0.0 => '', v = 0.25 => V00, v = 1.0 => V03
    return prefix('V', pad(scale(vol, 3, 0, 1)));
  }
  instrumentSelect(note) {
    if(!note[0]) {
      return '';
    }else{
      return '00';
    }
  }
  noteValue(onehot) {
    const i = maxi(onehot);
    if(i === -1) {
      return [,];
    }
    return [
      ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'][i],
      ['-', '#', '-', '#', '-', '-', '#', '-', '#', '-', '#', '-'][i]
    ].join('');
  }
  frameValues(frame, index) {
    let i = 0;
    const note1Value = this.noteValue(frame.slice(i, i+=11));
    const note1Stop = frame[i++];
    const note1Octave = this.noteOctave(frame[i++]);
    const note1Volume = this.volume(frame[i++]);
    const note1PitchFX = this.pitchEffect(frame[i++]);
    const note1VolumeFX = this.volumeEffect(frame[i++]);

    const note2Value = this.noteValue(frame.slice(i++, i+=11));
    const note2Stop = frame[i++];
    const note2Octave = this.noteOctave(frame[i++]);
    const note2Volume = this.volume(frame[i++]);
    const note2PitchFX = this.pitchEffect(frame[i++]);
    const note2VolumeFX = this.volumeEffect(frame[i++]);

    const note3Value = this.noteValue(frame.slice(i++, i+=11));
    const note3Stop = frame[i++];
    const note3Octave = this.noteOctave(frame[i++]);
    const note3PitchFX = this.pitchEffect(frame[i++]);

    const note4Value = this.noiseValue(frame[i++]);
    const note4Volume = this.volume(frame[i++]);

    return [
      this.note(note1Value, note1Octave, note1Stop),
      this.instrumentSelect(note1Value),
      note1Volume,
      note1PitchFX,
      note1VolumeFX,
      '',
      ':',
      this.note(note2Value, note2Octave, note2Stop),
      this.instrumentSelect(note2Value),
      note2Volume,
      note2PitchFX,
      note2VolumeFX,
      '',
      ':',
      this.note(note3Value, note3Octave, note3Stop),
      this.instrumentSelect(note3Value),
      '',
      note3PitchFX,
      ':',
      note4Value,
      this.instrumentSelect(note4Value),
      note4Volume,
      this.volumeEffect(index === 0 ? 0.25 : 0),
      ":",
      (index === 0 ? "===" : ""),
      (index === 0 ? "00" : ""),
      "",
      "",
      ""
    ];
  }
  decodeFrame(frame, index) {
    const values = this.frameValues(frame, index);
    return {
      name: 'ROW',
      index: index,
      values: values
    };
  }
  decode(outputs) {
    const rows = [];
    for(let [i, frame] of outputs.entries()) {
      rows.push(this.decodeFrame(frame, i));
    }
    return { rows: rows };
  }
}

export { Decoder, scale };

export default function(outputs) {
  return new Decoder().decode(outputs);
}
