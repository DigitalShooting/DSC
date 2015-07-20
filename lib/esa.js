var config = require("../config.js")
var exec = require('exec');

module.exports = function(){

	var esa = {}

	esa.band = function(){
		exec(['./Band', config.esa.com], function(err, out, code) {
			if (err instanceof Error) throw err;
			//process.stderr.write(err);
			process.stdout.write(out);
			//process.exit(code);
		});
	}

	esa.nop = function(){
		exec(['./NOP', config.esa.com], function(err, out, code) {
			if (err instanceof Error) throw err;
			//process.stderr.write(err);
			process.stdout.write(out);
			//process.exit(code);
		});
	}

	return esa
}
