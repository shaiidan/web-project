const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const alert = require("alert-node");
var multer  = require('multer');
// const upload = require('../middlewares/upload');
var upload = multer({ dest: 'uploads/' });

const registerUtils = require('../models/registerUtils');

router.get("/registerstudent", function(req, res){
	res.render("registerstudent");
});

//registerstudent post request:
router.post('/registerstudent', upload.single('studentCard') ,function(req, res, next){
	const id = req.body.id;
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;
	const validation = 0;



	registerUtils.checkEmailAndId(email,id,function(result){
		if(result===0){
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
				  	console.log("user is succesfuly registered!");
					}
			});	  
        	connection.execSql(request);
		}}
		else{
			console.log("login failed,Email or ID already exist");
			alert("Login failed,Email or ID already exist");
		}
	});
		res.render("index");
});

module.exports = router;