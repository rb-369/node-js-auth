
const Image = require("../models/Image");

const {uploadToCloudinary} = require("../helpers/cloudinaryHelper");

const fs = require("fs");

const cloudinary = require("../config/cloudinary");// to delete images from local storage here

const uploadImageController = async (req, res) => {
    try{

        //check if file is missing in req obj

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "File is required. Pls upload an img"
            })
        }

        //upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        //store the img url and public id along with the uploaded user id in db
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
        })

        await newlyUploadedImage.save();

        //to delete the file from local storage
       // fs.unlinkSync(req.file.path);

        res.status(201).json({
            success : true,
            message : "Image uploaded successfully",
            image : newlyUploadedImage
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! :("
        })
    }
}

const fetchImagesController = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 2;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1:-1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj ={};
        sortObj[sortBy] = sortOrder;
        

        
        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages : totalPages,
                totalImages: totalImages,
                data: images
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! :("
        })
    }
}

// to delete the img
const deletedImageController = async (req,res) => {
    try{

        const getCurImageId = req.params.id;
        const userId = req.userInfo.userId;

        const curImage = await Image.findById(getCurImageId);

        if(!curImage){
            return res.status(404).json({
                success: false,
                message: "Image not found! :("
            })
        }

        //check if the img is uploaded by cur user (one who is trying to delete)
        //i.e only the one to upload that particular img can delete that img

        if(curImage.uploadedBy.toString() !== userId ){
            return res.status(403).json({
                success: false,
                message: "You can not delete this image! You did not uploaded it"
            })
        }

        //delete this img from cloudinary storage
        await cloudinary.uploader.destroy(curImage.publicId);

        //now delete from db

        await Image.findByIdAndDelete(getCurImageId);

        res.status(201).json({
            success: true,
            message: "You deleted the image successfully!"
        })


    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! :("
        })
    }
}

module.exports = {
    uploadImageController, 
    fetchImagesController,
    deletedImageController
}