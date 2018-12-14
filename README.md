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

## Running the tests

Explain how to run the automated tests for this system

### Server ()

```
Give an example
```

### Client (Each node i.e. security company)

Explain what these tests test and why
```
mkdir data
geth --datadir data init genesis.json
geth --datadir data --verbosity 0 console
geth console> admin.addPeer("enode://55c5bed57081d14f07181caf682f355a6ca5ec373e789a410f34b1cd8935f5ed56513b863852a12246754f04f7ba1f324e3a79841221254723b1e0c7f882ba85@[$Server_IP]:30303")
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
See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
