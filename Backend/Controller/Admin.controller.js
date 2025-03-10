import axios from "axios";
import UserModel from "../Model/user.model.js";
import BookingModel from "../model/Booking.model.js";

export const Stats = async (req, res) => {
  try {
    // Fetch payment data from Razorpay
    const response = await axios.get("https://api.razorpay.com/v1/payments", {
      auth: {
        username: process.env.RAZERPAY_API_KEY,
        password: process.env.RAZERPAY_API_SECRET,
      },
    });

    // Extract successful payments and calculate revenue
    const payments = response.data.items;
    const totalRevenue = payments
      .filter((payment) => payment.status === "captured") // Filter successful payments
      .reduce((sum, payment) => sum + payment.amount / 100, 0); // Sum and convert from paise to rupees

    const users = await UserModel.find();
    const booking = await BookingModel.find();

    res.json({
      totalRevenue,
      totalUsers: users.length -1 ,
      totalBookings: booking.length,
      users,
      booking,
    });
  } catch (error) {
    console.error("Razorpay API Error:", error.response.data);
    return res
      .status(502)
      .json({ error: "Failed to fetch data from Razorpay" });
  }
};

export const DeleteUser = async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(400).send("User id is required");
  }

  try {
    const user = await UserModel.findByIdAndDelete({ _id });

    if (user) {
      return res.status(201).send("User deleted successful");
    }
    else{
      return res.status(400).send("User not found");
    }

    
  } catch (error) {
    console.log(error);
    return res.status(400).send("Failed to deleted user some error occured");
  }
};