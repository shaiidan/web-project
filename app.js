const bodyParser = require("body-parser");
const express = require("express");
const app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("index");
});











// app.listen(3000, function(){
// 	console.log("server listen on port 3000");
// });


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server has started");
});