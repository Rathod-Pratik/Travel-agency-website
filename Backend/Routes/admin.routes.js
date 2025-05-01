import express from 'express';
import { Stats,DeleteUser, GetUser } from '../Controller/Admin.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const route=express.Router();

route.get('/stats',verifyAdmin,Stats);
route.delete('/reomveusers/:_id',verifyAdmin,DeleteUser);
route.get('/getuser',verifyAdmin,GetUser)

export default route;