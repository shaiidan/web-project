
const experss = require("express");
const router = experss.Router();
const Orders = require("../src/Orders");

// router.get("/apartment", function(req, res){
//     res.render("apartment");
// });

router.get("/rentalHistory", function(req,res){
     Orders.getOrders(12, function(result){ //במקום 12 צריך להיות פונקציה שלוקחת את הת.ז של בעל הדירה שמחובר!
        res.render("rentalHistory" ,{rows:result});
    });
});

// router.get("/apartment", function(req,res){
//     Orders.getOrders(12, function(result){ //במקום 12 צריך להיות פונקציה שלוקחת את הת.ז של בעל הדירה שמחובר!
//        res.render("apartment" ,{rows:result});
//    });
// });


router.post("/rentalHistory", function(req,res){
    console.log("in post");

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const location = req.body.location; //default empty
    const numberOfRooms = req.body.numberOfRooms; //default empty
    const fromPrice = req.body.fromPrice;
    const unitTypes = req.body.unitTypes;
    const orderNumber = req.body.orderNumber;
 
    Orders.getFilteredTable( 12,startDate, endDate, location, numberOfRooms, fromPrice, unitTypes, orderNumber ,function(result){ 
        res.render('rentalHistory',{rows:result});
    });

});
module.exports = router;
