const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const registerUtils = require('../models/registerUtils');
const md5 = require('md5');
router.get("/registerstudent", function(req, res){
	res.render("registerstudent");
});
//registerstudent post request:
router.post("/registerstudent", function(req, res, file){
	const id = req.body.id;
	const name = req.body.name;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = md5(req.body.password);
	const validation = 0;
	const confirm = md5(req.body.confirm);
	if(confirm!=password){
		res.render('registerstudent', {
			msg: 'Password are not match, try again'
		  });
	}
	else{
	registerUtils.checkEmailAndId(email,id,function(result){
		if(result==true){
      registerUtils.addStudent(email, id, phone, name, password, validation,function(result){
        if(result == true){
          res.redirect("/upload?email="+email+"&msg="+"Register successed");
        }
        else{
            console.log("somthingwrong");
            res.redirect("/registerstudent");
        }
      });
    }
		else{
			res.render('registerstudent', {
				msg: 'Email or ID already exist'
			  });
    }
});
	}
});

module.exports = router;
