import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
const app=express();

import authRoutes from "@modules/Auth/Auth.routes"

import cookieParser from 'cookie-parser';
import { ConnectToMongo } from '@utils/Connection';

dotenv.config();

ConnectToMongo(process.env.Database as string).then(()=>{
    console.log("Connection successfully")
})

app.use(cors({
    origin: process.env.origin,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true  
}))

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Running");
})

app.use('/auth',authRoutes);
app

export default app