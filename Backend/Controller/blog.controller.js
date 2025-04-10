import BlogModel from "../Model/blog.model.js"; // Adjust the import path as needed

// 
export const CreateBlog = async (req, res) => {
  try {
    const { Title, BlogText } = req.body;
    const imageUrl = req.imageUrl;
    // Create a new blog instance
    const newBlog = new BlogModel({
      Title,
      BlogImage:imageUrl,
      BlogText,
    });

    // Save to database
    await newBlog.save();

    res.status(200).json({ success: true, message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating blog", error: error.message });
  }
};

// ✅ Update an Existing Blog
export const UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
  }
};

// ✅ Delete a Blog
export const DeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
  }
};

// ✅ Get a Blog by ID
export const GetBlog = async (req, res) => {
  try {
    const blog = await BlogModel.find();

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blog", error: error.message });
  }
};