const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const alert = require("alert-node");
const order = require("../models/newOrder");
const orders = require("../models/newOrders");


router.get("/summaryPayment", function(req, res){
	const order_id = req.query.orderId;
	const user_id = req.query.id;
	const full_name = req.query.fullName;
	
	try{
		orders.getOrder(order_id,function(result){
			if(result != false){
				res.render('summaryPayment',{order:result,id:user_id,fullName:full_name});
			}
			else{
				res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,400);
			}

		});
	}
	catch(e){
		console.log("Error!!"+e);
		res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,400);
	}
});


//registerstudent post request:
router.post("/summaryPayment", function(req, res, file){
	const CreditCardNumber = req.body.creditCard;
	const cvvNumber = req.body.cvvNumber;
	const expiry = req.body.expiry;
});
module.exports = router;
