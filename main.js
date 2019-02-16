const SHA256 = require('crypto-js/sha256');
const _chain = require('./blockchain.js');
const net = require('./network.js');
const block = require('./block.js');

var blockchain = new _chain();
var network = new net(blockchain);
const NODE_SERVER = 'ws://192.168.31.122:' +process.argv[3];
network.initP2PServer(process.argv[2]);


setTimeout(()=> network.connectToNode(NODE_SERVER),5000);


const BLOCK_GENERATION_TIME_MS = 100;

(function theLoop(i) {
  setTimeout(async () => {
    await blockchain.generateNextBlock();
    //console.log(JSON.stringify(blockchain.chain));
    network.broadcastBestBlock();
    theLoop(++i);
  }, BLOCK_GENERATION_TIME_MS);
}(1));
