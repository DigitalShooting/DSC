var test = require('unit.js');

var config = require("../config/index.js")

// dsc api init
var DSCDataAPI = require("../lib/DSCDataAPI.js")
var dscDataAPI = DSCDataAPI()

describe('DSCDataAPI', function(){
	it("setUser", function(){
		dscDataAPI.setUser({
			firstName: "Gast",
			lastName: "",
			verein: "",
			manschaft: "",
		})
	});

	it("setDisziplin & setPart", function(){
		dscDataAPI.setDisziplin(config.disziplinen.all.lg_training)
		dscDataAPI.setPart("match")
	});

	// it("newShot", function(){
	// });
	// it("newTarget", function(){
	// });
	// it("newTarget", function(){
	// });
	// it("setSelectedSerie", function(){
	// });
	// it("setSelectedShot", function(){
	// });
	// it("getActiveDisziplin", function(){
	// });
	// it("getActiveSession", function(){
	// });
	// it("getActiveData", function(){
	// });
});
