const SHA256 = require('crypto-js/sha256');
const _chain = require('./blockchain.js');
const net = require('./network.js');
const block = require('./block.js');

const initHttpServer = require('./web.js')


var blockchain = new _chain();
var network = new net(blockchain);
network.initP2PServer(process.argv[2]);
initHttpServer(blockchain,network, process.argv[3])



const BLOCK_GENERATION_TIME_MS = 100;

(function theLoop(i) {
  setTimeout(async () => {
    await blockchain.generateNextBlock(process.argv[3]);
    //console.log(JSON.stringify(blockchain.chain));
    network.broadcastBestBlock();
    theLoop(++i);
  }, BLOCK_GENERATION_TIME_MS);
}(1));
