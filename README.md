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

```
Git clone https://github.com/jisoo97/ARM.git
```

## Running the program

### Server
```
cd geth
geth --datadir fastdata --preload contract_script_server.js --rpc --rpcapi 'web3, net, personal, admin, eth' --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --verbosity 0 console
geth console> miner.start()
```
In another shell,
```
cd web/js
node main.js
```
And then, go to :
```
http://Server_IP:3000/home
```

### Client (Each node i.e. security company)

```
cd geth
mkdir data
geth --datadir data init genesis.json // Initailize only once you first generate the data folder!
geth --datadir data --verbosity 0 console
geth console> personal.newAccount() // And setup your passphrase
geth console> exit
```
```
geth --datadir data --preload contract_script_cli.js --verbosity 0 console
geth console> personal.unlockAccount(personal.listAccounts[0], "PASSPHRASE_YOU_JUST_SET_UP", 7200)
geth console> miner.start()
```

```
geth console> admin.addPeer(SERVER'S_ENODE)
geth console> var getdata = contract.set.getData("COMPANYNAME", "APPNAME", "CATEGORY", "DEVELOPER", "SOURCE", "SINK"); // CATEGORY should be only one in social, wallpaper, weather, productivity, game
geth console> web3.eth.sendTransaction({ from: defaultAddr, to: contractAddr, data: getdata, gas: 7000000 });
```
And then, go to :
```
http:Server_IP/3000/Home.html
```
## Authors

* **Dahyun Kang**
* **Jisoo Kim**
* **Beumjin Cho**
