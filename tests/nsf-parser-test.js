import parse from '../eight-bit-dream/nsf-parser';
import { expect } from 'chai';
import nsfBytes from './fixtures/mario-nsf';

describe('NSF Parser', function(){

  it('version number', function(){
    const nsf = parse(nsfBytes);
    expect(nsf.version).to.equal(1);
  });

});
