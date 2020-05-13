
const experss = require("express");
const router = experss.Router();
const Orders = require("../src/Orders");
const authenticate = require("./authenticate").redirectHome;

router.get("/rentalHistory",authenticate, function(req,res){
    const user_id = req.query.id;
    const full_name = req.query.fullName;

   if(user_id===req.session.userId){
        Orders.getOrders(user_id, function(result){ 
            res.render("rentalHistory", {fullName:full_name,id:user_id,rows:result});
         });
     }
     else{
         res.render("Error");
    }
});

router.post("/rentalHistory", function(req,res){
    const user_id = req.body.id;
    const full_name = req.body.fullName;

    const startDate = "'"+req.body.startDate+"'";
    const endDate = "'"+req.body.endDate+"'";
    const location = "'"+req.body.Location+"'"; //default empty
    const numberOfRooms = parseFloat(req.body.numberOfRooms); //default empty
    const fromPrice = req.body.totalPrice;
    const unitTypes = "'"+req.body.Unittype+"'";
    const orderNumber = req.body.orderNumber;
    Orders.getFilteredTable(user_id, startDate, endDate, location, numberOfRooms, fromPrice, unitTypes, orderNumber ,function(result){ //במקום 12 צריך להיות פונקציה שלוקחת את הת.ז של בעל הדירה שמחובר!
        res.render('rentalHistory',{fullName:full_name,id:user_id,rows:result});
    });

});
module.exports = router;
