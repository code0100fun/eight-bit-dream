import parse from '../eight-bit-dream/nsf-parser';
import { expect } from 'chai';
import nsfBytes from './fixtures/zelda-nsf';

function hex(number) {
  return number.toString(16);
}

describe('NSF Parser', function(){

  it('version number', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.version).to.equal(1);
  });

  it('song count', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.songCount).to.equal(1);
  });

  it('start song', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.startSong).to.equal(1);
  });

  it('name', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.name).to.equal('The Legend of Zelda');
  });

  it('author', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.author).to.equal('Koji Kondo');
  });

  it('copyright', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.copyright).to.equal('1987 Nintendo');
  });

  it('standard', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.standard).to.equal('PAL/NTSC');
  });

  it('chip', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.chip).to.equal('');
  });

  it('load address', function(){
    const nsf = parse(nsfBytes);
    expect(hex(nsf.load)).to.equal(hex(0x0080));
  });

  it('init address', function(){
    const nsf = parse(nsfBytes);
    expect(hex(nsf.init)).to.equal(hex(0x0080));
  });

  it('play address', function(){
    const nsf = parse(nsfBytes);
    expect(hex(nsf.play)).to.equal(hex(0x0380));
  });

});
