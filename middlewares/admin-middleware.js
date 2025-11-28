
const isUserAdmin = (req, res, next)=>{
    if(req.userInfo.role !== "admin"){
        res.status(403).json({
            success: false,
            message : "Only admins allowed!"
        })
    }
    next();
}

module.exports = isUserAdmin