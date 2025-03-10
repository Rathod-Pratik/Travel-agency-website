import express from 'express';
import { Stats,DeleteUser } from '../Controller/Admin.controller.js';

const route=express.Router();

route.get('/stats',Stats);
route.delete('/users/:_id',DeleteUser);

export default route;