import UserModel from "../Model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
   return res.status(400).send("All the crediantails is required");
  }

  const user = UserModel.findOne({ email });

  if (!user) {
   return res.status(400).send("user is not found");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRAT, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;
    //Cookie section
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
    });
    res.status(201).json(user);
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(400).send("All the crediantails is required");
    }

    const ifUserExist = await UserModel.findOne({ email });

    if (ifUserExist) {
      return res.status(400).send("User is already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRAT, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;

    //Cookie section
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user exists
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send("User not found");
    }

    // Prepare update fields
    const updateFields = {};
    const hashPassword = await bcrypt.hash(password, 10);
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = hashPassword; 
    if (phone) updateFields.phone = phone;

    // Update user details
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};


