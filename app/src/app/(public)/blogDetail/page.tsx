"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { apiClient } from "@apiClient";
import { GET_BLOG } from "@utils";

export type Blog = {
  _id: string;
  Title: string[];
  Description: string[];
  BlogImage: string;
  date: string;
};

const BlogDetail = () => {
  const searchParams = useSearchParams();

  const _id = searchParams.get("_id");
  const [blogDetail, setBlogDetail] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(GET_BLOG);

        if (response.status === 200) {
          const blogs: Blog[] = response.data.blog;

          setBlogDetail(blogs.find((blog) => blog._id === _id) || null);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchBlog();
    }
  }, [_id]);

  const filterDate = (date: string) => {
    if (!date) return "";

    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-full">
      <div className="w-[90%] md:w-[70%] lg:w-[60%] mx-auto my-8">

        <div className="border border-gray-200 rounded-lg p-6">

          {/* Loading */}

          {loading ? (
            <div className="space-y-6">

              <div className="h-80 w-full bg-gray-200 rounded-md animate-pulse" />

              <div className="h-8 w-3/4 bg-gray-200 rounded-full animate-pulse" />

              <div className="h-5 w-40 bg-gray-200 rounded-full animate-pulse" />

              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-full bg-gray-200 rounded-full animate-pulse"
                  />
                ))}
              </div>

            </div>
          ) : blogDetail ? (

            <>
              {/* Blog Image */}

              <img
                src={blogDetail.BlogImage}
                alt={blogDetail.Title[0] || "Blog"}
                className="w-full h-80 object-cover rounded-md"
              />

              {/* Titles */}

              <div className="mt-6 space-y-3">
                {blogDetail.Title.map((title, index) => (
                  <h1
                    key={index}
                    className={
                      index === 0
                        ? "text-3xl font-bold"
                        : "text-2xl font-semibold mt-6"
                    }
                  >
                    {title}
                  </h1>
                ))}
              </div>

              {/* Date */}

              <p className="text-gray-500 mt-4">
                Published on: {filterDate(blogDetail.date)}
              </p>

              {/* Descriptions */}

              <div className="mt-6 space-y-4">
                {blogDetail.Description.map(
                  (description, index) => (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed whitespace-pre-line"
                    >
                      {description}
                    </p>
                  )
                )}
              </div>
            </>

          ) : (

            <p className="text-center text-gray-500 py-10">
              Blog not found
            </p>

          )}

        </div>

      </div>
    </div>
  );
};

export default BlogDetail;