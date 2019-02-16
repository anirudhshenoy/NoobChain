const SHA256 = require('crypto-js/sha256');

function block(data = {}) {
  // let hash = data.hash || null;
  // let previousHash = null;
  // let height = null;
  // let timestamp = null;
  // let transactions = [];
  // let nonce = 0;
  // let difficulty = null;

  let {hash = null, previousHash = null,height = null,timestamp = null,transactions=[],nonce = 0,difficulty = null} = data;

  function calculateHash() {
    return SHA256(previousHash + height + timestamp + transactions + nonce).toString();
  }

  function hexToBinary(s) {
    let ret = '';
    const lookupTable = {
      '0': '0000',
      '1': '0001',
      '2': '0010',
      '3': '0011',
      '4': '0100',
      '5': '0101',
      '6': '0110',
      '7': '0111',
      '8': '1000',
      '9': '1001',
      'a': '1010',
      'b': '1011',
      'c': '1100',
      'd': '1101',
      'e': '1110',
      'f': '1111'
    };
    for (let i = 0; i < s.length; i = i + 1) {
      if (lookupTable[s[i]]) {
        ret += lookupTable[s[i]];
      } else {
        return null;
      }
    }
    return ret;
  };


  function mine() {
    function recursiveMine(resolve) {
      hash = calculateHash();
      if (hexToBinary(hash).substr(0, difficulty) === '0'.repeat(difficulty)) {
        resolve();
        return;
      }
      nonce += 1;
      setImmediate(recursiveMine, resolve);
    }
    return new Promise(recursiveMine);
  }

  async function create(data) {
    previousHash = data.previousHash;
    height = data.height;
    difficulty = data.difficulty;
    timestamp = parseInt(Date.now().toString().slice(0, -3), 10);
    transactions = JSON.stringify(data.transactions.slice(0, data.length));
    await mine();
  }

  async function createGenesis(data) {
    previousHash = data.previousHash;
    height = 1;
    difficulty = data.difficulty;
    timestamp = parseInt(Date.now().toString().slice(0, -3), 10);
    transactions = JSON.stringify(data.transactions.slice(0, data.length));
    await mine();
  }

  function view() {
    return {
      hash,
      previousHash,
      height,
      timestamp,
      transactions,
      nonce,
      difficulty,
    };
  }

  
  return Object.freeze({
    create,
    createGenesis,
    view,
    calculateHash,
  });
}


module.exports = block;