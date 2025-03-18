import React from 'react'
import BlogCard from './BlogCard';

const BlogSection = ({data}) => {
  return (
    <div>
       <p
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/tour-images/tour.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="text-white h-50 flex justify-center items-center text-4xl font-semibold"
      >
        All Blogs
      </p>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 w-[90vw] m-auto gap-6 p-4 sm:self-center">
        {
            data.map((data,index)=>{
                return (
                    <div key={index}>
                    <BlogCard data={data} />
                    </div>
                )
            })
        }
        </div>
    </div>
  )
}

export default BlogSection;