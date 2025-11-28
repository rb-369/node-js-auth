
const express = require("express");

const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const uploadMiddleware = require("../middlewares/upload-middlewares");

const {uploadImageController, fetchImagesController, deletedImageController} = require("../controllers/image-controller");

const router = express.Router();

//uploading the image (only logged in admins can upload an image)

router.post(
    "/upload", 
    authMiddleware, 
    adminMiddleware, 
    uploadMiddleware.single("image"),
    uploadImageController
    

)

//to get all the image (every logged in user can see all the images)
router.get(
    "/get", 
    authMiddleware, 
    fetchImagesController
    

)

// to delete a image 
//6926ef43c38ae9a089f09647
router.delete("/delete/:id", authMiddleware, adminMiddleware, deletedImageController );

module.exports = router;