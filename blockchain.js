const SHA256 = require('crypto-js/sha256');
const block = require('./block.js');


class blockchain {

  constructor(data = []) {
    this.BLOCK_GENERATION_INTERVAL_SECS = 20;
    this.BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
    this.chain = data;
  }


  setChainParameters(generationTime, checkInterval) {
    this.BLOCK_GENERATION_INTERVAL_SECS = generationTime || 60;
    this.BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL = checkInterval || 5;
  }


  isValidBlockStructure(newBlock) {
    return (typeof (newBlock.hash) === 'string' &&
      typeof (newBlock.previousHash) === 'string' &&
      typeof (newBlock.height) === 'number' &&
      typeof (newBlock.timestamp) === 'number' &&
      typeof (newBlock.nonce) === 'number');
  }

  isValidNewBlock(newBlock, prevBlock) {               
    if (this.chain.length > 0 && (prevBlock.height + 1 !== newBlock.height)) {
      console.log('Height Invalid! Prev Block : ' + prevBlock.height + 'new Block ' + newBlock.height);
      return false;
    }
    if (this.chain.length > 0 && (prevBlock.hash !== newBlock.previousHash)) {
      console.log('Hash Invalid');
      return false;
    }
    if (newBlock.calculateHash() !== newBlock.hash) {
      console.log('Hash Invalid');
      return false;
    }
    return true;
  }

  // Ensure block is atmost 30 secs in the future than Date.now()
  // or atmost within 30 secs of prevBlock
  isValidTimestamp(newBlock, prevBlock) {
    if (this.chain.length) {
      return ((prevBlock.timestamp - 30) < newBlock.timestamp) &&
        (newBlock.timestamp - 30) < Date.now().toString().slice(0, -3);
    }
    return true;
  }


  addBlock(newBlock) {
    if (this.isValidBlockStructure(newBlock) && this.isValidNewBlock(newBlock, this.chain[this.chain.length - 1]) &&
      this.isValidTimestamp(newBlock, this.chain[this.chain.length - 1])) {
      this.chain.push(newBlock);
      console.log(`Added Block ${this.chain[this.chain.length - 1].height} Hash: ${this.chain[this.chain.length - 1].hash}  to the chain`);

    } else {
      console.log('Invalid Block');
    }
    
  }

  setDifficulty(bestBlock) {
    const prevAdjustedBlock = this.chain[this.chain.length - this.BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeTaken = bestBlock.timestamp - prevAdjustedBlock.timestamp;
    const expectedTime = this.BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL * this.BLOCK_GENERATION_INTERVAL_SECS;
    // Blocks Generated too fast
    //console.log('Time Taken: ', timeTaken);
    //console.log('Expected Time: ', expectedTime);
    if ((timeTaken) < expectedTime) {
      return prevAdjustedBlock.difficulty + 1;
    }
    if ((timeTaken) > expectedTime) {
      return (prevAdjustedBlock.difficulty > 0 ? prevAdjustedBlock.difficulty - 1 : 1);
    }
    return prevAdjustedBlock.difficulty;
  }

  getDifficulty() {
    const bestBlock = this.chain[this.chain.length - 1];
    if (bestBlock.height % this.BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL === 0) {
      return this.setDifficulty(bestBlock);
    }
    return bestBlock.difficulty;
  }

  async generateNextBlock() {
    const nb = new block();
    let pb;
    if (this.chain.length === 0) {
      console.log("creating Genesis");
      await nb.createGenesis({
        previousHash: '111',
        difficulty: 17,
      });
    } else {
      pb = this.chain[this.chain.length - 1];
      await nb.create({
        previousHash: pb.hash,
        height: pb.height + 1,
        difficulty: this.getDifficulty(),
        transactions: Array(10).fill().map(() => SHA256(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString()),
      });
    }
    this.addBlock(nb);
  }



  getCummulativeDifficulty() {
    return this.chain
      .map((block) => block.difficulty)
      .map((difficulty) => Math.pow(2, difficulty))
      .reduce((a, b) => a + b);
  };

  isValidChain(validateChain) {
    for (let i = 1; i < validateChain.length; i++) {
      if (!isValidNewBlock(validateChain[i], validateChain[i - 1])) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    //console.log(newChain);
    if (this.isValidChain(newChain) && (this.getCummulativeDifficulty(newChain) >= this.getCummulativeDifficulty(this.chain))) {
      this.chain = newChain.chain;
      console.log('replaced chain');
    } else
      console.log('Invalid Chain received');
  }
}


module.exports = blockchain;