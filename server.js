

require("dotenv").config();

const express = require("express");
const connectDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-route");
const adminRoutes = require("./routes/admin-routes");
const uploadimageRoutes = require("./routes/image-routes");

connectDB();

const app = express();

const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes); 
app.use("/api/admin", adminRoutes); 
app.use("/api/admin", uploadimageRoutes);

app.listen(port, ()=>{
    console.log(`Server is ruuning at port ${port}`);
    
});


