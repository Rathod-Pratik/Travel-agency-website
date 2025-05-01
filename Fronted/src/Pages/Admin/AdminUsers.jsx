import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { GET_USER, REMOVE_USER } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate=useNavigate();
  const [userData, SetUserData] = useState();
    const [FilterUserData, SetFilterUserData] = useState([]);
  const FetchUser = async () => {
    try {
      const response = await apiClient.get(GET_USER,{withCredentials:true});
      if (response.status === 200) {
        SetFilterUserData(response.data.users)
        SetUserData(response.data.users);
      } else {
        toast.error("Failed to fetch user");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      toast.error("Some error occured try again after some time");
    }
  };
  useEffect(() => {
    FetchUser();
  }, []);
  const filterSearch = (searchValue) => {
    const lowerValue = searchValue.toLowerCase();
    if (lowerValue === "") {
      SetFilterUserData(userData);
    } else {
      const filtered = userData.filter((userData) =>
        userData.name.toLowerCase().includes(lowerValue)
      );
      SetFilterUserData(filtered);
    }
  };

  const ConvertTime = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const DeleteUser = async (_id) => {
    try {
      const response = await apiClient.delete(`${REMOVE_USER}/${_id}`,{withCredentials:true});

      if (response.status===201) {
        toast.success("Contact Deleted successfully");
  
        // Update the state optimistically
        SetFilterUserData((prevUsers) =>
          prevUsers.filter((user) => user._id !== _id)
        );
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      
      // Handle errors, log them for debugging
      console.error("Error deleting contact:", error);
      toast.error("Some error occurred. Please try again later.");
    }
  };
  return (
    <div>
      <div className="flex justify-evenly gap-3 py-5">
          <input
          onChange={(e) => filterSearch(e.target.value)}
            className="border-[orange] border-2 outline-none rounded-md px-4 py-2 w-[90%]"
            type="text"
            placeholder="Search Users"
          />
          <button
            className="text-white bg-[orange] px-5 cursor-pointer py-2 rounded-md"
          >
           Search
          </button>
        </div>
        <div className="relative overflow-x-auto">
      <table className="min-w-[1000px] w-full text-sm text-left rtl:text-right text-gray-500">
  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
    <tr>
      <th className="px-6 py-3">Sr no</th>
      <th className="px-6 py-3">User name</th>
      <th className="px-6 py-3">Mobile</th>
      <th className="px-6 py-3">Email</th>
      <th className="px-6 py-3">Address</th>
      <th className="px-6 py-3">Created At</th>
      <th className="px-6 py-3"></th>
    </tr>
  </thead>
  <tbody>
    {typeof userData === "undefined" ? (
      // Skeleton rows while loading
      Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="bg-white border-b border-gray-200 animate-pulse">
          {Array.from({ length: 7 }).map((__, i) => (
            <td key={i} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))
    ) : FilterUserData.length > 0 ? (
      // Actual Data rows
      FilterUserData.map((data, index) => (
        <tr className="bg-white border-b border-gray-200" key={index}>
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {index + 1}
          </td>
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {data.name}
          </td>
          <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
            {data.phone}
          </td>
          <td className="px-6 py-4 text-gray-900 break-words">
            {data.email}
          </td>
          <td className="px-6 py-4 text-gray-900 break-words">
            {data.address}
          </td>
          <td className="px-6 py-4 text-gray-900 break-words">
            {ConvertTime(data.createdAt)}
          </td>
          <td>
            <MdDelete
              onClick={() => DeleteUser(data._id)}
              className="text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
            />
          </td>
        </tr>
      ))
    ) : (
      // No data found
      <tr>
        <td colSpan="7" className="text-center py-6 text-gray-500">
          No users found.
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>

    </div>
  );
};

export default AdminUsers;
