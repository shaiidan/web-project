const experss = require("express");
const router = experss.Router();

router.get("/ApartmentOwnerHomepage",function(req, res){
    res.render('ApartmentOwnerHomepage');
});


module.exports = router;