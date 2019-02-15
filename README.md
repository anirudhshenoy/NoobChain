Block Data Structure: 



    Timestamp (Time)
    Height
    previousHash
    transactions []
    hash

TODO: 
    add LevelDB
    WS



 fn calculateHash SHA-256 
    : SHA256 (height, previous hash, timestamp, transactions) 
 fn createGenesis 

 fn generateNextBlock



## fn create 
    Arguments: data = {height, transactions, previousHash, transactions []}


#Blockchain Data Structure:

    ## fn isValidNewBlock
        check typeOf

    ## fn isValidBlockchain
        check every block for validity

    
    ## fn isValidBlocknew 
    index is +1
    
    ## fn isValidBlockStructure
    check typeof for each 

##P2P Network with WS

    Message Object = {
        type: 1 | 2 | 3 ,
        data : ''
    }

    
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
