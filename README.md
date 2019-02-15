#NoobChain 

NoobChain is a simple NodeJS blockchain intended to be a learning tool. NoobChain is based on the excellent tutorial -[NaiveCoin] (https://github.com/lhartikk/naivecoin) by lhartikk


TODO: 
    Add LevelDB for persistent storage
    Consenus Mechanism
    Web API for front-end

## Block.js

1. Creates blocks with the following data structure:
Block Structure: 
    Timestamp : String
    Height : Number
    previousHash : String
    transactions : []
    hash : String
    nonce: number

2. Added async mining code 

## Blockchain.js

1. Instantiate new blockchain and generate blocks.

2. Validity checking for blocks 



## Network.js

   ` Message Object = {
        type: 1 | 2 | 3 ,
        data : ''
    }`

    
1. Init P2P Server 
2. Log Sockets during connection event 
3. Remove Sockets during close event 
4. Handle Messages in Data event 
    a. Message types: 
        i) Recieved New Block/s
        ii) Query New Block
        iii) Query Blockchain
5. New Block/s Handler : 
    a. Check if New block is valid 
    b. If New block is next block. Verify and add to chain. 
    c. If not next block but height > current Height, request chain. 
        i) If Chains best block index > current height - > validate and replace chain. 
6. Query Block:
    a. Respond with new block 
7. Query Blockchain
    b. Respond with full chain

## Test Folder - Mocha.js    
