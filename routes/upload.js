const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const router = express.Router();
const app = express();
const nodemailer = require('nodemailer');
const fs = require('fs');
app.use(express.static("./public"));

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/imgs/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
// Public Folder
router.use(express.static('./public'));


router.get("/upload",function(req, res){
  const email = req.query.email;
  res.render('upload',{email:email, msg:req.query.msg});
});

router.post('/upload', (req, res) => {
const email=req.body.email;
console.log("email");
  upload(req, res, (err) => {
    if(err){
      console.log(req.body.email);
      res.redirect("/upload?email="+req.body.email+'&msg='+'Try to upload again');
    } else {
      if(req.file == undefined){
        console.log(req.body.email);
        res.redirect("/upload?email="+req.body.email+'&msg='+'Try again');
      } else {
        
        const output = `
		    <P>new contact request</p>
		    <h3>details</h3>
		    <ul>
			  <li>Email: ${req.body.email}</li>
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
		subject: "New student", // Subject line
    text: 'You need to validate/reject the student card enter this link - .\n\n' +
    'http://' + req.headers.host + '/valid/'+req.body.email+'\n\n',
		attachments: [
      { // Use a URL as an attachment
        filename: `imgs/uploads/${req.file.filename}`,
        path: `${req.file.path}`
    }
  ]
	};
	transporter.sendMail(mailOptions, function(err, data) {
		if(err){
			console.log(err);
		} else{
			console.log('email sent!');
		}
	});
        res.render('contact_send',{
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});
module.exports = router;
