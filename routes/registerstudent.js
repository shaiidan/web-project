const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const alert = require("alert-node");
const registerUtils = require('../models/registerUtils');

router.get("/registerstudent", function(req, res){
	res.render("registerstudent");
});

//registerstudent post request:
router.post("/registerstudent", function(req, res, file){
	const id = req.body.id;
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;
	const validation = 0;
	const confirm = req.body.confirm;
	if(confirm!=password){
		alert("Password not match, try again");
	}
	else{
	registerUtils.checkEmailAndId(email,id,function(result){
		if(result==true){
      registerUtils.addStudent(email, id, phone, name, password, validation,function(result){
        if(result == true){
          res.redirect("/upload?email="+email);
        }
        else{
            console.log("somthingwrong");
            res.redirect("/registerstudent");
        }
      });
    }
		else{
			console.log("login failed,Email or ID already exist");
			alert("Login failed,Email or ID already exist");
    }
});
	}
});

module.exports = router;