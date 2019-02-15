const WebSocket = require('ws');

const SERVER_ADDRESS = 'ws://192.168.31.122:8080'


const ws = new WebSocket(SERVER_ADDRESS);

ws.on('open', function open() {
  let msg = {
    'type' : 1,
    'data' : ''
  }
  ws.send(JSON.stringify(msg));
});

ws.on('message', function incoming(data) {
  console.log(JSON.parse(data));
});

ws.on('close', function close() {
  console.log('disconnected');
});
