import axios from "axios";
import UserModel from "../Model/user.model.js";
import BookingModel from "../Model/Booking.model.js";

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
      .filter((payment) => payment.status === "captured")
      .reduce((sum, payment) => sum + payment.amount / 100, 0);

    const users = await UserModel.find();
    const booking = await BookingModel.find();

    res.status(200).json({
      totalRevenue,
      totalUsers: users.length - 1,
      totalBookings: booking.length,
      users,
      booking,
      payments // ✅ Send payment history here
    });
    
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return res.status(502).json({ error: "Failed to fetch data from Razorpay" });
  }
};


export const GetUser=async(req,res)=>{
  try {
    const users = await UserModel.find({role:"user"});
    if(users){
      return res.status(200).json({users});
    }
    else{
      return res.status(400).send("Fail to fetch users");
    }
  } catch (error) {
    return res.status(400).send("Some error occured try again after some time");
  }
}
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