/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const md5 = require('md5');
const registerUtils = require ('../models/registerUtils');


router.get("/registerowner", function(req, res){
	res.render("registerowner");
});

//registerowner post request:
router.post("/registerowner", function(req, res){
	const id = req.body.id;
	const full_name = req.body.name;
	const email = req.body.email;
	const password = md5(req.body.password);
	const phone = req.body.phone;
	const confirm = md5(req.body.confirm);
	if(confirm!=password){
		res.render('registerowner', {
			msg: 'Password are not match, try again'
		  });
	}
	else{
    registerUtils.checkEmailAndId(email,id,function(result){ 
		if(result == true){
            registerUtils.addOwner(id, full_name, email, password, phone, function(result){
                if(result == true){
					req.session.userId = id;
                    res.redirect("/ApartmentOwnerHomePage?id="+id+'&fullName='+full_name);
                }else {
                    console.log("register failed");
                    res.redirect('/registerowner');
                } 
            });
        }
        else {
			res.render('registerowner', {
				msg: 'Email or ID already exist'
			  });
        }
	});
}
});

module.exports = router;
