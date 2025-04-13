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
        { typeof data=="undefined"? (
     [...Array(8)].map((_, index) => (
      <div key={index} className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100">
        {/* Image skeleton with enhanced shimmer */}
        <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer" style={{
            animationDuration: '2s',
            backgroundSize: '200% 100%'
          }} />
        </div>
    
        {/* Content skeleton with staggered animation */}
        <div className="p-4 space-y-4">
          {/* Location and date */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
    
          {/* Title placeholder */}
          <div className="space-y-2">
            <div className="h-5 w-5/6 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="h-5 w-4/6 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
    
          {/* Excerpt text */}
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="h-3 w-11/12 bg-gray-100 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
            <div className="h-3 w-10/12 bg-gray-100 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
          </div>
    
          {/* Read More button */}
          <div className="pt-2">
            <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse mx-auto" style={{ animationDelay: '0.9s' }} />
          </div>
        </div>
      </div>
    ))
        ):(
            data.map((data,index)=>{
                return (
                    <div key={index}>
                    <BlogCard data={data} />
                    </div>
                )
            }))
        }
        </div>
    </div>
  )
}

export default BlogSection;