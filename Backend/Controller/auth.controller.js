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
