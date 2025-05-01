import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { DELETE_CONTECT, GET_CONTECT } from "../../Utils/Constant";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminContect = () => {
  const navigate=useNavigate()
  const [contact, setContact] = useState();
      const [FilterContactData, SetFilterContactData] = useState([]);
  const FetchContect = async () => {
    try {
      const response = await apiClient.get(GET_CONTECT,{withCredentials:true});
      if (response.status === 200) {
        SetFilterContactData(response.data.Contect)
        setContact(response.data.Contect);
      } else {
        toast.error("Failed to fetch Contact");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      toast.error("Failed to fetch contact");
    }
  };
  useEffect(() => {
    FetchContect();
  }, []);

  const filterSearch = (searchValue) => {
    const lowerValue = searchValue.toLowerCase();
    if (lowerValue === "") {
      SetFilterContactData(contact);
    } else {
      const filtered = contact.filter((contactdata) =>
        contactdata.userData.name.toLowerCase().includes(lowerValue)
      );
      SetFilterContactData(filtered);
    }
  };

  const DeleteContect = async (_id) => {
    try {
      const response = await apiClient.delete(`${DELETE_CONTECT}/${_id}`,{withCredentials:true});
  
      if (response.status === 200) {
        toast.success("Contact deleted successfully");
  
        // Remove the deleted contact from local state
        SetFilterContactData((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== _id)
        );
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Access denied. Please login as admin.");
        return navigate("/login");
      }
      console.error("Error deleting contact:", error);
      toast.error("Some error occurred. Please try again later.");
    } finally {
      // Always hide the delete confirmation modal
      HideDeleteModel();
    }
  };
  
  const [show, setShow] = useState(false);
  const HideDeleteModel = () => [setShow(!show)];
  return (
    <div>
      <div className="flex justify-evenly gap-3 py-5">
          <input
          onChange={(e) => filterSearch(e.target.value)}
            className="border-[orange] border-2 outline-none rounded-md px-4 py-2 w-[90%]"
            type="text"
            placeholder="Search Contacts"
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
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Mobile</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
  {/* Loading skeleton */}
  {typeof FilterContactData === "undefined" ? (
    Array.from({ length: 5 }).map((_, index) => (
      <tr
        key={index}
        className="bg-white border-b border-gray-200 animate-pulse"
      >
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
        <td className="px-6 py-4"><div className="h-6 w-6 bg-gray-200 rounded-full"></div></td>
      </tr>
    ))
  ) : FilterContactData.length > 0 ? (
    // Data rows
    FilterContactData.map((Contect, index) => (
      <tr className="bg-white border-b border-gray-200" key={index}>
        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{index + 1}</th>
        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{Contect.userData.name}</th>
        <td className="px-6 py-4">{Contect.name}</td>
        <td className="px-6 py-4">{Contect.mobile_no}</td>
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{Contect.email}</td>
        <td className="px-6 py-4 font-medium text-gray-900 text-wrap">{Contect.message}</td>
        <td >
          <MdDelete
            onClick={HideDeleteModel}
            className="text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"
          />
        </td>

        {/* Delete confirmation modal */}
        {show && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-150">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Are you sure?</h2>
              <p className="text-gray-600 mt-2">Do you really want to delete this contact?</p>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
                  onClick={HideDeleteModel}
                >
                  Cancel
                </button>

                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-md transition hover:bg-orange-600"
                  onClick={() => DeleteContect(Contect._id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </tr>
    ))
  ) : (
    // No data found message
    <tr>
      <td colSpan="7" className="text-center text-gray-500 py-6">
        😕 No contacts found.
      </td>
    </tr>
  )}
</tbody>
        </table>
       
      </div>
    </div>
  );
};

export default AdminContect;
