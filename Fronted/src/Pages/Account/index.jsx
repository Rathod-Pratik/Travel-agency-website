import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../Store";
import { UPDATE_PROFILE } from "../../Utils/Constant";

const Account = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const [address, setAddress] = useState("");
  const [phone, SetPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const UpdateData = async () => {
    if(validataion()){
    if (newPassword !== confirmPassword) {
      return toast.error("New Password and Confirm Password Should be same");
    }
    try {
      const response= await apiClient.post(
        UPDATE_PROFILE,
        {
          email: userInfo.email,
          user: userInfo._id,
          address:address,
          phone:phone,
          Oldpassword: oldPassword,
          NewPassword: newPassword,
        },
        { withCredentials: true }
      );
      if (response.status == 200) {
        setUserInfo(response.data.user);
        toast.success("Profile Updated");
      } else {
        toast.error("Failed to update Profile");
      }
    } catch (error) {
      console.log(error);
    }
  }
  };

  const validataion=()=>{
    if(!address || userInfo.address){
      return false;
    }
    if(!oldPassword || !newPassword || !confirmPassword){
      return false;
    }
    return true;
  }
  let [firstName, lastName] = userInfo.name.split(" ");
  return (
    <div className="min-h-[100vh] w-full md:w-[90%] lg:w-[80%] mt-10 mx-auto flex flex-col gap-8 p-4">
  <p data-aos="fade-left" className="flex justify-center lg:justify-end gap-2 text-[orange] text-lg">
    <span className="text-black">Welcome</span> {userInfo.name}
  </p>

  <section className="flex flex-col-reverse lg:flex-row gap-8 min-h-[80vh]">
    {/* Sidebar Links */}
    <div data-aos="fade-right" className="flex flex-col space-y-6 w-full md:w-[40%] lg:w-[25%]">
      <div>
        <h2 className="font-medium text-lg mb-2">Manage My Account</h2>
        <div className="flex flex-col space-y-2 text-gray-500">
          <Link to="/account" className="hover:text-gray-700">My Profile</Link>
          <Link to="/account" className="hover:text-gray-700">Address Book</Link>
          <Link to="/account" className="hover:text-gray-700">My Payment Options</Link>
        </div>
      </div>

      <div>
        <h2 className="font-medium text-lg mb-2">My Tours</h2>
        <div className="flex flex-col space-y-2 text-gray-500">
          <Link to="/returns" className="hover:text-gray-700">My Traveled</Link>
          <Link to="/cancellations" className="hover:text-gray-700">My Cancellations</Link>
        </div>
      </div>

      <Link to="/wishlist" className="font-medium text-lg hover:text-gray-700">My Wishlist</Link>
    </div>

    {/* Profile Update Form */}
    <div data-aos="fade-left" className="flex flex-col w-full">
      <h2 className="text-[orange] text-xl font-semibold mb-4">Edit Your Profile</h2>

      <div className="flex flex-col gap-6">
        {/* Name Inputs */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <p className="text-black">First Name</p>
            <input
              value={firstName}
              disabled
              className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
              type="text"
            />
          </div>
          <div className="w-full">
            <p className="text-black">Last Name</p>
            <input
              value={lastName}
              disabled
              className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
              type="text"
            />
          </div>
        </div>

        {/* Email & Address */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <p className="text-black">Email</p>
            <input
              disabled
              value={userInfo.email}
              className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
              type="text"
            />
          </div>

          <div className="w-full">
            <p className="text-black">Email</p>
            <input
              onChange={(e)=>SetPhone(e.target.value)}
              value={phone}
              className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
              type="text"
            />
          </div>

          <div className="w-full">
            <p className="text-black">Address</p>
            {userInfo.address ? (
              <input
                disabled
                value={userInfo.address}
                className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
                type="text"
              />
            ) : (
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
                type="text"
              />
            )}
          </div>
        </div>

        {/* Password Inputs */}
        <div className="flex flex-col gap-6">
          <p className="text-black">Password Changes</p>
          <input
            value={oldPassword}
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
            className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
            type="password"
          />
          <input
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
            type="password"
          />
          <input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-[#F5F5F5] p-3 border-none w-full outline-none text-gray-500"
            type="password"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center lg:justify-end">
          <button
            className="bg-[orange] text-white p-3 w-full md:w-[200px] rounded-md"
            onClick={UpdateData}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default Account;