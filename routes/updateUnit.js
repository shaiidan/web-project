const experss = require("express");
const router = experss.Router();
const RentalHousingUnit = require("../models/RentalHousingUnit");
const units = require("../models/RentalHousingUnits");
const upload = require("./UploadingImages");
const authenticate = require("./authenticate").redirectHome;

router.get("/updateUnit",authenticate,function(req, res,next){
    const full_name= req.query.fullName;
    const user_id = req.query.id;
    const unit_id = req.query.unitId;
    if(user_id===req.session.userId){
        try{
            units.getRentalHousingUnitByUnitId(unit_id,function(result){
                if(result instanceof RentalHousingUnit){
                     res.render('updateUnit',{fullName:full_name,id:user_id,unit:result});
                }
                else{
                    console.log("Update don't get unit is!!\n");
                    res.redirect('/',404);
                }
            });
        }
        catch(e){
            console.log("Error!!\n" +e);
            res.redirect('/',404);
        }
    }
    else{
        res.render("Error");
    }
});

router.post("/updateUnit",upload.array("uploadImage",4),function(req,res){
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
    var pictures = req.body.pictures;
    const unit = new RentalHousingUnit(unit_id,owner_id,city,address,number_of_rooms,price_per_month,unit_types,
        null,null,null,max_rental,min_rental,description_unit,null,null);

        if(typeof full_name === 'undefined' || typeof owner_id === 'undefined')
        {
            console.log("Error");
            res.redirect('/',404);
        }
        else
        {
            if(typeof req.files !== 'undefined' && req.files.length != 0){
                pictures = "";
                req.files.forEach(f =>{
                    pictures += f.filename + ",";
                });
            }
            try{
                const unit = new RentalHousingUnit(unit_id,owner_id,city,address,number_of_rooms,price_per_month,
                    unit_types,null,null,null,max_rental,min_rental,description_unit,null,null);
                unit.setPictures(pictures);
                
                units.updateUnit(unit,function(result){
                    if(result == true){
                        // add success
                        console.log('Update unit ='+ unit_id +  ', add by owner id = '+owner_id);
                        res.redirect("/ApartmentOwnerHomepage?id="+owner_id +'&fullName='+full_name);
                    }
                    else{
                        res.render('updateUnit',{msg:"Sorry something wrong\nPlease try again", id:owner_id,fullName:full_name,unit:unit});
                    }
                });
    
            }
            catch(e){
                console.log("Error" + e);
                res.redirect('/',404);
            }
        }
   
});

module.exports = router;