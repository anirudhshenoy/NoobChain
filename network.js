const WebSocket = require('ws');
const blockchain = require('./blockchain.js');


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

  function broadcast(msg){
    sockets.forEach((socket)=> {
      socket.send(msg);
    });
  }

  function queryBlock(ws) {
    const response = {
      type: MessageType.RESPONSE_CHAIN,
      data: JSON.stringify(blockchain.viewBestBlock()),
    };
    ws.send(JSON.stringify(response));
  }

  function queryChain(ws) {
    let chain =   [];
    blockchain.view().forEach((value)=> chain.push(value.view()));
    const response = {
      type: MessageType.RESPONSE_CHAIN,
      data: JSON.stringify(chain),
    };
    ws.send(JSON.stringify(response));
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
          // recvdChain(recvdBlocks);
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
    console.log('client connected : ', req.connection.remoteAddress);
  }

  function initP2PServer() {
    const server = new WebSocket.Server({
      port: 8080,
    });
    server.on('connection', initConnection);
  }

  return Object.freeze({
    initP2PServer,
    broadcast
  });
}

module.exports = network();
