﻿var express = require("express");
var app = express();
var server = require("http").createServer(app);
var bodyParser = require('body-parser');
var Web3 = require("web3");
var fs = require("fs");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var defaultAddr = "0xa92fa8c0462e228904772d9abe4b3169d7acdbc0"; //--datadir fastdata
web3.eth.personal.unlockAccount(defaultAddr, "password", 3600).then(function (_res) {
    server.listen(8080);
    console.log("Listening from 8080");
    console.log("Running");
});

//////////////////////////////////Custom Token//////////////////////////////////////
var current_investor = null;
//var CustomToken = null;
//var CrowdFunding = null;
var CustomTokenOutput = { "contracts": { "CustomToken.sol:CustomToken": { "abi": "[{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint8\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"userAddress\",\"type\":\"address\"}],\"name\":\"getBalanceOf\",\"outputs\":[{\"name\":\"value\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"},{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"_tokenName\",\"type\":\"string\"},{\"name\":\"_tokenSymbol\",\"type\":\"string\"},{\"name\":\"_decimalUnits\",\"type\":\"uint8\"},{\"name\":\"_initialSupply\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_from\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"}]", "bin": "608060405234801561001057600080fd5b506040516104e23803806104e28339810160409081528151602080840151928401516060850151928501805190959490940193909291610055916000918701906100a4565b5082516100699060019060208601906100a4565b506002805460ff191660ff9390931692909217909155336000908152600360205260409020670de0b6b3a764000090910290555061013f9050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100e557805160ff1916838001178555610112565b82800160010185558215610112579182015b828111156101125782518255916020019190600101906100f7565b5061011e929150610122565b5090565b61013c91905b8082111561011e5760008155600101610128565b90565b6103948061014e6000396000f3006080604052600436106100775763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde038114610079578063313ce5671461010357806370a082311461012e57806395d89b411461016e5780639b96eece14610183578063a9059cbb146101b1575b005b34801561008557600080fd5b5061008e6101fb565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100c85781810151838201526020016100b0565b50505050905090810190601f1680156100f55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561010f57600080fd5b50610118610289565b6040805160ff9092168252519081900360200190f35b34801561013a57600080fd5b5061015c73ffffffffffffffffffffffffffffffffffffffff60043516610292565b60408051918252519081900360200190f35b34801561017a57600080fd5b5061008e6102a4565b34801561018f57600080fd5b5061015c73ffffffffffffffffffffffffffffffffffffffff600435166102fe565b3480156101bd57600080fd5b506101e273ffffffffffffffffffffffffffffffffffffffff60043516602435610326565b6040805192835260208301919091528051918290030190f35b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156102815780601f1061025657610100808354040283529160200191610281565b820191906000526020600020905b81548152906001019060200180831161026457829003601f168201915b505050505081565b60025460ff1681565b60036020526000908152604090205481565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156102815780601f1061025657610100808354040283529160200191610281565b73ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b336000908152600360205260408082208054849003815573ffffffffffffffffffffffffffffffffffffffff94909416825290208054909101908190559054915600a165627a7a7230582032cc67b913e5207f84866f2f8419807108e680286540418d9d7db229b024bcd50029" } }, "version": "0.4.25+commit.59dbf8f1.Linux.g++" };
var CustomTokenContractAbi = CustomTokenOutput.contracts['CustomToken.sol:CustomToken'].abi;
var CustomTokenBinCode = "0x" + CustomTokenOutput.contracts['CustomToken.sol:CustomToken'].bin;
var deployTransactionObject1 = { from: web3.eth.accounts[0], data: CustomTokenBinCode, gas: 1000000 };
var CustomTokenContract = new web3.eth.Contract(JSON.parse(CustomTokenContractAbi), deployTransactionObject1)
var CustomToken = null;
var CustomTokenPromise = CustomTokenContract.deploy({
    arguments: ["Amor Fati", "CTK", 0, 2000]
}).send({
    from: defaultAddr,
    gas: 1000000
}, function (error, transactionHash) {
    console.log("Deploying CustomToken, txhash: ");
    console.log(transactionHash);
});

var CustomTokenCA = CustomTokenPromise.then(function (newContractInstance) {
    console.log("CustomToken CA: ");
    console.log(newContractInstance.options.address) // instance with the new contract address
    CustomToken = newContractInstance;
    return newContractInstance.options.address;
});
//////////////////////////////////Crowd Funding//////////////////////////////////////

var CrowdFundingOutput = { "contracts": { "CrowdFunding.sol:CrowdFunding": { "abi": "[{\"constant\":false,\"inputs\":[],\"name\":\"checkGoalReached\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"ended\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalAmount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"goalAmount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"deadline\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"withdraw\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"kill\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"goalReached\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"price\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"withdrawExcess\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"_goalAmount\",\"type\":\"uint256\"},{\"name\":\"_durationMinutes\",\"type\":\"uint256\"},{\"name\":\"_costOfToken\",\"type\":\"uint256\"},{\"name\":\"_tokenAddress\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"ownerAddress\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amountRaisedValue\",\"type\":\"uint256\"}],\"name\":\"GoalReached\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"backer\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"isContribution\",\"type\":\"bool\"}],\"name\":\"FundTransfer\",\"type\":\"event\"}]", "bin": "608060405234801561001057600080fd5b5060405160808061067283398101604090815281516020830151919092015160008054600160a060020a03191633178155670de0b6b3a764000093840260015542603c90930292909201600355919091026004556002556006805461ffff191690556105f1806100816000396000f3006080604052600436106100b95763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166301cb3b20811461012757806312fa6feb1461013e5780631a39d8ef146101675780632636b9451461018e57806329dcb0cf146101a35780633ccfd60b146101b857806341c0e1b5146101c057806370a08231146101d55780637d3d6522146101f65780638da5cb5b1461020b578063a035b1fe1461023c578063c264a06314610251575b600654600090610100900460ff16156100d157600080fd5b503360008181526005602090815260409182902080543490810190915560028054820190558251938452908301819052600183830152905190916000805160206105a6833981519152919081900360600190a150005b34801561013357600080fd5b5061013c610259565b005b34801561014a57600080fd5b506101536102f2565b604080519115158252519081900360200190f35b34801561017357600080fd5b5061017c610300565b60408051918252519081900360200190f35b34801561019a57600080fd5b5061017c610306565b3480156101af57600080fd5b5061017c61030c565b61013c610312565b3480156101cc57600080fd5b5061013c610459565b3480156101e157600080fd5b5061017c600160a060020a036004351661047e565b34801561020257600080fd5b50610153610490565b34801561021757600080fd5b50610220610499565b60408051600160a060020a039092168252519081900360200190f35b34801561024857600080fd5b5061017c6104a8565b61013c6104ae565b60035442101561026857600080fd5b600654610100900460ff161561027d57600080fd5b600154600254106102e1576006805460ff1916600117905560005460025460408051600160a060020a039093168352602083019190915280517fec3f991caf7857d61663fd1bba1739e04abd4781238508cde554bb849d790c859281900390910190a15b6006805461ff001916610100179055565b600654610100900460ff1681565b60025481565b60015481565b60035481565b60035460009042101561032457600080fd5b60065460ff1615156103b55750336000908152600560205260408120805490829055908111156103b557604051339082156108fc029083906000818181858888f19350505050156103a257604080513381526020810183905260008183015290516000805160206105a68339815191529181900360600190a16103b5565b3360009081526005602052604090208190555b60065460ff1680156103d15750600054600160a060020a031633145b156104565760008054600254604051600160a060020a039092169281156108fc029290818181858888f193505050501561044b576000805460025460408051600160a060020a03909316835260208301919091528181019290925290516000805160206105a68339815191529181900360600190a1610456565b6006805460ff191690555b50565b600054600160a060020a0316331461047057600080fd5b600054600160a060020a0316ff5b60056020526000908152604090205481565b60065460ff1681565b600054600160a060020a031681565b60045481565b60035460009042106104bf57600080fd5b6001546002541180156104dc5750600054600160a060020a031633145b15610456573360009081526005602052604090205460015460025403111561051457503360009081526005602052604090205461051d565b50600154600254035b60008054604051600160a060020a039091169183156108fc02918491818181858888f193505050501561044b573360009081526005602090815260408083208054859003905582546002548251600160a060020a03929092168252928101929092528181019290925290516000805160206105a68339815191529181900360600190a16104565600e842aea7a5f1b01049d752008c53c52890b1a6daf660cf39e8eec506112bbdf6a165627a7a723058200fa3386911f3d69c62e075ad5526821f1765c55c55d4e4045a9cf2569d7e6d830029" }, "CrowdFunding.sol:token": { "abi": "[{\"constant\":false,\"inputs\":[{\"name\":\"receiver\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]", "bin": "" } }, "version": "0.4.25+commit.59dbf8f1.Linux.g++" };
var CrowdFundingContractAbi = CrowdFundingOutput.contracts['CrowdFunding.sol:CrowdFunding'].abi;
var CrowdFundingBinCode = "0x" + CrowdFundingOutput.contracts['CrowdFunding.sol:CrowdFunding'].bin;
var tokenContractAbi = CrowdFundingOutput.contracts['CrowdFunding.sol:token'].abi;
var tokenBinCode = "0x" + CrowdFundingOutput.contracts['CrowdFunding.sol:token'].bin;
var deployTransactionObject2 = { from: web3.eth.accounts[0], data: CrowdFundingBinCode, gas: 1000000 };
var deployTransactionObject3 = { from: web3.eth.accounts[0], data: tokenBinCode, gas: 1000000 };
var CrowdFundingContract = new web3.eth.Contract(JSON.parse(CrowdFundingContractAbi), deployTransactionObject2);
var tokenContract = new web3.eth.Contract(JSON.parse(tokenContractAbi), deployTransactionObject3);
var CrowdFunding = null;
var token = null;
var _ftevent = null;

CustomTokenCA.then(function (_ctk_ca) {
    CrowdFundingContract.deploy({
        arguments: [1000, 10, 1, _ctk_ca]
    }).send({
        from: defaultAddr,
        gas: 1000000
    }, function (error, transactionHash) {
        console.log("Deploying CrowdFunding, with " + _ctk_ca + " txhash: ");
        console.log(transactionHash);
    })
        .then(function (newContractInstance) {
            console.log("CrowdFunding CA: ");
            console.log(newContractInstance.options.address) // instance with the new contract address
            return newContractInstance;
        })
        .then(function (data) {
            CrowdFunding = data;
        })
        .then(function (data) {
			/*
			web3.eth.sendTransaction(
				{
					from : defaultAddr,
					to : CustomToken.options.address,
					value : '10000000000000000000',
					gas: 155000
				}, function(error, hash){
					console.log(error);
				}).then(function(data){
					console.log("Sent 10 ETH to CustomToken");
					});*/
            ;
        });
    ;
});

app.use(express.static("public"));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
