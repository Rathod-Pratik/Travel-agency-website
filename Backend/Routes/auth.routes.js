import express  from 'express';
import { login, logout, signup, UpdateProfile } from '../Controller/auth.controller.js';
const router=express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/user/profile',UpdateProfile);
router.post('/logout',logout);


export default router