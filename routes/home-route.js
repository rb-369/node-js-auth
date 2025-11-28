
const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware")
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res)=>{
    const {userName, userId, role} = req.userInfo;
    res.json({
        message : "Welcome to home page",
        user : {
            _id : userId,
            userName,
            role
        }
    })
});

module.exports = router;