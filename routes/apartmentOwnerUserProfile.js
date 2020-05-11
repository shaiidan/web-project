/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const experss = require("express");
const router = experss.Router();
const User = require("../models/userInfo");


router.get("/apartmentOwnerUserProfile", function(req,res){
    const user_id = req.query.id;
    const full_name = req.query.fullName;

    console.log(user_id);
    User.getapartmentOwnerUserrInfo(user_id, function(result){ //במקום 12 צריך להיות פונקציה שלוקחת את הת.ז של בעל הדירה שמחובר!
       res.render("apartmentOwnerUserProfile",{fullName:full_name,id:user_id,rows:result});
   });
});
router.post("/apartmentOwnerUserProfile", function(req,res){
    const user_id = req.body.id;
    const FullName =req.body.FullName;
    const PhoneNumber =req.body.PhoneNumber;
    User.updateapartmentOwnerUserInfo(user_id, FullName, PhoneNumber, function(result){ //במקום 12 צריך להיות פונקציה שלוקחת את הת.ז של בעל הדירה שמחובר!
       res.redirect("/ApartmentOwnerHomepage?id="+user_id+'&fullName='+FullName);
   });
});

module.exports = router;
