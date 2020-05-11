/* eslint-disable no-unused-vars */
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
const studentHomePage = require('./routes/StudentHomepage');
const ApartmentOwnerHomepage = require('./routes/ApartmentOwnerHomepage');
const uploadUnit = require('./routes/uploadUnit');
const updateUnit = require('./routes/updateUnit');
const summaryPayment = require('./routes/summaryPayment');
const rentalHistoryRouter = require('./routes/rentalHistory');
const studentUserProfileRouter = require('./routes/studentUserProfile');
const apartmentOwnerUserProfileRouter = require('./routes/apartmentOwnerUserProfile');

dotenv.config();
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
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(indexRoutes);
app.use(registerOnwerRoutes);
app.use(registerStudentRoutes);
app.use(termsRoutes);
app.use(privacyRoutes);
app.use(contactUsRoutes);
app.use(studentHomePage);
app.use(ApartmentOwnerHomepage);
app.use(uploadUnit);
app.use(updateUnit);
app.use(summaryPayment);
app.use(rentalHistoryRouter);
app.use(studentUserProfileRouter);
app.use(apartmentOwnerUserProfileRouter);

//  app.listen(process.env.PORT, process.env.IP, function(){
//  	console.log("Server has started");
//  });

 
app.listen(3000, function(){
	console.log("server listen on port 3000");
});
