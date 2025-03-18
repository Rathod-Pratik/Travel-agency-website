import React, { useEffect, useState } from 'react'
import { apiClient } from '../../lib/api-Client'
import { GET_BLOG } from '../../Utils/Constant'
import BlogSection from '../../Components/BlogSection';

function Blog() {

  const [blogData,SetBlogData]=useState([]);
  useEffect(()=>{
    const FetchBlog=async()=>{
      try {
        const response=await apiClient.get(GET_BLOG);

        if(response.status===200){
          SetBlogData(response.data.blog);
        }
        else{
          console.log("Some error occured")
        }

      } catch (error) {
        console.log(error)
      }

    }
    FetchBlog();

  },[])
  return (
    <div>
      <BlogSection data={blogData}/>
    </div>
  )
}

export default Blog
