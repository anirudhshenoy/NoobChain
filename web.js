const express = require('express');
const bodyParser = require('body-parser');


function initHttpServer(chain, network, port) {
  const app = express();
  app.use(bodyParser.json());

  app.get('/blocks', (req, res) => {
      res.send(chain.chain);
  });
  /*app.post('/mineBlock', (req, res) => {
      const newBlock: Block = generateNextBlock(req.body.data);
      res.send(newBlock);
  });*/
  app.get('/peers', (req, res) => {
      res.send(network.getSockets().map((el)=> el.url));
  });

  app.get('/addPeer/:id', (req, res) => {
      network.connectToNode(req.params.id);
      res.send('Connecting to '+ req.params.id);
  });

  app.listen(port, () => {
      console.log('Listening http on port: ' + port);
  });
}

module.exports = initHttpServer;

