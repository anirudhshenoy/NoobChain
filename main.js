const blockchain = require('./blockchain.js');
const network = require('./network.js');


network.initP2PServer();

const BLOCK_GENERATION_TIME_MS = 1000;

(function theLoop(i) {
  setTimeout(() => {
    blockchain.generateNextBlock();
    theLoop(++i);
  }, BLOCK_GENERATION_TIME_MS);
}(1));

