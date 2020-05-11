const multer = require("multer");
const path = require("path");
//var csrf = require('csurf');

const storage = multer.diskStorage({
    destination: './public/uploadsImages/',
    filename: function(req, file, cb){
        cb(null,"unit" + "-" + Date.now() + 
        path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize:1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file,cb);
    },
    onFileUploadData: function (file, data, req, res) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived............................');
    },
    onFileUploadComplete: function (file, req, res) {
        console.log(file.fieldname + '........................... uploaded to  ' + file.path);
        done=true;
    }
});

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: imagee only!');
    }
}

module.exports = upload;