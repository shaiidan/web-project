const experss = require("express");
const router = experss.Router();

router.get("/uploadUnit",function(req, res){
    res.render('uploadUnit');
});


router.post("/uploadUnit",function(req, res){

    res.render('ApartmentOwnerHomepage');
});


module.exports = router;