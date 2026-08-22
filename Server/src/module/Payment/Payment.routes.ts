import express from 'express';
import { createOrder, GetPaymentHistory, Refund, verifyOrder } from './Payment.controller';
import { verifyAdmin, verifyUser } from '@middleware/Auth.middleware';
import { Validate } from '@middleware/Validation.middleware';
import { PaymentSchema, RefundSchema, VerifyPaymentSchema } from './Payment.validation';

const Route=express.Router();

Route.post('/create-order',Validate(PaymentSchema),verifyUser,createOrder);
Route.post('/verify-order',Validate(VerifyPaymentSchema),verifyUser,verifyOrder);
Route.post('/refund',Validate(RefundSchema),verifyUser,Refund);
Route.get('/payment-history',verifyAdmin,GetPaymentHistory);
    
export default Route;