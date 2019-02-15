const SHA256 = require('crypto-js/sha256');
const expect = require('chai').expect;
const block = require('../block.js');


const newBlock = block();
newBlock.create({
  previousHash: '999999',
  height: 1524 + 1,
  difficulty: 3,
  transactions: Array(10).fill().map(() => SHA256(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString()),
});

describe('Block Test', () => {
  it('should create and return new valid block', function () {
    this.timeout = 10000;

    expect(newBlock.view()).to.have.property('hash').that.is.a('string');
    expect(newBlock.view()).to.have.property('previousHash').that.is.a('string');
    expect(newBlock.view()).to.have.property('height').that.is.a('number');
    expect(newBlock.view()).to.have.property('transactions').that.is.an('array');
    expect(newBlock.view()).to.have.property('nonce').that.is.a('number');
  });


  it('should validate block hash', () => {
    expect(newBlock.view().hash).to.equal(SHA256(newBlock.view().previousHash + newBlock.view().height + newBlock.view().timestamp + JSON.stringify(newBlock.view().transactions) + newBlock.view().nonce).toString());
  });


  it('should check that block has been mined for current difficulty setting', () => {
    expect(newBlock.view().hash.substr(0, newBlock.view().difficulty)).to.equal('0'.repeat(newBlock.view().difficulty));
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
