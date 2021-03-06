const WebSocket = require('ws');

const SERVER_ADDRESS = 'ws://192.168.31.122:8102';


const ws = new WebSocket(SERVER_ADDRESS);

ws.on('open', () => {
  const msg = {
    type: 2,
    data: '',
  };
  ws.send(JSON.stringify(msg));
});

ws.on('message', (data) => {
  let msg = JSON.parse(data);
  console.log(JSON.parse(msg.data));
});

ws.on('close', () => {
  console.log('disconnected');
});
