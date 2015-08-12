import parse from '../eight-bit-dream/nsf-parser';
import { expect } from 'chai';
import nsfBytes from './fixtures/mario-nsf';

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

});
