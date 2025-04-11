import express from 'express';
import { Stats,DeleteUser, GetUser } from '../Controller/Admin.controller.js';

const route=express.Router();

route.get('/stats',Stats);
route.delete('/reomveusers/:_id',DeleteUser);
route.get('/getuser',GetUser)

export default route;