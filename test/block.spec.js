const SHA256 = require('crypto-js/sha256');
const expect = require('chai').expect;
const block = require('../block.js');

describe('Block Test', () => {
  it('should create and return new valid block', function (done) {
    this.timeout = 10000;
    const newBlock = block();
    newBlock.create({
      previousHash: '999999',
      height: 1524 + 1,
      difficulty: 1,
      transactions: Array(10).fill().map(() => SHA256(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString()),
    });
    expect(newBlock.view()).to.have.property('hash').that.is.a('string');
    expect(newBlock.view()).to.have.property('previousHash').that.is.a('string');
    expect(newBlock.view()).to.have.property('height').that.is.a('number');
    expect(newBlock.view()).to.have.property('transactions').that.is.an('array');
    expect(newBlock.view()).to.have.property('nonce').that.is.a('number');
    done();
  });


  it('should create a Genesis Block and return it', function (done) {
    this.timeout = 10000;
    const newBlock = block();
    newBlock.createGenesis({
      previousHash: 'Genesis',
      difficulty: 1,
      transactions: Array(10).fill().map(() => SHA256(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString()),
    });
    expect(newBlock.view()).to.have.property('hash').that.is.a('string');
    expect(newBlock.view()).to.have.property('previousHash').that.is.a('string');
    expect(newBlock.view()).to.have.property('height').that.is.a('number');
    expect(newBlock.view()).to.have.property('transactions').that.is.an('array');
    expect(newBlock.view()).to.have.property('nonce').that.is.a('number');
    done();
  });
});
