const blockchain = require('./blockchain.js');


const BLOCK_GENERATION_TIME_MS = 1;

(function theLoop(i) {
  setTimeout(() => {
    blockchain.generateNextBlock();
    theLoop(++i);
  }, BLOCK_GENERATION_TIME_MS);
}(1));
