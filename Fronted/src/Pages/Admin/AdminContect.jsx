import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { DELETE_CONTECT, GET_CONTECT } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const AdminContect = () => {
  const [contact, setContact] = useState([]);
  const FetchContect = async () => {
    try {
      const response = await apiClient.get(GET_CONTECT);
      if (response.status === 200) {
        setContact(response.data.Contect);
      } else {
        toast.error("Failed to fetch Contact");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    FetchContect();
  }, []);

  const DeleteContect = async (_id) => {
    try {
      const response = await apiClient.delete(`${DELETE_CONTECT}/${_id}`);
  
      // Check if the response status is OK (successful)
      if (response.status===200) {
        toast.success("Contact Deleted successfully");
  
        // Update the state optimistically
        setContact((prevContacts) =>
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
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" class="px-6 py-3">
                Sr no
              </th>
              <th scope="col" class="px-6 py-3">
                User name
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Mobile
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>
              <th scope="col" class="px-6 py-3">
                Message
              </th>
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {contact?.map((Contect, index) => (
              <tr class="bg-white border-b border-gray-200" key={index}>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {index+1}
                </th>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {Contect.userData.name}
                </th>
                <td class="px-6 py-4">{Contect.name}</td>
                <td class="px-6 py-4">{Contect.mobile_no}</td>
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {Contect.email}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900 text-wrap ">
                  {Contect.message}
                </td>

                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  <MdDelete onClick={()=>DeleteContect(Contect._id)} className="absolute bottom-2 right-2 text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContect;
