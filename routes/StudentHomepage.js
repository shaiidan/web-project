
const experss = require("express");
const router = experss.Router();
const units = require("../src/RentalHousingUnits");

router.get("/StudentHomepage",function(req, res,id){
    console.log(id);
    res.render('StudentHomepage');
});

router.post("/StudentHomepage",function(req,res){

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const city = req.body.city; //default empty
    const numberOfRooms = req.body.numberOfRooms; //default empty
    const fromPrice = req.body.fromPrice;
    const toPrice = req.body.toPrice;
    const unitTypes = req.body.unitTypes;
    var start = new Date(startDate), end = new Date(endDate);
    const minPeriod = (end.getFullYear() - start.getFullYear()) *12 + (end.getMonth() - start.getMonth()) ;
 
    console.log(req.ip +" go to DB..");
    units.getAvailableUnits(startDate,endDate,minPeriod,function(result){ 
        res.render('StudentHomepage',{statrDate:startDate,endDate:endDate,rows:result});
    });

});

module.exports = router;