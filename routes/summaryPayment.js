const express = require ("express");
const router = express.Router();
const orders = require("../models/newOrders");
const unit = require("../models/RentalHousingUnits");
const authenticate = require("./authenticate").redirectHome;



router.get("/summaryPayment",authenticate, function(req, res){
	const order_id = req.query.orderId;
	const user_id = req.query.id;
	const full_name = req.query.fullName;
	if(user_id===req.session.userId){
		try{
			orders.getOrder(order_id,function(result){
				if(result != false){
					res.render('summaryPayment',{order:result,id:user_id,fullName:full_name});
					setTimeout(() => {
						unit.changeStatusForOrder(result.unitID,1,function(){
							if(result){
								orders.deleteOrder(result.orderID,function(){
									res.end();
								});
							}
					});}, 900000);
				}
				else{
					orders.getUnitIDfromOrderID(order_id,function(unitID){
						unit.changeStatusForOrder(unitID,1,function()
					{
						orders.deleteOrder(order_id,function(){
							res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
						});
						})
				
					}
	
			});
		}
		catch(e){
			console.log("Error!!"+e);
			orders.getUnitIDfromOrderID(order_id,function(unitID){
			unit.changeStatusForOrder(unitID,1,function()
					{
						orders.deleteOrder(orderID,function(){
							res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
						});
					});
					}
	}
	else{
        res.render("Error");
    }
	
});


//registerstudent post request:
router.post("/summaryPayment", function(req, res, file){
	const orderID = req.body.orderId;
	const user_id = req.body.id;
	const full_name = req.body.fullName;

	orders.getUnitIDfromOrderID(orderID ,function(unit_id){
		orders.sendOwnerMail(orderID,function(result){
		});
		orders.updateOrderStatus(orderID,function(chack){
			unit.changeStatusForOrder(unit_id,1,function(result) {
			});
			unit.updatePopularCount(unit_id,function(resul){
			});
			res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name);
		});
	});
});
module.exports = router;
