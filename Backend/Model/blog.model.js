import mongoose from "mongoose";

const blogSchema=new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    date:{
        type: Date, // Specify the type as Date
        default: Date.now,
    },
    BlogImage:{
        required:true,
        type:String
    },
    BlogText:{
        required:true,
        type:String
    },
})

const BlogModel=mongoose.model('blog',blogSchema);

export default BlogModel;