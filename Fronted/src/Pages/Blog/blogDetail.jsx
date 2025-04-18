import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-Client";
import { GET_BLOG } from "../../Utils/Constant";
import { useLocation } from "react-router-dom";
import BlogCard from "../../Components/BlogCard";

const BlogDetail = () => {
  const [BlogData, setBlogData] = useState([]);
  const [BlogDetail, setBlogDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");

  useEffect(() => {
    const FetchBlog = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(GET_BLOG);
        if (response.status === 200) {
          setBlogData(response.data.blog);
          const matchedBlog = response.data.blog.find((blog) => blog._id === _id);
          setBlogDetail(matchedBlog);
        } else {
          console.log("Some error occurred");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    FetchBlog();
  }, [_id]);

  const filterDate = (date) => {
    if (!date) return "";
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div className="w-[50%] mx-auto gap-8 my-4">
        {/* Main Content Area */}
        <div className="lg:col-span-8 border border-gray-200 rounded-lg p-6">
          {loading ? (
            // Skeleton for main blog content
            <div className="space-y-6">
              {/* Image Skeleton */}
              <div className="h-80 w-full bg-gray-200 rounded-md animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              </div>
              
              {/* Title Skeleton */}
              <div className="h-8 w-3/4 bg-gray-200 rounded-full animate-pulse" />
              
              {/* Date Skeleton */}
              <div className="h-5 w-40 bg-gray-200 rounded-full animate-pulse" />
              
              {/* Content Skeleton */}
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
                ))}
                <div className="h-4 w-2/3 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ) : BlogDetail ? (
            // Actual content when loaded
            <>
              <img
                src={BlogDetail.BlogImage}
                alt={BlogDetail.Title}
                className="w-full h-80 object-cover rounded-md"
              />
              <h1 className="text-3xl font-bold mt-6">{BlogDetail.Title}</h1>
              <p className="text-gray-500 mt-2">
                Published on: {filterDate(BlogDetail.date)}
              </p>
              <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                {BlogDetail.BlogText}
              </p>
            </>
          ) : (
            <p>Blog not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;