import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
const app=express();

import authRoutes from "@modules/Auth/Auth.routes"
import tourRoutes from "@modules/Tour/Tour.routes"
import bookingRoutes from "@modules/Booking/Booking.routes"
import paymentRoutes from "@modules/Payment/Payment.routes"
import ContactRoutes from "@modules/Contact/Contact.routes"
import ReviewRoutes from "@modules/Review/Review.routes"
import BlogRoutes from "@modules/Blog/Blog.routes"
import HotelRoutes from "@modules/Hotel/Hotel.routes"


import cookieParser from 'cookie-parser';
import { ConnectToMongo } from '@utils/Connection';
import { connectRedis } from '@config/redis';

dotenv.config();

ConnectToMongo(process.env.Database as string).then(()=>{
    console.log("Connection successfully")
})
connectRedis();

app.use(cors({
    origin: process.env.origin,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true  
}))

app.use(express.json());
app.use(cookieParser());

app.get('/health',(req,res)=>{
    res.send("Running");
})

app.use('/auth',authRoutes);
app.use('/blog',BlogRoutes);
app.use('/booking',bookingRoutes);
app.use('/contact',ContactRoutes);
app.use('/payment',paymentRoutes);
app.use('/review',ReviewRoutes);
app.use('/hotel',HotelRoutes);
app.use('/tour',tourRoutes);

export default app