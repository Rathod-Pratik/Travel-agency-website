import express from 'express'
import { DeleteProfile, GetProfile, Login, Logout, SignUp, UpdateProfile } from './Auth.controller';
import { Validate } from '@middleware/Validation.middleware';
import { DeleteProfileValidation, GetProfileValidation, LoginValidation, SignupValidation, UpdateProfileValidation } from './Auth.validation';
import upload from '@middleware/Multer.middleware';
import { verifyUser } from '@middleware/Auth.middleware';

const Route=express.Router();

Route.post("/auth/login",Validate(LoginValidation),Login);
Route.post("/auth/signup",Validate(SignupValidation),SignUp);
Route.post("/auth/logout",Logout);
Route.get("/auth/me",Validate(GetProfileValidation),verifyUser,GetProfile);
Route.patch("/auth/me",Validate(UpdateProfileValidation),verifyUser,upload.single('image'),UpdateProfile);
Route.delete('/auth/me',Validate(DeleteProfileValidation),verifyUser,DeleteProfile);

export default Route