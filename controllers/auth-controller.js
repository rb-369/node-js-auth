const User = require("../models/User");

const bcrypt = require("bcryptjs"); // to hash user password

const jwt = require("jsonwebtoken") // to create tokens

//register controller
const registerUser = async(req, res) =>{
    try{

        //extract user info from request body

        const {userName, email, password, role} = req.body;

        //check if the user already exists in db
        
        const existingUser = await User.findOne({$or : [{userName}, {email}]});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists either with same username or email id. Please try with a different username or email"
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        
        const hashedPassword = await bcrypt.hash(password ,salt);

        //create a new user and save in db

        const newUser =  new User({
            userName,
            email,
            password : hashedPassword,
            role: role || "user"
        });

        await newUser.save();

        if(newUser){
            res.status(201).json({
                success: true,
                message: "User registerd successfully",
                data: newUser
            })
        }else{
            res.status(400).json({
                success: false,
                message: "Some error occured. Unable to register user. Try again",
                data: newUser
            })
        }



    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : "Some error occured!"
        })
    }
}

//login controller

const loginUser = async (req, res) => {
     try{

        //extract user info from request body

        const {userName, password} = req.body;

        //find if the current user exists in db

        const curUser = await User.findOne({userName: userName});//

        if(!curUser){
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            })
        }

        //if the password is correct or not

        const passwordMatch = await bcrypt.compare(password, curUser.password);

        if(!passwordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        //create user token

        const accessToken = jwt.sign({
            userId: curUser._id,
            userName : curUser.userName,
            role : curUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "30m"
        })

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken
        })


    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : "Some error occured!"
        })
    }
}

//change password functionality

const changePassword = async (req, res) => {
    try{

        const userId = req.userInfo.userId;

        //extract old and new password
        const {oldPassword, newPassword} = req.body;

        //find the current logged in user
        const curUser = await User.findById(userId);

        if(!curUser){
            return res.status(400).json({
                success: false,
                message: "User not found! :("
            })
        }

        // check if old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, curUser.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "The old password is not correct! Pls enter correct password!"
            })
        }

        //hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        //update the user password
        curUser.password = newHashedPassword
        await curUser.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })


    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message : "Some error occured!"
        });
    }
}


module.exports = {registerUser, loginUser, changePassword};