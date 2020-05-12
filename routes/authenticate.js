const session = require('express-session');
const express = require("express");
const app = express();

app.use(session({
	name: "samiroom",
	resave: false,
	saveUninitialized: false,
	secret: "fsderwerwer",
	cookie:{
		maxAge: 1000*60*60*2,
		sameSite:true,
		secure: "samiroom"
	}
}));

const redirectHome = (req, res, next) =>{
	if(!req.session.userId){
		res.redirect('/error');
	} else{
		next();
	}
}

exports.redirectHome = redirectHome;