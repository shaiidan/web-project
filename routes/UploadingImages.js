const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: './public/uploadsImages/',
    filename: function(_req, file, cb){
        cb(null,"unit" + "-" + Date.now() + 
        path.extname(file.originalname));
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

const upload = multer({
    storage: storage,
    limits:{fileSize:1000000},
    fileFilter: function(_req, file, cb){
        checkFileType(file,cb);
    },
    onFileUploadData: function (file, data, _req, _res) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived............................');
    },
    onFileUploadComplete: function (file, _req, _res) {
        console.log(file.fieldname + '........................... uploaded to  ' + file.path);
        done=true;
    }
});

module.exports = upload;