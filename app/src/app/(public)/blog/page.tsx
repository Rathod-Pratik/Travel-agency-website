"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "@apiClient";
import { GET_BLOG_URL } from "@utils";
import Card from "./components/Card";
import { Header } from "@/components";

type Blog = {
    _id: string;
    Title: string;
    BlogText: string;
    BlogImage: string;
    date: string;
};

function Blog() {
    const [blogData, setBlogData] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);

                const response = await apiClient.get(GET_BLOG_URL(1, 8));

                if (response.status === 200) {
                    setBlogData(response.data.blog || []);
                } else {
                    console.log("Some error occurred");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, []);

    return (
        <div>
            <Header title="All Blogs" />

            <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 w-[90vw] m-auto gap-6 p-4">
                {loading ? (
                    [...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100"
                        >
                            {/* Image Skeleton */}
                            <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer"
                                    style={{
                                        animationDuration: "2s",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-4 space-y-4">
                                {/* Location and date */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />

                                        <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse" />
                                    </div>

                                    <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <div className="h-5 w-5/6 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="h-5 w-4/6 bg-gray-200 rounded-full animate-pulse" />
                                </div>

                                {/* Blog text */}
                                <div className="space-y-2 pt-1">
                                    <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
                                    <div className="h-3 w-11/12 bg-gray-100 rounded-full animate-pulse" />
                                    <div className="h-3 w-10/12 bg-gray-100 rounded-full animate-pulse" />
                                </div>

                                {/* Button */}
                                <div className="pt-2">
                                    <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse mx-auto" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : blogData.length > 0 ? (
                    blogData.map((data) => (
                        <div key={data._id} className="w-full">
                            <Card _id={data._id} Title={data.Title} BlogText={data.BlogText} BlogImage={data.BlogImage} date={data.date} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No blogs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Blog;