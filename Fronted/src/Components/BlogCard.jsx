import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { GoLocation } from 'react-icons/go'
import { Link } from 'react-router-dom';

const BlogCard = ({data}) => {
  const dateObj = new Date(data.date);

const day = dateObj.getDate(); // 17
const month = dateObj.getMonth() + 1; // 03 (Months are 0-based, so add 1)
const year = dateObj.getFullYear();  // 2025

const formattedDate = `${day}-${month}-${year}`;
  return (
     <div>
      <div className="relative ">
        {/* Image */}
        <img
          className="h-full w-full object-cover rounded-md"
          src={data.BlogImage}
          alt="Featured Tour"
        />
      </div>

      <div className="mt-2 p-2">
        <div className="flex flex-row justify-between">
          <p className=" text-[orange] flex items-center gap-1 ">
            <GoLocation /> {data.Title.substring(0, 25)}...
          </p>
          <p className="flex items-center text-gray-500">
          {formattedDate}
          </p>
        </div>
        <p className='text-sm hover:text-[orange] my-2 text-gray-500 font-medium'>{data.BlogText.substring(0, 50)}...</p>
        <div className="flex flex-row justify-between items-center text-gray-500">
          <Link to={`${'/blogdetails'}?_id=${data._id}`} className="text-sm cursor-pointer text-center font-semibold rounded-md bg-[orange] text-white py-1 px-1 hover:bg-orange-600 transition-colors">
            Read More
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
