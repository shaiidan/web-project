const experss = require("express");
const router = experss.Router();
const RentalHousingUnit = require("../models/RentalHousingUnit");
const units = require("../models/RentalHousingUnits");
const upload = require("./UploadingImages");
const Attraction = require("../models/Attraction");
const authenticate = require("./authenticate").redirectHome;

router.get("/uploadUnit",authenticate,function(req, res){
    const id = req.query.id; 
    const full_name = req.query.fullName;
    if(id===req.session.userId){
        res.render('uploadUnit',{id:id,fullName:full_name});
    }
    else{
        res.render("Error");
    }
});

router.post("/uploadUnit",upload.fields([
    {name: 'uploadImage', maxCount: 4},
    {name: 'uploadImage_attraction1', maxCount: 4},
    {name: 'uploadImage_attraction2', maxCount: 4},
    {name: 'uploadImage_attraction3', maxCount: 4},
    {name: 'uploadImage_attraction4', maxCount: 4},
    {name: 'uploadImage_attraction5', maxCount: 4}]), function(req, res){
        const owner_id = req.body.ownerId;
        const full_name = req.body.fullName;
        if(typeof full_name === 'undefined' || typeof owner_id === 'undefined')
        {
            console.log("Error");
            res.redirect(404,'/');
        }
        else
        {
            const city = req.body.city;
            const address = req.body.address;
            const price_per_month = req.body.pricePerMonth
            const number_of_rooms = req.body.numberOfRooms;
            const unit_types = req.body.unitTypes;
            const min_rental_period = req.body.minRentalPeriod;
            const max_rental_period = req.body.maxRentalPeriod;
            const description_unit = req.body.descriptionUnit;
            var pictuers = "";
            
            // for unit images
            if(typeof req.files.uploadImage !== 'undefined')
            {
                req.files.uploadImage.forEach(f =>{
                    pictuers += f.filename + ",";
                });
            }

            // for attractions
            const attractions_number = parseInt(req.body.attractionsNumber);
            //1
            const name_attraction1 = req.body.name_attraction1;
            const distance_attraction1 = req.body.distance1;
            const discount_attraction1 = req.body.discount1;
            const description_attraction1 = req.body.description_attraction1;
            var pictures_attractuon1 = "";
            console.log(distance_attraction1);
            if(typeof req.files.uploadImage_attraction1 !== 'undefined')
            {
                req.files.uploadImage_attraction1.forEach(f =>{
                    pictures_attractuon1 += f.filename + ",";
                });
            } 
            var attraction1 = new Attraction(name_attraction1,null,discount_attraction1,distance_attraction1,
                description_attraction1,pictures_attractuon1);
            //2
            const name_attraction2 = req.body.name_attraction2;
            const distance_attraction2 = req.body.distance2;
            const discount_attraction2 = req.body.discount2;
            const description_attraction2 = req.body.description_attraction2;
            var pictures_attractuon2 = "";
            if(typeof req.files.uploadImage_attraction2 !== 'undefined')
            {
                req.files.uploadImage_attraction2.forEach(f =>{
                    pictures_attractuon2 += f.filename + ",";
                });
            }
            var attraction2 = new Attraction(name_attraction2,null,discount_attraction2,distance_attraction2,
                description_attraction2,pictures_attractuon2);
            //3
            const name_attraction3 = req.body.name_attraction3;
            const distance_attraction3 = req.body.distance3;
            const discount_attraction3 = req.body.discount3;
            const description_attraction3 = req.body.description_attraction3;
            var pictures_attractuon3 = "";
            if(typeof req.files.uploadImage_attraction3 !== 'undefined')
            {
                req.files.uploadImage_attraction3.forEach(f =>{
                    pictures_attractuon3 += f.filename + ",";
                });
            }
            var attraction3 = new Attraction(name_attraction3,null,discount_attraction3,distance_attraction3,
                description_attraction3,pictures_attractuon3);
            //4
            const name_attraction4 = req.body.name_attraction4;
            const distance_attraction4 = req.body.distance4;
            const discount_attraction4 = req.body.discount4;
            const description_attraction4 = req.body.description_attraction4;
            var pictures_attractuon4 = "";
            if(typeof req.files.uploadImage_attraction4 !== 'undefined')
            {
                req.files.uploadImage_attraction4.forEach(f =>{
                    pictures_attractuon4 += f.filename + ",";
                });
            }
            var attraction4 = new Attraction(name_attraction4,null,discount_attraction4,distance_attraction4,
                description_attraction4,pictures_attractuon4);
            //5
            const name_attraction5 = req.body.name_attraction5;
            const distance_attraction5 = req.body.distance5;
            const discount_attraction5 = req.body.discount5;
            const description_attraction5 = req.body.description_attraction5;
            var pictures_attractuon5 = "";
            if(typeof req.files.uploadImage_attraction5 !== 'undefined')
            {
                req.files.uploadImage_attraction5.forEach(f =>{
                    pictures_attractuon5 += f.filename + ",";
                });
            }
            var attraction5 = new Attraction(name_attraction5,null,discount_attraction5,distance_attraction5,
                description_attraction5,pictures_attractuon5);
            
            var attractions = [];

            switch(attractions_number)
            {
                case 1:{
                    attractions.push(attraction1);
                    break;
                }
                case 2:{
                    attractions.push(attraction1);
                    attractions.push(attraction2);
                    break;
                }
                case 3:{
                    attractions.push(attraction1);
                    attractions.push(attraction2);
                    attractions.push(attraction3);
                    break;
                }
                case 4:{
                    attractions.push(attraction1);
                    attractions.push(attraction2);
                    attractions.push(attraction3);
                    attractions.push(attraction4);
                    break;
                }
                case 5:{
                    attractions.push(attraction1);
                    attractions.push(attraction2);
                    attractions.push(attraction3);
                    attractions.push(attraction4);
                    attractions.push(attraction5);
                    break;
                }
            }
            const unit = new RentalHousingUnit(null,owner_id,city,address,number_of_rooms,price_per_month,
                unit_types,null,null,null,max_rental_period,min_rental_period,description_unit,null,null);
            unit.setPictures(pictuers);

            try{    
                units.addUnit(unit,attractions,function(result){
                    if(result == true){
                    // add success
                    console.log('new unit add by owner id = '+owner_id);
                    res.redirect("/ApartmentOwnerHomepage?id="+owner_id +'&fullName='+full_name);
                }
                else{
                    res.render('uploadUnit',{msg:"Sorry something wrong\nPlease try again", id:owner_id,fullName:full_name});
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