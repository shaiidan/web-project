const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const alert = require("alert-node");
const checkEmailAndId = require('../models/registerUtils');
const upload = require('../middlewares/upload');





router.get("/registerstudent", function(req, res){
	res.render("registerstudent");
});

//registerstudent post request:
router.post("/registerstudent", upload.single('image'), function(req, res){
	
	const id = req.body.id;
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;
    const validation = 0;
    const file = req.body.studentCard;

	if(checkEmailAndId(email, id)){
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
			`INSERT INTO StudentUser VALUES ('${id}', '${name}', '${phone}', '${email}', '${password}', '${validation}', null)`,
			(err, rowCount) => {
				if (err) {
			  	console.error(err.message);
				} else {
                  console.log(`${rowCount} row(s) returned`);
				}
		  	}
			);
	  
		request.on("row", columns => {
		  	columns.forEach(column => {
				console.log("%s\t%s", column.metadata.colName, column.value);
		  });
		});	  
        connection.execSql(request);
		res.render("index");
	}}
	else{
		console.log("login failed,Email or ID already exist");
		alert("Login failed,Email or ID already exist");
	}
});

module.exports = router;