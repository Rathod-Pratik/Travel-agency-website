import BookingModel from "../model/Booking.model.js";
import TourModel from "../Model/tour.model.js";

export const CreateBooking = async (req, res) => {
  try {
    const {
      price,
      userId,
      userName,
      userEmail,
      userPhone,
      tourId,
      tourDate,
      numberOfPeople,
      paymentMethod,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !tourId ||
      !tourDate ||
      !numberOfPeople ||
      !paymentMethod ||
      !specialRequests ||
      !userName ||
      !userEmail ||
      !userPhone ||
      !price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the tour exists
    const tour = await TourModel.findOne({_id:tourId});
    // res.json(tour);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    const alreadybooking = await BookingModel.exists({ tourId, userId });

    if (alreadybooking) {
      return res.status(409).json({ success: false, message: "You have already booked this tour" });
    }
    


    // Calculate total price
    const totalPrice = tour.price * numberOfPeople;

    // Create a new booking
    const newBooking = await BookingModel.create({
      userId,
      userName,
      userEmail,
      userPhone,
      tourId,
      tourDate,
      tourPrice: tour.price,
      numberOfPeople,
      totalPrice,
      paymentMethod,
      specialRequests,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking successful", data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const ViewBooking = async (req, res) => {
  try {
    const { tourId,userId } = req.body;
    if (!userId || !tourId) {
      return res.status(400).send("id is required");
    }

    const tourData = await TourModel.find({_id:tourId});
    const bookingData=await BookingModel.find({userId,tourId});
    if (tourData) {
      return res.status(200).json({tourData,bookingData});
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

    const getBooking = await BookingModel.find({userId});

    return res.status(201).json({ getBooking });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateBooking = async (req, res) => {
  const {
    userId,
    userEmail,
    userPhone,
    tourDate,
    numberOfPeople,
    paymentMethod,
    specialRequests,
  } = req.body;

  try {
    // Check if the booking exists for the given userId
    const findBooking = await BookingModel.findOne({userId});
    
    if (!findBooking) {
      return res.status(400).send("Your booking is not found");
    }

    // Proceed to update the booking with the new details
    const updatedBooking = await BookingModel.findOneAndUpdate(
      { userId }, // Use findOneAndUpdate to find by userId
      {
        userEmail,
        userPhone,
        tourDate,
        numberOfPeople,
        paymentMethod,
        specialRequests,
      },
      { new: true } // Option to return the updated document
    );

    return res.status(200).json({ updatedBooking });

  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred while updating the booking");
  }
};


export const CancelBooking=async(req,res)=>{
  try {
    const {_id}=req.params;

    if(!_id){
      return res.status(400).send("Id is required");
    }
  
    const cancelBookings = await BookingModel.findByIdAndUpdate(_id, { bookingStatus: "Cancelled" });
  
    if(cancelBookings){
    res.status(201).json({message:"Your booking is cancel"});
    }
    else{
      res.status(400).json({message:"Fail to cancel booking"});
    }
  } catch (error) {
   console.log(error); 
  }
}