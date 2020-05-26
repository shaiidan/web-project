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
					unit.changeStatusForOrder(result.unitID,0,function(unit_status){
						if(unit_status != false)
						{
							res.render('summaryPayment',{order:result,id:user_id,fullName:full_name});
							setTimeout(() => {
								unit.changeStatusForOrder(result.unitID,1,function(change_status){
									if(change_status != false){
										orders.deleteOrder(result.orderID,function(delete_otder){
											res.end();
										});
									}
								});}, 900000);
						}
						else
						{
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
					else{
						orders.getUnitIDfromOrderID(order_id,function(unitID){
							orders.deleteOrder(order_id,function(){
								res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name,404);});
							});
						}
					});
		}
		catch(e){
			console.log("Error!!"+e);
			orders.getUnitIDfromOrderID(order_id,function(unitID){
				unit.changeStatusForOrder(unitID,1,function()
				{
					orders.deleteOrder(order_id,function(){
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
router.post("/summaryPayment", function(req, res){
	const orderID = req.body.orderId;
	const user_id = req.body.id;
	const full_name = req.body.fullName;

	
	orders.getUnitIDfromOrderID(orderID ,function(unit_id){
		// send mail to apartment owner
		orders.sendOwnerMail(orderID,function(result){
		});
		// get attractions for send them to the student
		unit.getAttractionsByUnitId(unit_id, function(attr){
			orders.getOrder(orderID, function(result1){
				// send mail to student with order details and attractions of the unit 
				orders.sendStudentMail(orderID, user_id, result1.unitCity, result1.unitAdress, result1.startOrderDate, result1.endOrderDate, result1.totalPrice, attr, function(result){
				});
			});
		});
		// update status 
		orders.updateOrderStatus(orderID,function(chack){
			unit.changeStatusForOrder(unit_id,1,function(status) {
				unit.updatePopularCount(unit_id,function(resul){
					res.redirect('/studentHomePage?id='+user_id+"&fullName="+full_name);
				});
			});
		});
	});
}); 

module.exports = router;
