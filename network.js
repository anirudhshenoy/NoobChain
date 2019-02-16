const WebSocket = require('ws');
const blockchain = require('./blockchain.js');
const block = require('./block.js');


function network() {

 
  const MessageType = Object.freeze({
    QUERY_BLOCK: 1,
    QUERY_CHAIN: 2,
    RESPONSE_CHAIN: 3,
  });

  const sockets = [];

  function JSONToObject(data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  function write(ws, msg){
    ws.send(JSON.stringify(msg));
  }

  function broadcast(msg) {
    sockets.forEach((socket) => {
      write(socket,msg);
    });
  }

  function queryBlock(ws) {
    const response = {
      type: MessageType.RESPONSE_CHAIN,
      data: JSON.stringify(blockchain.viewBestBlock().view()),
    };
    write(ws,response);
  }

  function queryChain(ws) {
    let chain = blockchain.view().map(value => value.view());
    const response = {
      type: MessageType.RESPONSE_CHAIN,
      data: JSON.stringify(chain),
    };
    write(ws,response);
  }

  function sendQueryChain(ws) {
    const response = {
      type: MessageType.QUERY_CHAIN,
      data: null,
    };
    write(ws,response);
  }

  function broadcastBestBlock() {
    const response = {
      type: MessageType.RESPONSE_CHAIN,
      data: JSON.stringify(blockchain.viewBestBlock().view()),
    };
    broadcast(response);
  }

  function recvdChain(recvdBlocks) {
    console.log(recvdBlocks);
    if (recvdBlocks.length === 0) {
      console.log('received block chain size of 0');
      return;
    }
    const recvdBestBlock = block(recvdBlocks[recvdBlocks.length - 1]);
    if (!blockchain.isValidBlockStructure(recvdBestBlock)) {        
      console.log('Invalid Block Structure');
      return;
    }
    const currentBestBlock = blockchain.viewBestBlock();

    if (recvdBestBlock.view().height > currentBestBlock.view().height) {
      console.log('Blockchain is possible behind. Recvd: ' + recvdBestBlock.view().height + 'Current: ' + currentBestBlock.view().height);
      if (recvdBestBlock.view().previousHash === currentBestBlock.view().hash) {
        blockchain.addBlock(recvdBestBlock);
        console.log("addedblock");
        broadcastBestBlock();
      } else if (recvdBestBlock.view().length === 1) {
        console.log("sent query for chain");
        sendQueryChain();
      } else {
        console.log(recvdBlocks);
        blockchain.replaceChain(blockchain(recvdBlocks));
      }
    } else {
      console.log('Received shorter block.');
    }
  }


  function initErrorHandler(ws) {
    const closeConnection = (myWs) => {
      console.log(`connection failed to peer: ${myWs.url}`);
      sockets.splice(sockets.indexOf(myWs), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
  }

  function initMessageHandler(ws) {
    ws.on('message', (data) => {
      const msg = JSONToObject(data);
      if (msg === null) {
        console.log('Unable to parse message');
        return;
      }
      //console.log('Received: ', JSON.stringify(msg));
      switch (msg.type) {
        case MessageType.QUERY_BLOCK:
          queryBlock(ws);
          break;
        case MessageType.QUERY_CHAIN:
          queryChain(ws);
          break;
        case MessageType.RESPONSE_CHAIN:
          const recvdBlocks = JSONToObject(msg.data);
          if (recvdBlocks === null) {
            console.log('Cannot parse blocks');
            break;
          }
          recvdChain([recvdBlocks]);
          break;
        default:
          console.log('Invalid Message Type');
      }
    });
  }

  function initConnection(ws, req) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    console.log('client connected : ');
  }

  function initP2PServer(serverPort=8080) {
    const server = new WebSocket.Server({
      port: serverPort,
    });
    server.on('connection', initConnection);
  }

  function connectToNode(serverIP) {
    const ws = new WebSocket(serverIP);
    ws.on('open', () => {
      console.log('opened connection to ' + serverIP);
        initConnection(ws);
    });
    ws.on('error', () => {
        console.log('connection failed');
    });
};

  return Object.freeze({
    initP2PServer,
    broadcastBestBlock,
    connectToNode,
  });
}

module.exports = network();