const express = require ("express");
const router = express.Router();
const registerUtils = require ('../models/registerUtils');
const nodemailer = require('nodemailer');
const md5 = require('md5');

router.get('/reset/:token', function(req, res) {
    res.render('reset',{param:req.params, msg:''});
});
 
router.post('/reset/:token', function(req, res) {
    const email = req.params.token;
    const password = md5(req.body.Password); 
    const confirm = md5(req.body.confirm);
     
    if(password===confirm){
        registerUtils.updatePassword(email,password);
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
            to: email,
            subject: "you have a new message", // Subject line
            text: 'This is a confirmation that the password for your account ' + email + ' has just been changed.'
        };
        
        transporter.sendMail(mailOptions, function(err, data) {
            if(err){
                console.log(err);
            } else{
                console.log('email sent!');
            }
        });
        res.redirect('/');
    }
    else{
        res.render('reset',{param:req.params, msg:'passwords are not match'});
}
});

module.exports = router;
