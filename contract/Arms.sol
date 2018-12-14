pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

contract Arms {
	struct Leak {
		string source;
		string sink;
	}

	struct Developer {
		string dname; //key
		uint256 reputation;
		uint256 num_apps;
		bool exists;
	}

	struct Company {
		string cname; //key
		address addr;
		uint256 ad_point;
		uint256 num_apps;
		mapping(uint256 => uint256) cate2num;
		bool exists;
	}

	struct App {
		string aname; //key
		string developer;
		uint256 num_leaks;
		uint256 category; //0: game, 1: productivity, 2: social, 3: wallpaper, 4:weather
		bool exists;
	}

	// ========================= Database ================================	

	// 1) =================== Metadata ==========================	
	uint256 public num_total_apps;
	uint256 public num_total_coms;
	uint256 public num_total_devs;
	string[] public company_name_arr;
	string[] public app_name_arr;
	string[] public developer_name_arr;

	// 2) =================== Entity ==========================	
	mapping(string => Company) companies;
	mapping(string => App) apps;
	mapping(string => Developer) developers;

	// 3) =================== Relationship ==========================	
	mapping(string => Leak[]) app2leak;
	mapping(string => App[]) com2app;
	mapping(string => App[]) dev2app;

	// =================== Market Address ==========================	
	address market_addr;


	function get_num_apps(string cname) public returns (uint256) {
		return companies[cname].num_apps;
	}

	function get_company_name_arr() public returns(string[]){
		return company_name_arr;
	}

	function get_developer_name_arr() public returns(string[]){
		return developer_name_arr;
	}

	function get_application_name_arr() public returns(string[]){
		return app_name_arr;
	}

	// Function to be called when investing
	function set(string cname, string aname, string acategory, string dname, string source, string sink) public {
		uint256 uintcategory = cate2uint(acategory);

		// ====================Construct a new company object==========================	
		Company storage new_company;
		if(companies[cname].exists == false) {
			companies[cname] = Company({cname: cname, addr: msg.sender, num_apps: 0, ad_point: 0, exists: true});
			num_total_coms++;
			company_name_arr.push(cname);
		}
		new_company = companies[cname];

		// ====================Construct a new devleoper object==========================	
		Developer storage new_developer;
		if(developers[dname].exists == false) {
			developers[dname] = Developer({dname: dname, num_apps: 0, reputation: 0, exists: true});
			num_total_devs++;
			developer_name_arr.push(dname);
		}
		new_developer = developers[dname];


		// ====================Construct a new app object==========================	
		App storage new_app;
		if(apps[aname].exists == false) {
			apps[aname] = App({aname: aname, developer: dname, num_leaks : 0, category: uintcategory, exists: true});
			num_total_apps++;
			app_name_arr.push(aname);
		}
		new_app = apps[aname];

		// ====================Push the leak into app2leak==========================	
		app2leak[aname].push(Leak({source: source, sink: sink})); 
		new_app.num_leaks++;

		// ====================Push the app into com2app==========================	
		if(member(com2app[new_company.cname], new_company.num_apps, new_app.aname) == false) {
			com2app[new_company.cname].push(new_app);
			new_company.num_apps++;
			new_company.cate2num[uintcategory]++;
		}

		// ====================Push the app into dev2app==========================	
		if(member(dev2app[new_developer.dname], new_developer.num_apps, new_app.aname) == false) {
			dev2app[new_developer.dname].push(new_app);
			new_developer.num_apps++;
		}

		// ====================Send 10 Ether to the caller company==========================	
		companies[cname].ad_point += 10;
	}   
	function cate2uint(string cate) private returns (uint256) {
		if (compareStrings(cate, "game"))
			return 0;
		else if (compareStrings(cate, "productivity"))
			return 1;
		else if (compareStrings(cate, "social"))
			return 2;
		else if (compareStrings(cate, "wallpaper"))
			return 3;
		else if (compareStrings(cate, "weather"))
			return 4;
	}
	function member(App[] arr, uint256 num, string aname) private returns (bool) {
		for(uint256 i = 0 ; i < num; i++){
			if(compareStrings(arr[i].aname, aname)) 
				return true;
		}
		return false;
	}

	function get_app(string aname) public view returns(uint256,string, uint256) {
		if(apps[aname].exists)
			return (apps[aname].num_leaks, apps[aname].developer, apps[aname].category);
		else
			return (999, "no", 999);
	}

	function get_com(string cname) public view returns(address, uint256, uint256) {
		if(companies[cname].exists)
			return (companies[cname].addr, companies[cname].ad_point, companies[cname].num_apps);
		else
			return (address(0), 999, 999);
	}

	function get_dev(string dname) public view returns(uint256, uint256) {
		if(developers[dname].exists)
			return (developers[dname].reputation, developers[dname].num_apps);
		else
			return (999, 999);
	}

	function max_category(string cname) public view returns(uint256) {
		uint256 max = 0;
		for (uint256 cate = 1 ; cate < 5 ; cate++) {
			if(companies[cname].cate2num[max] < companies[cname].cate2num[cate])
				max = cate;
		}
		return max;
	} 	

	//SELECT * FROM app2leak WHERE aname = aname
	function app2leaks(string aname) public view returns(Leak[]) {
		return app2leak[aname];
	}


	//SELECT * FROM com2app WHERE cname = cname
	function com2apps(string cname) public view returns (App[]) {
		return com2app[cname];
	}


	//SELECT * FROM com2app WHERE dname = dname	
	function dev2apps(string dname) public view returns (App[]) {
		return dev2app[dname];
	}

	//SELECT * FROM app2leak WHERE aname = aname AND index = i
	function app2leak_i(string aname, uint256 i) public view returns(string, string) {
		Leak storage leak = app2leak[aname][i];
		return (leak.source, leak.sink);
	}

	//SELECT * FROM com2app WHERE cname = cname AND index = i
	function com2app_i(string cname, uint256 i) public view returns (string, uint256, uint256) {
		App app = com2app[cname][i];
		return (app.aname, app.num_leaks, app.category);
	}

	//SELECT * FROM com2app WHERE dname = dname	AND index = i
	function dev2app_i(string dname, uint256 i) public view returns (string, uint256, uint256) {
		App app = dev2app[dname][i];
		return (app.aname, app.num_leaks, app.category);
	}

	function test2 (string name) public returns (string) {
		return name;
	}   

	function ether2wei (uint num) internal pure returns (uint256) {
		return num * (10 ** 18);
	}   

	function compareStrings (string a, string b) internal pure returns (bool){
		return keccak256(a) == keccak256(b);
	}   
}
