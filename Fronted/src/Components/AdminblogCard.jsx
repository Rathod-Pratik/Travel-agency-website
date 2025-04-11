import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiClient } from "../lib/api-Client";
import { DELETE_BLOG, UPDATE_BLOG } from "../Utils/Constant";

const AdminblogCard = ({ data ,setBlogData}) => {
  const [title, SetTitle] = useState(data.Title);
  const [description, setDescription] = useState(data.BlogText);
  const [selectedFile, setSelectedFile] = useState();
  const [EditModel, SetEditModel] = useState(false);
  const [preview, setPreview] = useState(null);
  const [newData,SetNewData]=useState();

  const EditModels = () => {
    SetEditModel(!EditModel);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0])); 
  };
  const extractPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; 
    return filename.split(".")[0]; 
  };

  const UpdateBlog = async () => {
    if (title.length < 10) {
      return toast.error("Please Enter Proper Title");
    }
    if (description.length < 20) {
      // fixed this, it was comparing `description` to number 20
      return toast.error("Description length must be more than 20 characters");
    }

    if (!selectedFile) {
      return toast.error("Please select an image");
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("BlogText", description);
    formData.append("BlogImage", selectedFile);
    formData.append("_id", data._id);

    try {
      const response = await apiClient.put(
        `${UPDATE_BLOG}/${extractPublicIdFromUrl(data.BlogImage)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 200) {
        console.log(response.data.blog);
        SetEditModel(!EditModel);
        SetNewData(response.data.blog);
        setPreview("");
        setDescription("");
        SetTitle("");
        setSelectedFile("");
        toast.success("Blog Updated successfully");
      } else {
        toast.error("Some error occurred, try again after some time");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const DeleteBlog = async () => {
    try {
      const response = await apiClient.post(
        `${DELETE_BLOG}/${extractPublicIdFromUrl(data.BlogImage)}`,{
          _id:data._id
        });
      
      if (response.status === 200) {
        setBlogData((prev) => prev.filter((item) => item._id !== data._id));
        toast.success("Blog Deleted successfully");
      } else {
        toast.error("Some error occurred, try again after some time");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div>
      <div class="w-full bg-white border h-full border-gray-200 rounded-lg shadow-sm">
        <p>
          <img class="rounded-t-lg" src={newData? newData.BlogImage :data.BlogImage} alt="" />
        </p>
        <div class="p-5">
          <p>
            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
              {newData? newData.Title.slice(0, 25) :data.Title.slice(0, 25)}...
            </h5>
          </p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {newData?newData.BlogText.slice(0, 50) :  data.BlogText.slice(0, 50)}...
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end px-4 py-2">
          <MdDelete onClick={DeleteBlog} className=" text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition" />
          <FaEdit
            onClick={EditModels}
            className=" text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
          />
        </div>
      </div>
      {EditModel && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 ">
                  Edit Blog
                </h3>
                <button
                  onClick={EditModels}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-toggle="crud-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-center w-full mt-3">
                  <div className="w-full h-64 rounded-lg overflow-hidden relative group">
                    <img
                      src={preview ? preview : data.BlogImage}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer text-white bg-[orange] px-4 py-2 rounded hover:bg-orange-700 transition">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 mt-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="Title"
                      id="name"
                      defaultValue={data.Title}
                      value={title}
                      onChange={(e) => SetTitle(e.target.value)}
                      className="bg-gray-50 outline-none focus:border-[orange] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Title"
                      required=""
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      defaultValue={data.BlogText}
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      id="description"
                      rows="4"
                      className="block p-2.5 outline-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  focus:border-[orange] "
                      placeholder="Write description here"
                    ></textarea>
                  </div>
                </div>
                <button
                  onClick={UpdateBlog}
                  className="outline-none px-4 rounded-sm py-2 cursor-pointer bg-[orange] text-white mr-7"
                >
                  Update Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminblogCard;
