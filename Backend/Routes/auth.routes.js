import express  from 'express';
import { 
  login, 
  logout, 
  signup, 
  UpdateProfile,
  requestLoginOTP,
  verifyLoginOTP,
  resetPassword,
  requestForgotPasswordOTP,
  verifyForgotPasswordOTP
} from '../Controller/auth.controller.js';
import { verifyUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/login', login);
router.post('/login/request-otp', requestLoginOTP);
router.post('/login/verify-otp', verifyLoginOTP);
router.post('/signup', signup);
router.post('/forgot-password/request-otp', requestForgotPasswordOTP);
router.post('/forgot-password/verify-otp', verifyForgotPasswordOTP);

// Protected Routes (Authentication Required)
router.post('/reset-password', verifyUser, resetPassword);
router.post('/user/profile', verifyUser, UpdateProfile);
router.post('/logout', verifyUser, logout);

export default router