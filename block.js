const SHA256 = require('crypto-js/sha256');

function block() {
  let hash = null;
  let previousHash = null;
  let height = null;
  let timestamp = null;
  let transactions = [];
  let nonce = 0;
  let difficulty = 3;

  function calculateHash() {
    return SHA256(previousHash + height + timestamp + transactions + nonce).toString();
  }

  function mine() {
    function recursiveMine(resolve) {
      hash = calculateHash();
      if (hash.substr(0, difficulty) === '0'.repeat(difficulty)) {
        resolve();
        return;
      }
      nonce += 1;

      //  setTimeout(() => {
      //     recursiveMine(resolve)
      //   },0);
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
      transactions: JSON.parse(transactions),
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
