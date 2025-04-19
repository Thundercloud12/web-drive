import connectDB from "./db/connectDB.js";
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        
    })
    
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


