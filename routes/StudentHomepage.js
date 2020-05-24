
const experss = require("express");
const router = experss.Router();
const units = require("../models/RentalHousingUnits");
const MONTH_TO_DAY = 30;
const order = require("../models/newOrder");
const orders = require("../models/newOrders");
const authenticate = require("./authenticate").redirectHome;

router.get("/StudentHomepage",authenticate,function(req, res){
    const user_id = req.query.id;
    const full_name = req.query.fullName;
    if(user_id===req.session.userId){
        res.render('StudentHomepage',{id:user_id,fullName:full_name});
    }
    else{
        res.render("Error");
    }
});

router.post("/StudentHomepage",function(req,res){
    const start_date = req.body.startDate;
    const end_date = req.body.endDate;
    const city = req.body.city; //default empty
    const number_of_rooms = req.body.numberOfRooms; //default empty
    const from_price = parseInt(req.body.fromPrice);
    const to_price = parseInt(req.body.toPrice);
    const unit_types = req.body.unitTypes;
    const id = req.body.id;
    const full_name = req.body.fullName; 
    // Calculate the rental period for user selected dates
    var start = new Date(start_date), end = new Date(end_date);
    const utc_start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc_end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    var days = Math.floor((utc_end - utc_start) / (1000 * 60 * 60 * 24));
    const min_period = Math.floor(days / MONTH_TO_DAY); 
 
    var filter = ' ';
    // for filter
    if(city !='empty'){
        filter += "u.[city] = '"+city +"'";
        filter += ' and ';
    }
    if(number_of_rooms != 'empty'){
        filter += 'u.[numberOfrooms]='+number_of_rooms;
        filter += ' and ';
    }
    if(unit_types != 'empty'){
        filter += "u.[unitTypes]= '"+unit_types +"'";
        filter += ' and ';
    }
    if(!isNaN(from_price) &&  !isNaN(to_price)){
       filter += 'u.[pricePerMonth] BETWEEN ' +from_price +' and ' + to_price;
       filter += ' and ';
    }
    filter += ' ';
    
    console.log("The IP= "+req.ip +" connection to student home page.");

    if(typeof start_date !== 'undefined' && typeof end_date !== 'undefined'){
        try{
            units.getAvailableUnits(start_date,end_date,min_period,filter,function(result){ 
                units.getAttractions(function(attractions){
                    res.render('StudentHomepage',{startDate:start_date,endDate:end_date,fullName:full_name,
                        id:id,rows:result,city:city,numberOfRooms:number_of_rooms,
                        unitTypes:unit_types,fromPrice:from_price,toPrice:to_price,attractions:attractions
                    });
                });
            });
        }
        catch(e){
            console.log(e);
            res.redirect('/',404);
        }
    }
    else{
        res.redirect('/',404);
    }
});
// save temp order 
    // create order object
    // call orders.add to save 
    // and move to summaryPayment page with orderId
    
router.put("/StudentHomePage",function(req,res){
    const start_date = req.body.startDate;
    const end_date = req.body.endDate;
    const full_name = req.body.fullName;
    const student_id = req.body.id;
    const unit_id = req.body.unitID;
    const owner_id = req.body.ownerID;
    const price_per_month = req.body.pricePerMonth;
    var start = new Date(start_date), end = new Date(end_date);
    const utc_start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc_end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    var total_time = Math.floor((utc_end - utc_start) / (1000 * 60 * 60 * 24));
    const total_price = (price_per_month / MONTH_TO_DAY) * total_time;
    
    try{
        var newOrder = new order(null,total_price,owner_id,null,null,unit_id,null,null,full_name,student_id,start_date,
            end_date,total_time,0,null,null,null);
        orders.addOrder(newOrder,function(order_number){
            //success
            if(order_number != false)
            {
                const order_id = order_number;
                res.json({status:200,orderID:order_id,fullName:full_name,id:student_id});
            }
            else{
                console.log("Error! The userId "+ student_id +"unsuccess to order!");
                res.json({status:300}); // error!! 
            }
        });    
    }
    catch(e){
        console.log("Error!!" +e);
        res.json({status:300}); // error!!
    }
});

module.exports = router;