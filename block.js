const SHA256 = require('crypto-js/sha256');

class block {

  constructor(data={}) {
    // this.hash = null;
    // this.previousHash = null;
    // this.height = null;
    // this.timestamp = null;
    // this.transactions = [];
    // this.nonce = 0;
    // this.difficulty = null;
    ({
      hash: this.hash = null,
      previousHash: this.previousHash = null,
      height: this.height = null,
      timestamp: this.timestamp = null,
      transactions: this.transactions = '',
      nonce: this.nonce = 0,
      difficulty: this.difficulty = null
    } = data);
  }
  //let {hash = null, previousHash = null,height = null,timestamp = null,transactions=[],nonce = 0,difficulty = null} = data;

  calculateHash() {
    return SHA256(this.previousHash + this.height + this.timestamp + this.transactions + this.nonce).toString();
  }

  hexToBinary(s) {
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


  mine() {
    var that = this;
    this.nonce = 0;

    function recursiveMine(resolve) {
      that.hash = that.calculateHash();
      if (that.hexToBinary(that.hash).substr(0, that.difficulty) === '0'.repeat(that.difficulty)) {
        resolve();
        return;
      }
      that.nonce += 1;
      setImmediate(recursiveMine, resolve);
    }
    return new Promise(recursiveMine);
  }

  async create(data) {
    this.previousHash = data.previousHash;
    this.height = data.height;
    this.difficulty = data.difficulty;
    this.timestamp = parseInt(Date.now().toString().slice(0, -3), 10);
    this.transactions = JSON.stringify(data.transactions.slice(0, data.length));
    await this.mine();
  }

  async createGenesis(data) {
    this.previousHash = data.previousHash;
    this.height = 1;
    this.difficulty = data.difficulty;
    this.timestamp = parseInt(Date.now().toString().slice(0, -3), 10);
    this.transactions = [];
    try {
      await this.mine();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = block;