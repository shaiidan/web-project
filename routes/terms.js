const express = require ("express");
const router = express.Router();



router.get("/terms", function(req, res){
	res.render("terms");
});
module.exports = router;