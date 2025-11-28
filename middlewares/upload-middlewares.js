
const multer = require("multer"); // to store image locally

const path = require("path");

//set our multer storage

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename: function(req, file, cb){
        cb(null, 
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

//file filter function (to only get images and not different file types like videos, txt, etc)
const  checkFileFilter = (req, file, cb)=>{

    if(file.mimetype.startsWith("image")){
        cb(null, true);
    }else{
        cb(new Error("Not an image! Please uplaod only images"))
    }
}

//multer middleware
module.exports = multer({
    storage: storage, //stores images uploaded to website in uploads folder
    fileFilter: checkFileFilter, // to check if the file type is image or not
    limits: {
        fileSize: 5 *1024 *1024 // 5MB max img size
    }
})



