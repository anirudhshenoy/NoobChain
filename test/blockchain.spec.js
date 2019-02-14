const expect = require('chai').expect;
const blockchain = require('../blockchain.js');

blockchain.setChainParameters(0.01, 5);


const timeout = ms => new Promise(res => setTimeout(res, ms));

async function addBlocks(n, delay) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < n; i++) {
      blockchain.generateNextBlock();
      await timeout(delay);
    }

    resolve();
  });
}

describe('Blockchain Tests', () => {
  it('should create a new block and add it to chain', async function () {
    this.timeout(60000);
    await addBlocks(6, 100);
    expect(blockchain.view().length).to.equal(6);
  });

  it('should check Genesis block structure', () => {
    expect(blockchain.view()[0].view().height).to.equal(1);
  });

  it('should ensure previous hash is contained in next block', (done) => {
    expect(blockchain.view()[0].view().hash).to.equal(blockchain.view()[1].view().previousHash);
    done();
  });

  it('should ensure Genesis block is only created once', () => {
    expect(blockchain.view()[1].view().height).to.not.equal(1);
  });

  it('difficulty should reduce when blocks are created slower than BLOCK_INTERVAL_TIME_SECS', async () => {
    const chainArray = blockchain.view();
    expect(chainArray[chainArray.length - 1].view().difficulty).to.be.below(chainArray[chainArray.length - 2].view().difficulty);
  });

  it('difficulty should increase when blocks are created faster than BLOCK_INTERVAL_TIME_SECS', async function () {
    this.timeout(60000);
    blockchain.setChainParameters(10, 5);
    await addBlocks(5, 10);
    const chainArray = blockchain.view();
    expect(chainArray[chainArray.length - 1].view().difficulty).to.be.above(chainArray[chainArray.length - 2].view().difficulty);
  });

  it('difficulty should not change before BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL', () => {
    const chainArray = blockchain.view();
    expect(chainArray[2].view().difficulty).to.equal(chainArray[3].view().difficulty);
    expect(chainArray[7].view().difficulty).to.equal(chainArray[8].view().difficulty);
  });
});