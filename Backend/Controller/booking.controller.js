import BookingModel from "../model/Booking.model.js";
import TourModel from "../Model/tour.model.js";

export const CreateBooking = async (req, res) => {
  try {
    const {
      BookedBy,
      price,
      userId,
      userName,
      userEmail,
      userPhone,
      tourData,
      tourDate,
      numberOfPeople,
      paymentId,
    } = req.body;

    // Validate required fields
    if (
      !BookedBy ||
      !paymentId ||
      !userId ||
      !tourData ||
      !tourDate ||
      !numberOfPeople ||
      !userName ||
      !userEmail ||
      !userPhone ||
      !price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Calculate total price
    const totalPrice = price * numberOfPeople;

    // Create a new booking
    const newBooking = await BookingModel.create({
      BookedBy,
      paymentId,
      userId,
      userName,
      userEmail,
      userPhone,
      tourData,
      tourDate,
      tourPrice: price,
      numberOfPeople,
      totalPrice,
    });

    res
      .status(200)
      .json({ success: true, message: "Booking successful", data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const ViewBooking = async (req, res) => {
  try {
    const { tourId, userId } = req.body;
    if (!userId || !tourId) {
      return res.status(400).send("id is required");
    }

    const tourData = await TourModel.find({ _id: tourId });
    const bookingData = await BookingModel.find({ userId, tourId });
    if (tourData) {
      return res.status(200).json({ tourData, bookingData });
    } else {
      return res.send("This tour is not found");
    }
  } catch (error) {
    console.log(error);
  }
};

export const GetAllBooking = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).send("user id is required");
    }

    const getBooking = await BookingModel.find({ userId });
    const filteredBookings = getBooking.filter((booking) => booking.bookingStatus !== "Cancelled");

    return res.status(201).json({ getBooking:filteredBookings });
  } catch (error) {
    console.log(error);
  }
};

export const GetAllCancelBooking = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).send("user id is required");
    }

    const getBooking = await BookingModel.find({ userId });
    const filteredBookings = getBooking.filter((booking) => booking.bookingStatus !== "success");

    return res.status(201).json({ getBooking:filteredBookings });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateBooking = async (req, res) => {
  const { _id, userName, userPhone, tourDate } = req.body;

  try {
    const findBooking = await BookingModel.findOne({ _id });

    if (!findBooking) {
      return res.status(400).send("Your booking is not found");
    }

    // Proceed to update the booking with the new details
    const updatedBooking = await BookingModel.findOneAndUpdate(
      { _id }, 
      {
        userPhone,
        tourDate,
        userName,
      },
      { new: true } 
    );

    return res.status(200).json({ updatedBooking });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while updating the booking");
  }
};

export const CancelBooking = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).send("Id is required");
    }

    const cancelBookings = await BookingModel.findByIdAndUpdate(_id, {
      bookingStatus: "Cancelled",
    });

    if (cancelBookings) {
      res.status(201).json({ message: "Your booking is cancel" });
    } else {
      res.status(400).json({ message: "Fail to cancel booking" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const GetAllBookingToAdmin=async(req,res)=>{
  
  try {
    const getBooking = await BookingModel.find();

    return res.status(201).json({ getBooking });
  } catch (error) {
    console.log(error);
  }
}

export const DeleteBookingData=async(req,res)=>{
  const {_id}=req.params;

  if(!_id){
    return res.status(400).send("_id is required");
  }
  try {

    const DeleteData=await BookingModel.findOneAndDelete({_id})

    if(DeleteData){
      return res.status(200).send("Tour Deleted successfully")
    }
    else{
      return res.status(400).send("Failed to delete Tour")
    }
    
  } catch (error) {
    console.log(error)
    return res.status(400).send("Some error occured try again after some time")
  }
}