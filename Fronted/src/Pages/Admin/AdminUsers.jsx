import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { GET_USER, REMOVE_USER } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const AdminUsers = () => {
  const [userData, SetUserData] = useState();
  const FetchUser = async () => {
    try {
      const response = await apiClient.get(GET_USER);
      if (response.status === 200) {
        SetUserData(response.data.users);
      } else {
        toast.error("Failed to fetch user");
      }
    } catch (error) {
      toast.error("Some error occured try again after some time");
    }
  };
  useEffect(() => {
    FetchUser();
  }, []);

  const ConvertTime = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const DeleteUser = async (_id) => {
    try {
      const response = await apiClient.delete(`${REMOVE_USER}/${_id}`);

      if (response.status===201) {
        toast.success("Contact Deleted successfully");
  
        // Update the state optimistically
        SetUserData((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== _id)
        );
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      // Handle errors, log them for debugging
      console.error("Error deleting contact:", error);
      toast.error("Some error occurred. Please try again later.");
    }
  };
  return (
    <div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
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
          {userData?.map((data, index) => (
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
                <MdDelete onClick={()=>DeleteUser(data._id)} className="text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
