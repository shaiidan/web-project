/* eslint-disable no-unused-vars */
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const dotenv = require('dotenv');
const alert = require("alert-node");
const indexRoutes  = require('./routes/index');
const registerOnwerRoutes = require('./routes/registerowner');
const registerStudentRoutes = require('./routes/registerstudent');
const termsRoutes = require('./routes/terms');
const privacyRoutes = require('./routes/privacy');
const contactUsRoutes = require('./routes/contactus');
const studentHomePage = require('./routes/StudentHomepage');
const ApartmentOwnerHomepage = require('./routes/ApartmentOwnerHomepage');
const uploadUnit = require('./routes/uploadUnit');
const recoveryPassword = require("./routes/recoveryPassword");
const reset = require("./routes/reset");
const upload = require("./routes/upload");
const validate = require("./routes/valid");
const uploadnew = require('./routes/uploadnew');
const session = require('express-session');
var expressSession = require('express-session');
const updateUnit = require('./routes/updateUnit');
const summaryPayment = require('./routes/summaryPayment');
const rentalHistoryRouter = require('./routes/rentalHistory');
const studentUserProfileRouter = require('./routes/studentUserProfile');
const apartmentOwnerUserProfileRouter = require('./routes/apartmentOwnerUserProfile');

app.use(expressSession({secret: 'your secret', saveUninitialized: true, resave: false}));
app.use(session({
	name: "samiroom",
	resave: false,
	saveUninitialized: false,
	secret: "fsderwerwer",
	cookie:{
		maxAge: 1000*60*60*2,
		sameSite:true,
		secure: "samiroom"
	}
}));

dotenv.config();
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
app.use(recoveryPassword);
app.use(reset);
app.use(upload);
app.use(validate);
app.use(uploadnew);
app.use(updateUnit);
app.use(summaryPayment);
app.use(rentalHistoryRouter);
app.use(studentUserProfileRouter);
app.use(apartmentOwnerUserProfileRouter);


app.get('/logout', function(req,res){
	req.session.destroy(function(err){
		if(err){
			return res.redirect('/');
		}
		console.log("User loged out");
		res.clearCookie("samiroom");
		res.redirect('/');
	});
});

app.get('/error', function(req,res){
	res.render("Error");
});

app.listen(process.env.PORT, process.env.IP, function(){
			console.log("Server has started");
	});

 //app.listen(3000, function(){
	//	  console.log("server listen on port 3000");
	//	});
