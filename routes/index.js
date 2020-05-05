const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const alert = require("alert-node");


router.get("/", function(req, res){
	res.render("index");
});


//login post request:
router.post("/index", function(req, res){

	const email = req.body.email;
	const password = req.body.password;
	const userType = req.body.userType;

	if(userType == 'student'){
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
			`SELECT Password, Validation FROM StudentUser WHERE EmailAddress=('${email}')`,
			(err, rowCount) => {
				if (err) {
				  console.error(err.message);
				} else {
					  console.log(`${rowCount} row(s) returned`);
					if(rowCount == 0){
						console.log("login failed, wrong email or password");
						popupS.alert({
							content: 'Login failed, wrong Email or Password'
						});
					}
				}
			  }
			);

		request.on("row", columns => {
			if(password == columns[0].value){
				if(columns[1].value==0){
					console.log("no validation")
					alert("Your account is not valid yet");
				}
				else{
					console.log("Login success");
					//render student homepage:->
				}

			}else{
				console.log("login failed, wrong e email or password");
				alert("Login failed, wrong Email or Password");
			}
		});

		connection.execSql(request);
	}}
	else if(userType == 'owner'){
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
			`SELECT Password FROM ApartmentOwnerUser WHERE EmailAddress=('${email}')`,
			(err, rowCount) => {
				if (err) {
					console.error(err.message);
				}else {
					console.log(`${rowCount} row(s) returned`);
					if(rowCount == 0){
						console.log("login failed, wrong email or password");
						alert("Login failed, wrong Email or Password");
					}
				}
			}
		);
		request.on("row", columns => {
			columns.forEach(column => {
				if(password == column.value){
					console.log("login success");
					//render Apartment Owner homepage:->
				}else{
					console.log("login failed, wrong e email or password");
					alert("Login failed, wrong Email or Password");
				}
			});
		});
		connection.execSql(request);
		res.render("index");	
	}
}});
module.exports = router;