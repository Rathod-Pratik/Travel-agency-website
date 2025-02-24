import express from 'express';
import { mongoose } from 'mongoose';
import dotenv from 'dotenv'
const app=express();
import authRoutes from "./Routes/auth.routes.js"
import tourRoutes from './Routes/tours.routes.js'
import cookieParser from 'cookie-parser';

//Access all environment variable
dotenv.config();

//Function for connect to mongodb database
function ConnectToMongo(url){
    return mongoose.connect(url);
}

//Call function and use callback function
ConnectToMongo(process.env.Database).then(()=>{
    console.log("Connection successfully")
})

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.use('/auth',authRoutes);
app.use('tour',tourRoutes);

app.listen(5000,()=>console.log(`Server is running at ${5000}`));