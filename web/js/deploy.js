var dir = '/home/bc/project/web/';
var ArmsOutput = require(dir + 'js/armsoutput_final.js');
var express = require('express');
var app = express();
var ArmsOutput = ArmsOutput.ArmsOutput;
var bodyParser = require('body-parser');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
app.use(express.static('public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
     extended: true
}));
var defaultAddr = "0xa92fa8c0462e228904772d9abe4b3169d7acdbc0";
//var defaultAddr = "0x82dea506bcdd922083825d80d908f3e2077dbd73"; //--datadir fastdata
var unlockPromise = web3.eth.personal.unlockAccount(defaultAddr, "ec7t8b5z8*", 3600).then(function(_res){
      console.log("account unlodkced");
});


var ArmsContractAbi = ArmsOutput.contracts['Arms.sol:Arms'].abi;
var ArmsBinCode = "0x" + ArmsOutput.contracts['Arms.sol:Arms'].bin;
var deployTransactionObject1 = { from: defaultAddr, data: ArmsBinCode, gas: 10000000 };
var ArmsContract = new web3.eth.Contract(JSON.parse(ArmsContractAbi), deployTransactionObject1)
var Arms = null;
var ArmsPromise = ArmsContract.deploy({
	arguments: ["Amor Fati", "CTK", 0, 2000]
}).send({
	from: defaultAddr,
	gas: 7000000
}, function(error, transactionHash){
	console.log("Deploying Arms, txhash: ");
	console.log(transactionHash);
});

var ArmsCA = ArmsPromise.then(function(newContractInstance){
	console.log("Arms CA: ");
	console.log("\"" + newContractInstance.options.address + "\"" ) // instance with the new contract address
	Arms = newContractInstance;
	return newContractInstance.options.address;
});
/*.then(function(_dummy) {
       var getdata = Arms.methods.set("sc1", "kakao", "social", "kakao_developer", "source1", "sink1").encodeABI();
       web3.eth.sendTransaction({from: defaultAddr, to: Arms.options.address, data: getdata, gas: 10000000})
      .then(console.log("set called"));
});*/     
 
