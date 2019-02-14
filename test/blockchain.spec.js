const expect = require('chai').expect;
const blockchain = require('../blockchain.js');


describe('Blockchain Tests', function(){
  it('should create a new block and add it to chain', (done) => {
    blockchain.generateNextBlock();
    expect(blockchain.view().length).to.equal(1);
    done();
  });


  it('should check Genesis block structure', () => {
    expect(blockchain.view()[0].view().height).to.equal(1);
  });


  it('should ensure previous hash is contained in next block', (done) => {
    blockchain.generateNextBlock();
    expect(blockchain.view()[0].view().hash).to.equal(blockchain.view()[1].view().previousHash);
    done();
  });

  it('should ensure Genesis block is only created once', () => {
    expect(blockchain.view()[1].view().height).to.not.equal(1);
  });


  it('difficulty should increase when blocks are created faster than BLOCK_INTERVAL_TIME_SECS', function(done){
    this.timeout(60000);
    let i=3;
    let chainTimeout;
    const createChain = new Promise((resolve, reject)=> {
      setTimeout(()=> resolve(), 1000);      
    });
    createChain.then((result)=> {
      let chainArray= blockchain.view();
      expect(chainArray[chainArray.length-1].view().difficulty).to.be.above(20000);
    }).finally(done);
        

  });
  it('difficulty should reduce when blocks are created slower than BLOCK_INTERVAL_TIME_SECS');
  it('difficulty should not change before BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL');
});
