module.exports = {

	// enable/ disable database backups
	enabled: true,

	// if the newest session is less than this time (in sec) old, we load it while starting
	reloadLimit: 10*60,

	// mongodb connection params
	mongodb: {
		url: "mongodb://localhost:27017",
		collection: "dsc4aaaaooo",
	},
};
