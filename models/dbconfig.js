module.exports = config = {
	authentication: {
	  options: {
		userName: "samiroom", 
		password: "Lucas2020" 
	  },
	  type: "default"
	},
	server: "samiroom.database.windows.net", 
	options: {
	  database: "samiroomDB",
	  encrypt: true
	}
  };
  config.options.trustServerCertificate = true;

