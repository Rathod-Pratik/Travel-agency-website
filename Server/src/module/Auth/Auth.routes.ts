import express from 'express'
import { DeleteProfile, GetProfile, Login, Logout, SignUp, UpdateProfile, ForgotPassword, ResetPassword } from './Auth.controller';
import { Validate } from '@middleware/Validation.middleware';
import { DeleteProfileValidation, GetProfileValidation, LoginValidation, SignupValidation, UpdateProfileValidation } from './Auth.validation';
import upload from '@middleware/Multer.middleware';
import { verifyUser } from '@middleware/Auth.middleware';

const Route = express.Router();

Route.post("/login", Validate(LoginValidation), Login);
Route.post("/signup", Validate(SignupValidation), SignUp);
Route.post("/forgot-password", Validate(LoginValidation), ForgotPassword);
Route.post("/reset-password", Validate(LoginValidation), ResetPassword);
Route.post("/logout", Logout);
Route.get("/me", Validate(GetProfileValidation), verifyUser, GetProfile);
Route.patch("/me", Validate(UpdateProfileValidation), verifyUser, upload.single('image'), UpdateProfile);
Route.delete('/me', Validate(DeleteProfileValidation), verifyUser, DeleteProfile);

export default Route