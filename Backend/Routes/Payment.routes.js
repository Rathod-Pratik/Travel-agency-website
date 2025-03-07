import express from 'express';
import { verifyOrder,createOrder } from '../Controller/payment.controller.js';

const route=express.Router();

route.post('/create-order',createOrder);
route.post('/verify-order',verifyOrder);

export default route;