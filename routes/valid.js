const express = require ("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const alert = require("alert-node");
const registerUtils = require('../models/registerUtils');
const authenticate = require("./authenticate").redirectHome;

router.get('/valid/:email',authenticate, function(req, res) {
	if("999999"===req.session.userId){
        res.render('valid',{param:req.params});
    }
    else{
		res.render("Error");
	}
});

router.post('/valid/:email', function(req, res) {
    const email = req.params.email;
    const exp = req.body.date;

    registerUtils.updateExp(email, exp,function(result){
        if(result == true){
        console.log(email);
        console.log(exp);
	    let transporter = nodemailer.createTransport({
		service: 'gmail',
		// port: 587,
   		// secure: false,
		auth: {
		  user: process.env.EMAIL_ADDRESS,
		  pass: process.env.EMAIL_PASSWORD 
		}
	});
	  // send mail with defined transport object
	    let mailOptions = {
		from: process.env.EMAIL_ADRESS, // sender address
		to: req.params.email,
		subject: "Profile validation", // Subject line
        text: 'Your are now abble to get aaccess to our site, thanks, samiroom, '
	};
	transporter.sendMail(mailOptions, function(err, data) {
		if(err){
			console.log(err);
		} else{
			console.log('email sent!');
		}
	});
          res.redirect("/index");
        }
        else{
            console.log("somthingwrong");
            res.render('index');
        }
      });
});

router.post('/reject/:email', function(req, res) {
	let transporter = nodemailer.createTransport({
	service: 'gmail',
	// port: 587,
   	// secure: false,
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD 
	}
	});
	  // send mail with defined transport object
	    let mailOptions = {
		from: process.env.EMAIL_ADRESS, // sender address
		to: req.params.email,
		subject: "Reject student card", // Subject line
        text: 'We reject your student card, please upload new one - \n\n '+
        'http://' + req.headers.host + '/uploadnew'+'\n\n'
	};
	transporter.sendMail(mailOptions, function(err, data) {
		if(err){
			console.log(err);
		} else{
            console.log('email sent!');
            res.render('index');
		}
	});   
});
module.exports = router;
 
