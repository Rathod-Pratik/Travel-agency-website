import UserModel from "../Model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateOTP, sendOTPEmail } from "../utils/email.js";

// LOGIN FUNCTION
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All credentials are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({NotFound:true,message:"User is not found"});
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({WrongPass:true,message:"Invalid credentials"});
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  const options = {
    httpOnly: true,
    secure: true, // should be true in production with HTTPS
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  // Set different cookie based on user role
  if (user.role === "admin") {
    res.cookie("admin_token", token, options);
  } else {
    res.cookie("user_token", token, options);
  }

  // Send response
  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
};

// REQUEST OTP FOR LOGIN
export const requestLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpType = "login";
    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, "login");
    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error requesting login OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// VERIFY LOGIN OTP AND CREATE SESSION
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(401).json({ success: false, message: "OTP has expired" });
    }

    // OTP verified, clear it and create token
    user.otp = null;
    user.otpExpiry = null;
    user.otpType = null;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    };

    // Set different cookie based on user role
    if (user.role === "admin") {
      res.cookie("admin_token", token, options);
    } else {
      res.cookie("user_token", token, options);
    }

    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// SIGNUP FUNCTION
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(400).send("All the credentials are required");
    }

    const ifUserExist = await UserModel.findOne({ email });
    if (ifUserExist) {
      return res.status(400).json({AlreadyExist:true,mesage:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    };
  
      res.cookie("user_token", token, options);
  
    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

// RESET PASSWORD FUNCTION (after verifying old password)
export const resetPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid old password" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// FORGOT PASSWORD - REQUEST OTP
export const requestForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpType = "forgotPassword";
    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, "forgotPassword");
    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error requesting forgot password OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// VERIFY FORGOT PASSWORD OTP AND RESET PASSWORD
export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(401).json({ success: false, message: "OTP has expired" });
    }

    // OTP verified, update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.otpType = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { email,phone,NewPassword,Oldpassword,address } = req.body;

    // Check if user exists
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send("User not found");
    }
    
    const isPasswordMatch = await bcrypt.compare(Oldpassword,userExist.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const password= bcrypt.hash(NewPassword,10);
    // Prepare update fields
    const updateFields = {};
    const hashPassword = await bcrypt.hash(NewPassword, 10);
    if (address) updateFields.address = address;
    if (email) updateFields.email = email;
    if (password) updateFields.password = hashPassword;
    if (phone) updateFields.phone = phone;

    // Update user details
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = (req, res) => {
  res.clearCookie("user_token", { httpOnly: true, secure: true, sameSite: "None" });
  res.clearCookie("admin_token", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
