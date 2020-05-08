const experss = require("express");
const router = experss.Router();
const units = require("../models/RentalHousingUnits");
const unit = require("../models/RentalHousingUnit");

router.get("/ApartmentOwnerHomepage",function(req, res){
    if(typeof req.query.id == 'undefined' && typeof req.query.fullName == 'undefined' )
    {
        console.log("Something wrong happend with request="+req.ip);
        res.redirect('/');
    }
    const id = req.query.id;
    const full_name = req.query.fullName;
    units.getRentalHousingUnitsByOwnerId(id, function(result){
        if(result != false ){
             res.render('ApartmentOwnerHomepage',{owner_full_name:full_name,owner_id:id,rows:result});
        }
        else {!
            console.log("Something wrong happend with request="+req.ip);
            res.redirect('/');
        }
    });
});


// delete the unit, change the unit status to unavailable 
router.delete("/ApartmentOwnerHomepage",function(req,res){
    
    const unit_id = req.query.unitID;
    units.deleteUnit(unit_id, function(result){
        if(result == false){
            res.status(300).json({
                message: "No deleted!"
            })
        }
        else{
            res.status(200).json({
                message: "Deleted!"
            })
        }
    });
});



module.exports = router;