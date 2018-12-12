var express = require('express');
var app = express();
var dir = '/home/bc/project/web/';
var bodyParser = require('body-parser');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var ArmOutput = require(dir + 'js/armsoutput_new.js');
app.use(express.static('public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var fs = require("fs");
var defaultAddr = "0xa92fa8c0462e228904772d9abe4b3169d7acdbc0"; //--datadir fastdata
var unlockPromise = web3.eth.personal.unlockAccount(defaultAddr, "ec7t8b5z8*", 3600).then(function(_res){
        console.log("password unlock");
});

app.use('/', express.static(dir));

app.get('/Home', function (req, res) {
    res.sendFile(dir + 'view/home.html');
});

app.get('/TeamMember', function (req, res) {
    res.sendFile(dir + 'view/team_member.html');
});

app.get('/SecurityCompany', function (req, res) {
    res.sendFile(dir + 'view/security_company.html');
});

app.get('/DeveloperRank', function (req, res) {
    res.sendFile(dir + 'view/developer_rank.html');
});

app.get('/Application', function (req, res) {
    res.sendFile(dir + 'view/application.html');
});

app.get('/Application/:app_name', function (req, res) {
    console.log("im here");
    res.sendFile(dir + 'view/app_leak_list.html');
});

app.listen(3000, function () {
    console.log('Conneted 3000 port!');
});

var ArmsOutput = ArmOutput.ArmsOutput;
var ArmsContractAbi = ArmsOutput.contracts['Arms.sol:Arms'].abi;
var contractAddr = "0xf4872c1CeC4851bE14E3593CaB22ACbEDe632139";
Arms = new web3.eth.Contract(JSON.parse(ArmsContractAbi), contractAddr);


app.get("/test", function(req, res){
/*
	var company_lists =Arms.methods.get_company_name_arr().call({from: defaultAddr});
	company_lists.then(function(_result) {
	     console.log("company lists");
	     console.log(_result);
	});

    var num_total_app = Arms.methods.num_total_apps().call({from: defaultAddr});
    num_total_app.then(function(_result) {
	    console.log("num_total_app");
	    console.log(_result);
		res.send(_result);
	}); 


    var result = Arms.methods.get_app("kakao").call({from: defaultAddr});
    result.then(function(_result) {
	    console.log("get_app(kakao)");
	    console.log(_result);
	}); 

    var result2 = Arms.methods.app2leak_i("kakao", 0).call({from: defaultAddr});
    result2.then(function(_result) {
	    console.log("app2leak_i(kakao, 0)");
	    console.log(_result);
	}); 

    var result3 = Arms.methods.test2("hello").call({from: defaultAddr});
    result3.then(function(_result) {
	    console.log("test!!!");
	    console.log(_result);
	});*/
	get_SC_info_lists();
});

function get_SC_info_lists() {
    var SCNameLists = [];
	SCNameLists=get_SC_name_list();
	console.log("after function call");
    var i, addPoint, appNum, specialArea;
    for (i = 0; i < 1; i++) {
        cname = SCNameLists[i];
        addPoint = get_SC_add_point(cname);
        appNum = get_SC_app_num(cname);
        specialArea = get_specialized_area(cname);
    }
}

function get_SC_name_list() {
	var company_lists =Arms.methods.get_company_name_arr().call({from: defaultAddr});
	company_lists.then(function(_result) {
	     console.log("company lists");
	     console.log(_result);
		 return _result;
	});
}

function get_SC_add_point(cname) {
    var addPoint = Arms.methods.get_com(cname).call({ from: defaultAddr });
    addPoint.then(function (_result) {
         console.log("add points : " + _result);
		 return _result;
    });
}

function get_SC_app_num(cname) {
   var appNum = Arms.methods.get_com(cname).call({ from: defaultAddr });
   appNum.then(function (_result) {
	   console.log("app Number : " + _result);
	   return _result;
   });
}

function get_specialized_area(cname) {
    var specialArea = Arms.methods.max_category(cname).call({ from: defaultAddr });
    specialArea.then(function (_result) {
        console.log("specialized area : " + _result);
		return _result;
    });
}


//../go-ethereum/build/bin/geth --datadir ./node --rpc --networkid 8079 --rpcapi 'web3, net, personal, admin, eth' --rpcaddr "0.0.0.0"  --rpcport 8545 --rpccorsdomain "*" console

//admin.addPeer("enode://9157807b41da7be331120e8bd94afabae22d99b8c312c80ed1223fde71cbe33a304e8b0e3a9ed8f0a3551e4ec38ad6225ab5ecb7393e4e6765a53bb75de3ce9e@141.223.82.142:30303")

/*personal.unlockAccount("0x8baf59b09d911b0be6977bf57fbbaef4a4af908a", "coinbase")
eth.getBalance("0x82dea506bcdd922083825d80d908f3e2077dbd73")
eth.sendTransaction({from:"0x8baf59b09d911b0be6977bf57fbbaef4a4af908a", to:"0x82dea506bcdd922083825d80d908f3e2077dbd73", value: 10000000000000000000})*/

//https://ethereum.stackexchange.com/questions/38034/using-sendtransaction-in-web3-js
//https://web3js.readthedocs.io/en/1.0/web3-eth-personal.html#id25
//http://www.chaintalk.io/archive/lecture/501



