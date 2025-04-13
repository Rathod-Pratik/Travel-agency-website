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
    const tours = await TourModel.findById(_id);
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
      tax,
      title,
      description,
      location,
      duration,
      price,
      maxCapacity,
      included,
      notIncluded,
      itinerary,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !duration ||
      !price ||
      !maxCapacity ||
      !included ||
      !notIncluded ||
      !itinerary ||
      !tax
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Cloudinary image URL
    const imageUrl = req.imageUrl;

    // Create new tour
    const tour = await TourModel.create({
      title,
      description,
      location,
      duration,
      price,
      maxCapacity,
      included :JSON.parse(included),
      notIncluded:JSON.parse(notIncluded),
      itinerary: JSON.parse(itinerary),
      tax,
      images: imageUrl,
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
    const { _id } = req.body;

    // Check if tour exists
    const existingTour = await TourModel.findById(_id);
    if (!existingTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Build updateFields object dynamically
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
      tax,
    } = req.body;

    const updateFields = {};

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (location) updateFields.location = location;
    if (duration) updateFields.duration = duration;
    if (price) updateFields.price = price;
    if (availableDates) updateFields.availableDates = availableDates;
    if (maxCapacity) updateFields.maxCapacity = maxCapacity;
    if (included) updateFields.included = JSON.parse(included);
    if (notIncluded) updateFields.notIncluded = JSON.parse(notIncluded);
    if (itinerary) updateFields.itinerary = JSON.parse(itinerary);
    if (tax) updateFields.tax = tax;

    // If new image is uploaded
    if (req.newImageUrl) updateFields.images = req.newImageUrl;

    // Update tour details
    const updatedTour = await TourModel.findByIdAndUpdate(
      _id,
      updateFields,
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
    const { _id } = req.body; // Get tour ID from URL

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
