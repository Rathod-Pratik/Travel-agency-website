import TourModel from "../Model/tour.model.js";

export const getTours = async (req, res) => {
  try {
    const tours = await TourModel.find();
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to fetch tours.",
    });
  }
};

export const getToursData = async (req, res) => {
  const { _id } = req.params;
  try {
    const tours = await TourModel.findById( _id );
    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to fetch tours.",
    });
  }
};

export const MakeTour = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      duration,
      price,
      availableDates,
      maxCapacity,
      included,
      notIncluded,
      itinerary,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !duration ||
      !price ||
      !availableDates ||
      !maxCapacity ||
      !included ||
      !notIncluded ||
      !itinerary
      //  ||
      //  !req.file
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Cloudinary image URL
     const imageUrl = req.file.path;

    // Create new tour
    const tour = await TourModel.create({
      title,
      description,
      location,
      duration,
      price,
      availableDates,
      maxCapacity,
      included,
      notIncluded,
      itinerary,
    images: [imageUrl],
    });

    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: tour,
    });
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const UpdateTour = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      title,
      description,
      location,
      duration,
      price,
      availableDates,
      maxCapacity,
      included,
      notIncluded,
      itinerary,
    } = req.body;

    // Check if tour exists
    const existingTour = await TourModel.findById(_id);
    if (!existingTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Handle optional image update
     let imageUrl = existingTour.images;
     if (req.file) {
       imageUrl = [req.file.path];
     }

    // Update tour details
    const updatedTour = await TourModel.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        location,
        duration,
        price,
        availableDates,
        maxCapacity,
        included,
        notIncluded,
        itinerary,
         images: imageUrl,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const DeleteTour = async (req, res) => {
  try {
    const { _id } = req.params; // Get tour ID from URL

    // Check if the tour exists
    const existingTour = await TourModel.findById(_id);
    if (!existingTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Delete the tour
    await TourModel.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
