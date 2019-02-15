const SHA256 = require('crypto-js/sha256');
const block = require('./block.js');


function blockchain() {
  let BLOCK_GENERATION_INTERVAL_SECS = 60;
  let BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL = 5;

  const chain = [];

  function setChainParameters(generationTime, checkInterval) {
    BLOCK_GENERATION_INTERVAL_SECS = generationTime || 60;
    BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL = checkInterval || 5;
  }


  function isValidBlockStructure(newBlock) {
    return (typeof (newBlock.view().hash) === 'string'
      && typeof (newBlock.view().previousHash) === 'string'
      && typeof (newBlock.view().height) === 'number'
      && typeof (newBlock.view().timestamp) === 'number'
      && typeof (newBlock.view().nonce) === 'number');
  }

  function isValidNewBlock(newBlock, prevBlock) {
    if (chain.length > 0 && (prevBlock.view().height + 1 !== newBlock.view().height)) {
      console.log('Height Invalid');
      return false;
    }
    if (chain.length > 0 && (prevBlock.view().hash !== newBlock.view().previousHash)) {
      console.log('Hash Invalid');
      return false;
    }
    if (newBlock.calculateHash() !== newBlock.view().hash) {
      console.log('Hash Invalid');
      return false;
    }
    return true;
  }

  // Ensure block is atmost 30 secs in the future than Date.now()
  // or atmost within 30 secs of prevBlock
  function isValidTimestamp(newBlock, prevBlock) {
    if (chain.length) {
      return ((prevBlock.view().timestamp - 30) < newBlock.view().timestamp)
        && (newBlock.view().timestamp - 30) < Date.now().toString().slice(0, -3);
    }
    return true;
  }


  function addBlock(newBlock) {
    if (isValidBlockStructure(newBlock) && isValidNewBlock(newBlock, chain[chain.length - 1])
      && isValidTimestamp(newBlock, chain[chain.length - 1])) {
      chain.push(newBlock);
    } else {
      console.log('Invalid Block');
    }
  }

  function setDifficulty(bestBlock) {
    const prevAdjustedBlock = chain[chain.length - BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeTaken = bestBlock.view().timestamp - prevAdjustedBlock.view().timestamp;
    const expectedTime = BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL_SECS;
    // Blocks Generated too fast
    console.log('Time Taken: ', timeTaken);
    console.log('Expected Time: ', expectedTime);
    if ((timeTaken) < expectedTime) {
      return prevAdjustedBlock.view().difficulty + 1;
    }
    if ((timeTaken) > expectedTime) {
      return (prevAdjustedBlock.view().difficulty > 0 ? prevAdjustedBlock.view().difficulty - 1 : 1);
    }
    return prevAdjustedBlock.view().difficulty;
  }

  function getDifficulty() {
    const bestBlock = chain[chain.length - 1];
    if (bestBlock.view().height % BLOCK_DIFFICULTY_ADJUSTMENT_INTERVAL === 0) {
      return setDifficulty(bestBlock);
    }
    return bestBlock.view().difficulty;
  }

  async function generateNextBlock() {
    const nb = block();
    let pb;
    if (chain.length === 0) {
      await nb.createGenesis({
        previousHash: '1',
        transactions: [],
        difficulty: 1,
      });
    } else {
      pb = chain[chain.length - 1];
      await nb.create({
        previousHash: pb.view().hash,
        height: pb.view().height + 1,
        difficulty: getDifficulty(),
        transactions: Array(10).fill().map(() => SHA256(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString()),
      });
    }
    addBlock(nb);
    console.log(`Added Block ${chain[chain.length - 1].view().height} Difficulty: ${chain[chain.length - 1].view().difficulty}  to the chain`);
  }

  function view() {
    return chain;
  }

  function viewBestBlock() {
    return chain[chain.length - 1].view();
  }


  return Object.freeze({
    view,
    viewBestBlock,
    generateNextBlock,
    setChainParameters,
  });
}


module.exports = blockchain();
