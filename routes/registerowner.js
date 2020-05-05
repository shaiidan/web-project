const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const alert = require("alert-node");
const registerUtils = require ('../models/registerUtils');


router.get("/registerowner", function(req, res){
	res.render("registerowner");
});

//registerowner post request:
router.post("/registerowner", function(req, res){
	const id = req.body.id;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const phone = req.body.phone;

    registerUtils.checkEmailAndId(email,id,function(result){ 
		if(result===0){
			const connection1 = new Connection(dbConfig);
			connection1.connect();
			connection1.on("connect", err => {
            	if (err) {
              	console.error(err.message);
            	} else {
              	queryDatabase();
            	}
          	});
        	function queryDatabase() {
			const request = new Request(
				`INSERT INTO ApartmentOwnerUser VALUES ('${id}', '${name}', '${email}', '${password}', '${phone}')`,
				(err, rowCount) => {
					if (err) {
			  		console.error(err.message);
					} else {
				  	console.log(`${rowCount} row(s) returned`);
				  	console.log("user is succesfuly registered!");
					}
		  		}
				);
				connection1.execSql(request);
		}}
		else{
			console.log("login failed,Email or ID already exist");
			alert("Login failed,Email or ID already exist");
		}
	});
	res.render("index");
});
module.exports = router;