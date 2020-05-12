const express = require ("express");
const router = express.Router();
const nodemailer = require('nodemailer');
router.get("/contactus", function(req, res){
	res.render("contactus");
});

router.get("/contact_error", function(req, res){
	res.render("contact_error");
});

router.get("/contact_send", function(req, res){
	res.render("contact_send");
});

router.post("/contactus", function(req, res){
	const output = `
		<P>new contact request</p>
		<h3>details</h3>
		<ul>
			<li>Email: ${req.body.email}</li>
			<li>Name: ${req.body.name}</li>
			<li>Message: ${req.body.message}</li>
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
		to: 'samiroomgroup3@gmail.com',
		subject: "you have a new message", // Subject line
		text: "Hello", // plain text body
		html: output // html body
	};
	
	transporter.sendMail(mailOptions, function(err, data) {
		if(err){
			console.log(err);
			return res.render("contact_error");
		} else{
			console.log('email sent!');
			return res.render("contact_send");
		}
	});

// }
});
module.exports = router;