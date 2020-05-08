
const experss = require("express");
const router = experss.Router();
const units = require("../models/RentalHousingUnits");

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
    var start = new Date(start_date), end = new Date(end_date);
    const min_period = (end.getFullYear() - start.getFullYear()) *12 + (end.getMonth() - start.getMonth()) ;
    const id = req.body.userId;
    const full_name = req.body.fullName; 
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
                res.render('StudentHomepage',{startDate:start_date,endDate:end_date,fullName:full_name,userId:id,rows:result});
            });
        }
        catch(e){
            console.log(e);
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