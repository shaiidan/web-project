
const experss = require("express");
const router = experss.Router();
const units = require("../models/RentalHousingUnits");
const MAX_MONTH_TO_DAY = 31;


router.get("/StudentHomepage",function(req, res){
    const user_id = req.query.id;
    const full_name = req.query.fullName;
    res.render('StudentHomepage',{userId:user_id,fullName:full_name});
});

router.post("/StudentHomepage",function(req,res){
    const start_date = req.body.startDate;
    const end_date = req.body.endDate;
    const city = req.body.city; //default empty
    const number_of_rooms = req.body.numberOfRooms; //default empty
    const from_price = parseInt(req.body.fromPrice);
    const to_price = parseInt(req.body.toPrice);
    const unit_types = req.body.unitTypes;
    const id = req.body.userId;
    const full_name = req.body.fullName; 

    // Calculate the rental period for user selected dates
    var start = new Date(start_date), end = new Date(end_date);
    const utc_start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc_end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    days = Math.floor((utc_end - utc_start) / (1000 * 60 * 60 * 24));
    const min_period = Math.floor(days / MAX_MONTH_TO_DAY); 
 
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
    console.log(min_period + "  f= "+ filter);
    console.log("The IP= "+req.ip +" connection to student home page.");

    if(typeof start_date !== 'undefined' && typeof end_date !== 'undefined'){
        try{
            units.getAvailableUnits(start_date,end_date,min_period,filter,function(result){ 
                res.render('StudentHomepage',{startDate:start_date,endDate:end_date,fullName:full_name,
                    userId:id,rows:result,city:city,numberOfRooms:number_of_rooms,
                    unitTypes:unit_types,fromPrice:from_price,toPrice:to_price
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

router.put("/StudentHomePage",function(req,res){
    // save temp order 
    // create order object
    // call orders.add to save 
    // and move to summaryPayment page with orderId
    
    res.end();
});

module.exports = router;