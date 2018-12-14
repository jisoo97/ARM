# ARM: Application Reputation Management framework
In this work, we propose ARM, a blockchain-based framework to maintain apps' and app developers' reputation.
ARM stores static analysis results of all apps, which are released to the official app markets, in the blockchian.

## Getting Started

### Prerequisites
* Linux - ARM only runs on Linux-family(Ubuntu, CentOS, etc) system. \\
* [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) - Ethereum Smart Contract is used
* [Node.js](https://nodejs.org/ko/) - Node.js for front-end management
* [Web3](https://web3js.readthedocs.io/en/1.0/) - Web3 to interact with a remote ethereum node, using a HTTP or IPC connection.

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Git clone https://github.com/jisoo97/ARM.git
```

End with an example of getting some data out of the system or using it for a little demo

## Running the program

### Server
```
cd geth
geth --datadir fastdata --rpc --rpcapi 'web3, net, personal, admin, eth' --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --verbosity 0 console
geth console> miner.start()
```
In another shell,
```
cd js
node main.js
```

### Client (Each node i.e. security company)

```
cd geth
mkdir data
geth --datadir data init genesis.json // Init only the first time you run the server
geth --datadir data --verbosity 0 console
geth console> personal.newAccount()
```
You will get a hexadecimal address. It will be ```$defaultAddr```
Change ```line3: var contractAddr = 0x________________``` in ```geth/contract_script_final.js``` into your ```$Server's_contractAddr``` \
Change ```line4: var defaultAddr = 0x________________``` in ```geth/contract_script_final.js``` into your ```$defaultAddr```

```
geth console> miner.start()
```

```
geth console> admin.addPeer($Server_enode")
geth console> loadScript('contract_script_final.js')  // specify the contract
geth console> loadScript($set_leak_js) // push the leak you have founded
```
And then, go to :
```
http:Server_IP/3000/Home.html
```
## Authors

* **Dahyun Kang**
* **Jisoo Kim**
* **Beumjin Cho**
