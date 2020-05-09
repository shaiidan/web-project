/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
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
	const confirm = req.body.confirm;
	if(confirm!=password){
		alert("Password not match");
		res.redirect("/registersowner");
	}
	else{
    registerUtils.checkEmailAndId(email,id,function(result){ 
		if(result == true){
            registerUtils.addOwner(id, name, email, password, phone, function(result){
                if(result == true){
                    res.redirect("/ApartmentOwnerHomePage?id="+id+'&fullName='+full_name);
                }else {
                    console.log("register failed");
                    res.redirect('/registerowner');
                } 
            });
        }
        else {
            console.log("login failed,Email or ID already exist");
		    alert("Login failed,Email or ID already exist");
        }
	});
}
});

module.exports = router;
