const express = require ("express");
const router = express.Router();
const registerUtils = require ('../models/registerUtils');
const nodemailer = require('nodemailer');
const alert = require("alert-node");

router.get("/recoveryPassword", function(req, res){
	res.render("recoveryPassword");
});


router.post('/recoveryPassword', function(req, res, next){
    const email = req.body.email;
    console.log(email);
    registerUtils.checkEmail(email,function(result) {
        if (result===0){
            res.render('recoveryPassword', {
                msg: 'Email is not exist'
              }); 
            }
        else{
            const output = `
            <P>new contact request</p>
            <h3>details</h3>
            <ul>
                <li>Email: ${req.body.email}</li>
            </ul>
        `;
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
            to: req.body.email,
            subject: "you have a new message", // Subject line
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + req.body.email + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        
        transporter.sendMail(mailOptions, function(err, data) {
            if(err){
                console.log(err);
            } else{
                console.log('email sent!');
                res.render("contact_send");

            }
        });
    }
});
});
module.exports = router;