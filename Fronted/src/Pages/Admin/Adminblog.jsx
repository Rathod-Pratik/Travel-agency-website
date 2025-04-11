import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { CREATE_BLOG, DELETE_BLOG, GET_BLOG, UPDATE_BLOG } from "../../Utils/Constant";
import AdminblogCard from "../../Components/AdminblogCard";
import { toast } from "react-toastify";

const Adminblog = () => {
  const [blogData, SetBlogData] = useState([]);
  const [model, SetModel] = useState(false);
  const [title, SetTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState();

  const UploadBlog = async () => {
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
    formData.append("BlogImage", selectedFile); // append the file here

    try {
      const response = await apiClient.post(CREATE_BLOG, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        SetModel(!model);
        SetBlogData((prev) => [...prev, response.data.blog]);
        setPreview("");
        setDescription("");
        SetTitle("");
        setSelectedFile("");
        toast.success("Blog Uploaded successfully");
      } else {
        toast.error("Some error occurred, try again after some time");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const FetchBlog = async () => {
      try {
        const response = await apiClient.get(GET_BLOG);
        if (response.status === 200) {
          SetBlogData(response.data.blog);
        } else {
          console.log("Some error occured");
        }
      } catch (error) {
        console.log(error);
      }
    };
    FetchBlog();
  }, []);

  const OpenModel = () => {
    SetModel(!model);
    // setPreview("");
    // setDescription("");
    // SetTitle("");
    // setSelectedFile("");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Save the actual file object
    setPreview(URL.createObjectURL(e.target.files[0])); // Just for showing preview if needed
  };


  return (
    <div>
      <div className="flex justify-end">
        <button
          className="outline-none px-4 rounded-sm py-2 cursor-pointer bg-[orange] text-white mr-7"
          onClick={OpenModel}
        >
          New
        </button>
      </div>
      <div className=" m-auto gap-6 p-4 flex flex-wrap w-full pl-7">
        {blogData.map((data, index) => {
          return (
            <div key={index} className="w-[350px] h-[400px]">
              <AdminblogCard setBlogData={SetBlogData} data={data} />
            </div>
          );
        })}
      </div>

      {model && (
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
                  Write a Blog
                </h3>
                <button
                  onClick={OpenModel}
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
                  {preview ? (
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt="Uploaded Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 
                5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 
                4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                  )}
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
                  onClick={UploadBlog}
                  className="outline-none px-4 rounded-sm py-2 cursor-pointer bg-[orange] text-white mr-7"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminblog;
