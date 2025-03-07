import crypto from 'crypto';
import { razorpayInstance } from '../index.js';

export const createOrder=async(req,res)=>{
    const {amount,currency,receipt,notes}=req.body;

    if(!amount || !currency || !receipt || !notes){
        return res.status(400).json({error:"Missing required fields"})
    }

    razorpayInstance.orders.create({amount,currency,receipt,notes},
        (err,order)=>{
            if(!err){
                res.status(200).json(order)
            }
            else{
                res.status(500).send(err)
            }
        }
    )
}

export const verifyOrder=async(req,res)=>{
    const {order_id,payment_id}=req.body;

    const razorpay_signature=req.headers['x-razorpay-signature'];
    
    const key_secret=process.env.RAZERPAY_API_SECRET;
    
    let hmac=crypto.createHmac('sha256',key_secret);

    hmac.update(order_id + "|" +payment_id);

    const generated_signature =hmac.digest('hex');

    if(razorpay_signature===generated_signature){
        res.status(200).json({sucess:true,message:"Payment has been verified"});
    }
    else{
        res.status(500).json({sucess:false,message:"Payment varification failed"});
    }
}