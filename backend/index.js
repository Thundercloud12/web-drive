import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import app from './app.js'
import { seedAdmin } from "./controllers/functionality.controller.js";
dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        seedAdmin();
    })
    
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


