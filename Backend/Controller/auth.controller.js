import UserModel from "../Model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// LOGIN FUNCTION
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All credentials are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).send("User is not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).send("Invalid credentials");
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
    user,
  });
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
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
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

    // Set appropriate cookie
    if (user.role === "admin") {
      res.cookie("admin_token", token, options);
    } else {
      res.cookie("user_token", token, options);
    }

    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
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
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
