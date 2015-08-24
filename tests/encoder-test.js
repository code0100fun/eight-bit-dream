import encode from '../eight-bit-dream/encoder';
import parse from '../eight-bit-dream/ftm-text-parser';
import { expect } from 'chai';
import ftmText from './fixtures/short.txt';

function encodeText(ftmText) {
  const ast = parse(ftmText);
  return encode(ast);
}

describe('FTM Text Parser', function() {

  it('parses correct number of patterns', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows.length).to.equal(12);
  });

  it('contains a C# for the 2nd row 1st note', function() {
    const ftm = encodeText(ftmText); //            C  C# ...
    expect(ftm.rows[1].slice(0,12)).to.deep.equal([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('contains a stop for the 1st row 1st note', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[0][12]).to.equal(1);
  });

  it('contains a 3 for the 2nd row 1st note octave', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][13]).to.equal(1/3);
  });

  it('contains a E(14) for the 2nd row 1st note volume', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][14]).to.equal(15/16); // scaled value + 1 / max + 1
  });

  it('contains 80 for the 2nd row 1st note pitch effect', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[0][15]).to.equal(1);
  });

  it('contains 0 for the 2nd row 1st note volume effect', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[0][16]).to.equal(0.25);
  });

  it('contains a A# for the 2nd row 2nd note', function() {
    const ftm = encodeText(ftmText); //             C  C# ...
    expect(ftm.rows[1].slice(17,29)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
  });

  it('contains a stop for the 1st row 2nd note', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[0][29]).to.equal(1);
  });

  it('contains a 2 for the 2nd row 2nd note octave', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][30]).to.equal(0.0);
  });

  it('contains a D(13) for the 2nd row 2nd note volume', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][31]).to.equal(14/16); // scaled value + 1 / max + 1
  });

  it('contains 7E for the 2nd row 2nd note pitch effect', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][32]).to.equal(0.6);
  });

  it('contains 1 for the 2nd row 2nd note volume effect', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][33]).to.equal(0.50);
  });

  it('contains a C# for the 2nd row 3rd note', function() {
    const ftm = encodeText(ftmText); //             C  C# ...
    expect(ftm.rows[1].slice(34,46)).to.deep.equal([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('contains a stop for the 1st row 3rd note', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[0][46]).to.equal(1);
  });

  it('contains a 4 for the 2nd row 3rd note octave', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][47]).to.equal(2/3);
  });

  it('contains 7C for the 2nd row 3rd note pitch effect', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][48]).to.equal(0.2);
  });

  it('contains a D for the 2nd row 4th note noise', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][49]).to.equal(14/16);
  });

  it('contains a F(15) for the 2nd row 4th note volume', function() {
    const ftm = encodeText(ftmText);
    expect(ftm.rows[1][50]).to.equal(1);
  });

});
