const express = require ("express");
const router = express.Router();
const { Connection, Request } = require("tedious");
const alert = require("alert-node");
const order = require("../models/newOrder");
const orders = require("../models/newOrders");
const unit = require("../models/RentalHousingUnits");


router.get("/summaryPayment", function(req, res){
	const order_id = req.query.orderId;
	const user_id = req.query.id;
	const full_name = req.query.fullName;
	
	try{
		orders.getOrder(order_id,function(result){
			if(result != false){
				res.render('summaryPayment',{order:result,id:user_id,fullName:full_name});
				setTimeout(() => {unit.changeStatusForOrder(order.unitID,1,function(){
					if(order)
					orders.deleteOrder(order.orderID,function(){
					res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
				});
					
				}, 900000);
			}
			else{
				
				unit.changeStatusForOrder(order.unitID,1,function()
				{
					orders.deleteOrder(order.orderID,function(){
						res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
					});
				}

		});
	}
	catch(e){
		console.log("Error!!"+e);
		unit.changeStatusForOrder(order.unitID,1,function()
				{
					orders.deleteOrder(order.orderID,function(){
						res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
					});
				}
});


//registerstudent post request:
router.post("/summaryPayment", function(req, res, file){
	const CreditCardNumber = req.body.creditCard;
	const cvvNumber = req.body.cvvNumber;
	const expiry = req.body.expiry;
	const orderID = req.body.orderId;
	const user_id = req.query.id;
	const full_name = req.query.fullName;
	console.log(orderID);
	orders.sendOwnerMail(orderID,function(result){
	});
	orders.updateOrderStatus(orderID,function(chack){

		res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name);
	});

});
module.exports = router;
