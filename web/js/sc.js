function get_SC_info_lists(Arms, defaultAddr) {
	var SCNameLists = ['sc1'];
    //SCNameLists=get_SC_name_lists();
	console.log("after function call");
	var i, addPoint, appNum, specialArea;
	for (i = 0; i < 1; i++) {
	       cname = SCNameLists[i];
	       addPoint = get_SC_add_point(cname, Arms, defaultAddr);
	       console.log(addPoint);
	       appNum = get_SC_app_num(cname);
	       specialArea = get_specialized_area(cname);
	}																    }   
}

function get_SC_name_lists(Arms, defaultAddr) {
	var company_lists =Arms.methods.get_company_name_arr().call({from: defaultAddr});
	company_lists.then(function(_result) {
	      console.log("company lists");
	      console.log(_result);
	      return _result;
	}); 
}

function get_SC_add_point(cname, Arms, defaultAddr) {
	    var addPoint = Arms.methods.get_com(cname).call({ from: defaultAddr }); 
	    addPoint.then(function (_result) {
	         console.log("add points : " + _result[1]);
	         return _result[1];
	   }); 
}

function get_SC_app_num(cname, Arms, defaultAddr) {
	   var appNum = Arms.methods.get_com(cname).call({ from: defaultAddr });
       appNum.then(function (_result) {
           console.log("app Number : " + _result[2]);
    	   return _result[2];
	   });
}

function get_specialized_area(cname, Arms, defaultAddr) {
	    var specialArea = Arms.methods.max_category(cname).call({ from: defaultAddr });
	    specialArea.then(function (_result) {
	        console.log("specialized area : " + _result);
	        return _result;
	    });
}

module.exports={
	get_SC_info_lists,
	get_SC_name_lists,
	get_SC_add_point,
	get_SC_app_num,
	get_specialized_area
}


