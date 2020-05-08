const experss = require("express");
const router = experss.Router();
const RentalHousingUnit = require("../models/RentalHousingUnit");
const units = require("../models/RentalHousingUnits");


router.get("/uploadUnit",function(req, res){
    const id = req.query.id; 
    const full_name = req.query.fullName;
    return res.render('uploadUnit',{owner_id:id,fullName:full_name});
});


router.post("/uploadUnit",function(req, res,next){
    const city = req.body.city;
    const owner_id = req.body.ownerId;
    const full_name = req.body.fullName;
    const address = req.body.address;
    const price_per_month = req.body.pricePerMonth
    const number_of_rooms = req.body.numberOfRooms;
    const unit_types = req.body.unitTypes;
    const min_rental_period = req.body.minRentalPeriod;
    const max_rental_period = req.body.maxRentalPeriod;
    const description_unit = req.body.descriptionUnit;
    pictuers = null;
    const unit = new RentalHousingUnit(null,owner_id,city,address,number_of_rooms,price_per_month,
        unit_types,null,null,null,max_rental_period,min_rental_period,description_unit,null,null);
    units.addUnit(unit,function(result){
        if(result == true){
            // add success
            console.log('new unit add by owner id = '+owner_id);
            res.redirect("/ApartmentOwnerHomepage?id="+owner_id +'&fullName='+full_name);
        }
        else{
            // error!!! -> נכנס גם לפה
            console.log("herrrr");
            res.redirect("/ApartmentOwnerHomepage?id="+owner_id +'&fullName='+full_name);
        }

    });
});


module.exports = router;