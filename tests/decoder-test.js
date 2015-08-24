import decode, { Decoder, scale } from '../eight-bit-dream/decoder';
import { expect } from 'chai';

describe('Network output decoder', function() {

  const decoder = new Decoder();

  describe('scale', function() {
    describe('with a range of 2 - 3 with allow blank', function() {
      it('0 is in the blank range', function() {
        expect(scale(0, 3, 2, true)).to.eq('');
      });
      it('0.33 is in the blank range', function() {
        expect(scale(0.33, 3, 2, true)).to.eq('');
      });
      it('0.34 is in the 2 range', function() {
        expect(scale(0.34, 3, 2, true)).to.eq('2');
      });
      it('0.66 is in the 2 range', function() {
        expect(scale(0.66, 3, 2, true)).to.eq('2');
      });
      it('0.67 is in the 3 range', function() {
        expect(scale(0.67, 3, 2, true)).to.eq('3');
      });
      it('1 is in the 3 range', function() {
        expect(scale(1, 3, 2, true)).to.eq('3');
      });
    });

    describe('with a range of 2 - 5 with no blank', function() {
      it('0 is in the 2 range', function() {
        expect(scale(0, 5, 2, false)).to.eq('2');
      });
      it('0.24 is in the 2 range', function() {
        expect(scale(0.24, 5, 2, false)).to.eq('2');
      });
      it('0.25 is in the 3 range', function() {
        expect(scale(0.25, 5, 2, false)).to.eq('3');
      });
      it('0.49 is in the 3 range', function() {
        expect(scale(0.49, 5, 2, false)).to.eq('3');
      });
      it('0.5 is in the 4 range', function() {
        expect(scale(0.5, 5, 2, false)).to.eq('4');
      });
      it('0.74 is in the 4 range', function() {
        expect(scale(0.74, 5, 2, false)).to.eq('4');
      });
      it('0.75 is in the 5 range', function() {
        expect(scale(0.75, 5, 2, false)).to.eq('5');
      });
      it('1 is in the 5 range', function() {
        expect(scale(1, 5, 2, false)).to.eq('5');
      });
    });
  });

  describe('#noteValue', function() {
    it('decodes the half-step note for the max value slot', function() {
      const actual = decoder.noteValue([0,0.8,0,0,0,0.1,0,0.3,0,0,0,0])
      expect(actual).to.eq('C#');
    });
  });

  describe('#noteOctave', function() {
    it('scales 0 to 2', function() {
      expect(decoder.noteOctave(0)).to.eq('2');
    });
    it('scales 0.49 to 3', function() {
      expect(decoder.noteOctave(0.49)).to.eq('3');
    });
    it('scales 0.5 to 4', function() {
      expect(decoder.noteOctave(0.5)).to.eq('4');
    });
    it('scales 1 to 5', function() {
      expect(decoder.noteOctave(1)).to.eq('5');
    });
  });

  describe('#volume', function() {
    it('scales 0 to blank', function() {
      expect(decoder.volume(0)).to.eq('');
    });
    it('scales 0.5 to 7', function() {
      expect(decoder.volume(0.5)).to.eq('7');
    });
    it('scales 1 to F', function() {
      expect(decoder.volume(1)).to.eq('F');
    });
  });

  describe('#pitchEffect', function() {
    it('scales 0 to blank', function() {
      expect(decoder.pitchEffect(0)).to.eq('');
    });
    it('scales 0.25 to P7C', function() {
      expect(decoder.pitchEffect(0.3)).to.eq('P7C');
    });
    it('scales 0.35 to P7C', function() {
      expect(decoder.pitchEffect(0.35)).to.eq('P7D');
    });
    it('scales 0.5 to P7E', function() {
      expect(decoder.pitchEffect(0.5)).to.eq('P7E');
    });
    it('scales 0.75 to P7F', function() {
      expect(decoder.pitchEffect(0.75)).to.eq('P7F');
    });
    it('scales 1 to P80', function() {
      expect(decoder.pitchEffect(1)).to.eq('P80');
    });
  });

  describe('#volumeEffect', function() {
    it('scales 0 to blank', function() {
      expect(decoder.volumeEffect(0)).to.eq('');
    });
    it('scales 0.19 to blank', function() {
      expect(decoder.volumeEffect(0.17)).to.eq('');
    });
    it('scales 0.2 to V00', function() {
      expect(decoder.volumeEffect(0.2)).to.eq('V00');
    });
    it('scales 0.39 to V00', function() {
      expect(decoder.volumeEffect(0.39)).to.eq('V00');
    });
    it('scales 0.4 to V01', function() {
      expect(decoder.volumeEffect(0.4)).to.eq('V01');
    });
    it('scales 0.59 to V01', function() {
      expect(decoder.volumeEffect(0.59)).to.eq('V01');
    });
    it('scales 0.6 to V02', function() {
      expect(decoder.volumeEffect(0.6)).to.eq('V02');
    });
    it('scales 0.79 to V02', function() {
      expect(decoder.volumeEffect(0.79)).to.eq('V02');
    });
    it('scales 0.8 to V03', function() {
      expect(decoder.volumeEffect(0.8)).to.eq('V03');
    });
    it('scales 1 to V03', function() {
      expect(decoder.volumeEffect(1)).to.eq('V03');
    });
  });

  it('turns network output frames into FTM AST', function() {
    const ast = decode([
      [
        0.1, 0.81, 0.1, 0.11, 0.5, 0.2, 0.1, 0, 0, 0, 0.1, // note 1
        0,   // note 1 stop
        0.3, // note 1 octave
        0.8, // note 1 volume
        0,   // note 1 pitch FX
        0.3, // note 1 volume FX
        0, 0.2, 0, 0.1, 0, 0, 0, 0.7, 0, 0, 0, 0, // note 2
        0,   // note 2 stop
        0.5, // note 2 octave
        0.5, // note 2 volume
        0.5, // note 2 pitch FX
        0,   // note 2 volume FX
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // note 3
        0.99,// note 3 stop
        0,   // note 3 octave
        0.98,// note 3 pitch FX
        0.5, // note 4 noise
        0.5  // note 4 noise volume
      ]
    ]);

    const expected = { rows: [{
      index: 0,
      name: 'ROW',
      values: [
        { type: 'note', value: 'C#3' }, // note 1
        '00',                           // instrument select
        'C',                            // note 1 volume
        '',                             // note 1 pitch effect
        'V00',                          // note 1 volume effect
        '',
        ':',
        { type: 'note', value: 'G-4' }, // note 2
        '00',                           // instrument select
        '7',                            // note 2 volume
        'P7E',                          // note 2 pitch effect
        '',                             // note 2 volume effect
        '',
        ':',
        { type: 'stop' },               // note 3
        '00',                           // instrument select
        '',                             // note 3 volume
        'P80',                          // note 3 pitch effect
        ':',
        '7-#',                          // note 4 noise effect
        '00',                           // instrument select
        '7',                            // note 4 volume
        'V00',                          // note 4 volume effect
        ':',
        '===',
        '00',
        '',
        '',
        ''
      ]
    }]};
    expect(ast).to.deep.equal(expected);
  });

});
