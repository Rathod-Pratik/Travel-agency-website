import express from 'express'
import { DeleteProfile, Login, Logout, SignUp, UpdateProfile } from './Auth.controller';
import { Validate } from '@middleware/Validation.middleware';
import { LoginValidation, SignupValidation } from './Auth.validation';
import upload from '@middleware/Multer.middleware';

const Route=express.Router();

Route.post("/auth/login",Validate(LoginValidation),Login);
Route.post("/auth/signup",Validate(SignupValidation),SignUp);
Route.post("/auth/logout",Logout);
Route.patch("/auth/me",upload.single('image'),UpdateProfile);
Route.delete('/auth/me',DeleteProfile);

export default Route