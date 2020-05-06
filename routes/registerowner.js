/* eslint-disable no-use-before-define */
const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const alert = require("alert-node");
const checkEmailAndId = require ('../models/registerUtils');


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
	// checkEmailAndId(email,id);
	if(checkEmailAndId(email,id)){
		const connection = new Connection(dbConfig);
		connection.connect();
		connection.on("connect", err => {
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
				  connection.execSql(request);
				}
		  	}
			);
			request.on("row", columns => {
		  	columns.forEach(column => {
				console.log("%s\t%s", column.metadata.colName, column.value);
		  	});
			});
			// connection.execSql(request);
			res.render("index");
	}}
	else{
		console.log("login failed,Email or ID already exist");
		alert("Login failed,Email or ID already exist");
	}
});
module.exports = router;