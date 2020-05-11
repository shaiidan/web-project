  
module.exports = config = {
	authentication: {
	  options: {
		userName: process.env.AZURENAME, 
		password: process.env.PASS
	  },
	  type: "default"
	},
	server: "samiroom.database.windows.net", 
	options: {
	  database: "samiroomDB",
	  encrypt: true,
	  enableArithAbort: true,
	  rowCollectionOnRequestCompletion:true,
	  trustServerCertificate: true,
	}
  };
