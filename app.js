const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dotenv = require('dotenv');
const { Connection, Request } = require("tedious");
const alert = require("alert-node");
const indexRoutes  = require('./routes/index');
const dbConfig = require ('./models/dbconfig');
const registerOnwerRoutes = require('./routes/registerowner');
const registerStudentRoutes = require('./routes/registerstudent');
const termsRoutes = require('./routes/terms');
const privacyRoutes = require('./routes/privacy');
const contactUsRoutes = require('./routes/contactus');


dotenv.config();
config.options.trustServerCertificate = true;
const connection = new Connection(dbConfig);
connection.connect(); 
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
	if (err) {
	  console.error(err.message);
	} else {
	  console.log("DB connection success");
	}
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(indexRoutes);
app.use(registerOnwerRoutes);
app.use(registerStudentRoutes);
app.use(termsRoutes);
app.use(privacyRoutes);
app.use(contactUsRoutes);



app.listen(3000, function(){
	console.log("server listen on port 3000");
});


// app.listen(process.env.PORT, process.env.IP, function(){
// 	console.log("Server has started");
// });