
const mongoose = require("mongoose");
require("dotenv").config();



const connectDB = async () => {
    try{
        
        await mongoose.connect(process.env.MONGO_URI);
        //console.log(process.env.MONGO_URI);
        
        console.log("MongoDb connected succesfully");
        
    }catch(e){
        console.error("Database connection failed",e);
        process.exit(1);
        
    }
}

module.exports = connectDB;