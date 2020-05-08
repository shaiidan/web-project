const experss = require("express");
const router = experss.Router();
const RentalHousingUnit = require("../models/RentalHousingUnit");
const units = require("../models/RentalHousingUnits");

router.get("/updateUnit",function(req, res,next){
    const unit_id = req.query.unitId;
    const full_name= req.query.fullName;
    const user_id = req.query.id;
    units.getRentalHousingUnitByUnitId(unit_id,function(result){
        if(result instanceof RentalHousingUnit){
             res.render('updateUnit',{fullName:full_name,unit:result});
        }
    });
});

router.post("/updateUnit",function(req,res){
    const unit_id = req.body.unitId;
    const owner_id = req.body.ownerId;
    const full_name = req.body.fullName;
    const city = req.body.city;
    const address = req.body.address;
    const number_of_rooms = req.body.numberOfRooms;
    const unit_types = req.body.unitTypes;
    const price_per_month = req.body.pricePerMonth;
    const min_rental = req.body.minRentalPeriod;
    const max_rental = req.body.maxRentalPeriod;
    const description_unit = req.body.descriptionUnit;
    const unit = new RentalHousingUnit(unit_id,owner_id,city,address,number_of_rooms,price_per_month,unit_types,
        null,null,null,max_rental,min_rental,description_unit,null,null);
    
    units.updateUnit(unit,function(result){
        //console.log(result);
        if(result != false){ // the update is success
            res.redirect("/ApartmentOwnerHomepage?id="+owner_id +"&fullName="+full_name);
        }
    });
});


module.exports = router;