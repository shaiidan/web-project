const express = require ("express");
const router = express.Router();
const registerUtils = require ('../models/registerUtils');
const nodemailer = require('nodemailer');
const alert = require("alert-node");

router.get("/uploadnew", function(req, res){
	res.render("uploadnew");
}); 
router.post('/uploadnew', function(req, res, next){
    const email = req.body.email;
    console.log(email);
    console.log(email);
    registerUtils.checkEmail(email,function(result) {
        if (result===0){
            console.log ('No account with that email address exists.');
            alert("No account with that email address exists"); 
            }
        else{
            res.redirect("/upload?email="+email);
    }
});
});
module.exports = router;