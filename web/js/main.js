var express = require('express');
var app = express();
var dir = '/home/bc/project_dh/web/';
var bodyParser = require('body-parser');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var ArmOutput = require(dir + 'js/armsoutput_final.js');
//var sc = require(dir + 'js/sc.js');
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
//var contractAddr = "0xAc00Ce20F25d84Ced289a187Bb89224b3c553dF5";
var contractAddr = "0x04dA672741aEBcEC9911cdBF2f495C67Fe2f18Df";
Arms = new web3.eth.Contract(JSON.parse(ArmsContractAbi), contractAddr);


app.get("/sc", function(req, res){
	var SCNameLists = ['sibal'];
	SCNameLists=Arms.methods.get_company_name_arr().call({from: defaultAddr});
	SCNameLists.then(function(_scnamelist) 	{
	console.log("_scnamelist length " + _scnamelist.length);
		var d = async function loop() {
			var cname = [];
			var adPoint = [];
			var appNum = [];
			var specialArea = [];
			for (let j = 0; j < _scnamelist.length; j++) {
				await new Promise(resolve => setTimeout(resolve, 10));
				cname[j] = await _scnamelist[j];
				adPoint[j] = await get_SC_add_point(cname[j]);
				appNum[j] = await get_SC_app_num(cname[j]);
				specialArea[j] = await get_specialized_area(cname[j]);
			}
			console.log(cname);
			console.log(adPoint);
			console.log(appNum);
			console.log(specialArea);
			var arr = {
				cname : cname,
				adPoint : adPoint,
				appNum : appNum,
				specialArea : specialArea
			};
			res.send(arr);

		}(); 
	}); 
});

function get_SC_add_point(cname) {
    var addPoint = Arms.methods.get_com(cname).call({ from: defaultAddr });
    var res = addPoint.then(function (_result) {
         console.log(cname + ", add points : " + _result[1]);
		 return _result[1];
    });
	return res;
}

function get_SC_app_num(cname) {
   var appNum = Arms.methods.get_com(cname).call({ from: defaultAddr });
   var res = appNum.then(function (_result) {
	   console.log(cname + ", app Number : " + _result[2]);
	   return _result[2];
   });
   return res;
}

function get_specialized_area(cname) {
    var specialArea = Arms.methods.max_category(cname).call({ from: defaultAddr });
    var res = specialArea.then(function (_result) {
        console.log(cname + ", specialized area : " + _result);
		return _result;
    });
	return res;
}

app.get("/aa", function(req, res){
	var AppNameLists = ['sibal'];
	AppNameLists=Arms.methods.get_application_name_arr().call({from: defaultAddr});
	AppNameLists.then(function(_appnamelist) 	{
	console.log("_appnamelist length " + _appnamelist.length);
		var d = async function loop() {
			var appName = [];
			var numLeak = [];
			var dev = [];
			var cate = [];
			for (let j = 0; j < _appnamelist.length; j++) {
				await new Promise(resolve => setTimeout(resolve, 10));
				appName[j] = await _appnamelist[j];
				var app = await get_app(appName[j]);
				numLeak[j] = app[0];
				dev[j] = app[1];
				cate[j] = app[2];
			}
			//console.log(appName);
			//console.log(numLeak);
			//console.log(dev);
			//console.log(cate);
			var arr = {
				appName : appName,
				numLeak : numLeak,
				dev : dev,
				cate : cate
			};
			res.send(arr);

		}(); 
	}); 
});
function get_app(aname) {
	var app = Arms.methods.get_app(aname).call({ from: defaultAddr }); 
	var res = app.then(function (_result) {
			return _result;
			}); 
	return res;
}

app.get("/dr", function(req, res){
		var DevNameLists = [];
		DevNameLists=Arms.methods.get_developer_name_arr().call({from: defaultAddr});
		DevNameLists.then(function(_devnamelist)    {
			//console.log("_devnamelist length " + _devnamelist.length);
			var d = async function loop() {
			var devName = [];
			var leakPerNum = [];
			var cate = [];
			var apps = [];
			for (let j = 0; j < _devnamelist.length; j++) {
				await new Promise(resolve => setTimeout(resolve, 10));
				devName[j] = _devnamelist[j];
				apps[j] = [];
				var devApps = await get_devapps(devName[j]);
				var totalNumLeak = 0;
				var dd = await async function loop() {
					for (let k = 0 ; k < devApps.length ; k++) {
						await new Promise(resolve => setTimeout(resolve, 10));
						var aname = await devApps[k][0];
						var dname = await devApps[k][1];
						cate[j] = await devApps[k][3];
						apps[j][k] = aname;
						var numLeak = (await get_app(aname))[0];
						totalNumLeak += await (numLeak*1);
					}

					await new Promise(resolve => setTimeout(resolve, 10));
					return totalNumLeak;
				}().then(function(data) { 
						leakPerNum[j] = (data / devApps.length); 
					});
			}   
			//console.log(devName);
			//console.log(leakPerNum);
			bubbleSort(leakPerNum, devName, cate, apps);
			console.log(devName);
			console.log(leakPerNum);
			console.log(cate);
			console.log(apps);
			console.log("cate: " + cate);
			var arr = { 
				dev : devName,
				leakPerNum : leakPerNum,
				cate : cate,
				apps : apps
			};  
			res.send(arr);
		}(); 
	}); 
});

