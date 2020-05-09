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
dotenv.config();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("./public"));
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

 app.listen(process.env.PORT, process.env.IP, function(){
 	console.log("Server has started");
 });
