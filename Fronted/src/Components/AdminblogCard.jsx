import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const AdminblogCard = ({data}) => {
  return (
    <div>
      <div class="w-full bg-white border h-full border-gray-200 rounded-lg shadow-sm">
        <a href="#">
          <img
            class="rounded-t-lg"
            src={data.BlogImage}
            alt=""
          />
        </a>
        <div class="p-5">
          <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
             {data.Title}
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {data.BlogText.slice(0, 50)}...
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end px-4 py-2">
            <MdDelete  className=" text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition" />
            <FaEdit className=" text-[orange] cursor-pointer text-2xl hover:text-orange-400 transition"/>
        </div>
      </div>
    </div>
  );
};

export default AdminblogCard;