function bubbleSort(a, b) {
	var swapped;
	do {
		swapped = false;
		for (var i=0; i < a.length-1; i++) {
			if (a[i] > a[i+1]) {
				var tempa = a[i];
				var tempb = b[i];
				a[i] = a[i+1];
				b[i] = b[i+1];
				a[i+1] = tempa;
				b[i+1] = tempb;
				swapped = true;
			}
		}
	} while (swapped);
}
function bubbleSort(a, b, c, d) {
	var swapped;
	do {
		swapped = false;
		for (var i=0; i < a.length-1; i++) {
			if (a[i] > a[i+1]) {
				var tempa = a[i];
				var tempb = b[i];
				var tempc = c[i];
				var tempd = d[i];
				a[i] = a[i+1];
				b[i] = b[i+1];
				c[i] = c[i+1];
				d[i] = d[i+1];
				a[i+1] = tempa;
				b[i+1] = tempb;
				c[i+1] = tempc;
				d[i+1] = tempd;
				swapped = true;
			}
		}
	} while (swapped);
}
function get_totalNumLeak(devApps) {
	var totalNumLeak = 0;
	var res = async function loop() {
		for (let k = 0 ; k < devApps.length ; k++) {
			await new Promise(resolve => setTimeout(resolve, 10));
			var dname = devApps[k][0];
			var numLeak = (await get_app(dname))[0];
			totalNumLeak += await (numLeak*1);
			await console.log("sibaaaaaaaaaaaaaaaal " + totalNumLeak);
		}

		await new Promise(resolve => setTimeout(resolve, 10));
		return totalNumLeak;
	}();
	res.then
}
function get_devapps(dname) {
	    var app = Arms.methods.dev2apps(dname).call({ from: defaultAddr }); 
		var res = app.then(function (_result) {
		          return _result;
		}); 
		return res;
}

app.get("/leak", function (req, res) {
	var LeakLists = [];
	var aname = req.query.aname;
	console.log(aname);
	LeakLists = Arms.methods.app2leaks(aname).call({ from: defaultAddr });
	LeakLists.then(function (_leaklist) {
		console.log("_leaklist length " + _leaklist.length);
		var source = [];
		var sink = [];
		var d = async function loop() {
			for (let j = 0; j < _leaklist.length; j++) {
				source[j] = await _leaklist[j][0];
				sink[j] = await _leaklist[j][1];
			}
		console.log(source);
		console.log(sink);
		var arr = {
			source: source,
			sink: sink
		};
		res.send(arr);
		}();
	});
});

function get_leak(aname) {
	var leak = Arms.methods.app2leaks(aname).call({ from: defaultAddr });
	var res = leak.then(function (_result) {
			return _result;
			});
	return res;
}





//../go-ethereum/build/bin/geth --datadir ./node --rpc --networkid 8079 --rpcapi 'web3, net, personal, admin, eth' --rpcaddr "0.0.0.0"  --rpcport 8545 --rpccorsdomain "*" console

//admin.addPeer("enode://9157807b41da7be331120e8bd94afabae22d99b8c312c80ed1223fde71cbe33a304e8b0e3a9ed8f0a3551e4ec38ad6225ab5ecb7393e4e6765a53bb75de3ce9e@141.223.82.142:30303")

/*personal.unlockAccount("0x8baf59b09d911b0be6977bf57fbbaef4a4af908a", "coinbase")
eth.getBalance("0x82dea506bcdd922083825d80d908f3e2077dbd73")
eth.sendTransaction({from:"0x8baf59b09d911b0be6977bf57fbbaef4a4af908a", to:"0x82dea506bcdd922083825d80d908f3e2077dbd73", value: 10000000000000000000})*/

//https://ethereum.stackexchange.com/questions/38034/using-sendtransaction-in-web3-js
//https://web3js.readthedocs.io/en/1.0/web3-eth-personal.html#id25
//http://www.chaintalk.io/archive/lecture/501



