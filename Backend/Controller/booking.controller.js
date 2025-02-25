import BookingModel from "../models/booking.model.js";
import TourModel from "../models/tour.model.js";

export const CreateBooking = async (req, res) => {
  try {
    const {
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
      !userPhone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the tour exists
    const tour = await TourModel.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
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
      tourTitle: tour.title,
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
    const { _id } = req.params;
    if (_id) {
      return res.status(400).send("id is required");
    }

    const tourData = await TourModel.find();
    if (tourData) {
      return res.status(200).json(tourData);
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

    const getBooking = await BookingModel.find(userId);

    return res.status(201).json({ getBooking });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateBooking = async (req, res) => {
  try {
    const {
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
      !userPhone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const updatedBooking = await TourModel.findByIdAndUpdate(
      userId,
      {
      userName,
      userEmail,
      userPhone,
      tourId,
      tourDate,
      numberOfPeople,
      paymentMethod,
      specialRequests,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({updatedBooking});

  } catch (error) {
    console.log(error);
  }
};

export const CancelBooking=async(req,res)=>{
  try {
    const {_id}=req.params;

    if(!_id){
      return res.status(400).send("Id is required");
    }
  
    const cancelBookings=await findByIdAndUpdate(_id,{
      bookingStatus:"Cancelled",
    })
  
    res.status(201).json({message:"Your booking is cancel"});
  } catch (error) {
   console.log(error); 
  }
}