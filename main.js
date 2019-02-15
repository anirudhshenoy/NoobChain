const SHA256 = require('crypto-js/sha256');
const blockchain = require('./blockchain.js');
const network = require('./network.js');


const block = require('./block.js');

network.initP2PServer();

const BLOCK_GENERATION_TIME_MS = 100;

(function theLoop(i) {
  setTimeout(async () => {
    await blockchain.generateNextBlock();
    //console.log(JSON.stringify(blockchain.viewBestBlock()));
    network.broadcast(JSON.stringify(blockchain.viewBestBlock()));
    theLoop(++i);
  }, BLOCK_GENERATION_TIME_MS);
}(1));
