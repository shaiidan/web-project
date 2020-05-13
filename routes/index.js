const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const dbConfig = require ('../models/dbconfig');
const app = express();
const md5 = require('md5');
app.set("view engine", "ejs");

router.get("/", function(req, res){
	
	res.render("index");
});


router.get("/index", function(req, res){
	res.render("index");
});


//login post request:
router.post("/index", function(req, res){
	const email = req.body.email;
	const password = md5(req.body.password);
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
			`SELECT Password, Exp, ID, FullName FROM StudentUser WHERE EmailAddress=('${email}')`,
			(err, rowCount,rows) => {
				if (err) {
				  console.error(err.message);
				  connection.close();
				} else {
					  console.log(`${rowCount} row(s) returned`);
					if(rowCount == 0){
						res.render('index', {
							msg: 'Login faild, email is not exist'
						  });
					}
					else
					{
						rows.forEach(element => {
							var pass,full_name,id, exp;
							element.forEach(column =>{
								switch(column.metadata.colName)
								{
									case 'Password':{
										pass = column.value;
										break;
									}
									case 'ID':{
										id = column.value;
										break;
									}
									case 'FullName':{
										full_name = column.value;
										break;
									}
									case 'Exp':{
										exp = column.value;
										break;
									}
								}
							});
							const user = id;
							if(password == pass){
								if(exp< Date.now()){
									console.log("no validation");
									res.redirect("/upload?email="+email +"&msg="+"your account is not validate yet");
									connection.close();
								}
								else{
									console.log("Login success by user: " +id);
									req.session.userId = user;
									res.redirect("/StudentHomePage?id="+id+'&fullName='+full_name);
									connection.close();
								}
							}
							else{
								res.render('index', {
									msg: 'Incorrect password'
								  });
							}
						});
					}
				}});
				connection.execSql(request);
			}
		}
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
			`SELECT Password, ID, FullName FROM ApartmentOwnerUser WHERE EmailAddress=('${email}')`,
			(err, rowCount, rows) => {
				if (err) {
					console.error(err.message);
				}else {
					console.log(`${rowCount} row(s) returned`);
					if(rowCount == 0){
						res.render('index', {
							msg: 'Login faild, email is not exist'
						  });
						connection.close();
					}
					else
					{
						rows.forEach(element => {
							var pass, full_name, id;
							element.forEach(column =>{
								switch(column.metadata.colName)
								{
									case 'Password':{
										pass = column.value;
										break;
									}
									case 'ID':{
										id = column.value;
										break;
									}
									case 'FullName':{
										full_name = column.value;
										break;
									}
								}
							});
							const user = id;
							if(password == pass){
								console.log("Login success by user: " +id);
								req.session.userId = user;
								res.redirect("/ApartmentOwnerHomePage?id="+id+'&fullName='+full_name);
								connection.close();
								}
							else{
								res.render('index', {
									msg: 'Incorrect password'
								  });
								}
							});
					}
				}});
				connection.execSql(request);
			}
			}
});
module.exports = router;
