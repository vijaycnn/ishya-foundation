"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaHeart, FaComment, FaShareAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import "../Styles/BlogDetails.css";
import { formatDate } from "@/utils/dateFormat";
      
const BlogDetails = ({pageData}) => {

  const blog = pageData;
  // const { id } = useParams();
  // const blog = blogPosts.find((b) => b.id === parseInt(id));

  const [likes, setLikes] = useState(0);

  if (!blog) {
    return <h2 className="error-message">Blog Not Found</h2>;
  }

  return (
    <>
      {/* <Navbar /> */}
      
      {/* Hero Section with Blurred Background */}
      <div className="blog-detail-hero" style={{ backgroundImage: `url(${blog?.image})` }}>
        <div className="blog-hero-overlay">
          <h1>{blog.title}</h1>
          <p>
            <FaUser /> {blog.publishBy} &nbsp; | &nbsp;
            <FaCalendarAlt /> {formatDate(blog.publishAt)}
          </p>
        </div>
      </div>

      {/* Blog Content Section */}
      <div className="blog-details-container">
        <div className="blog-detail-card">
          <img src={media(blog?.image)} alt={blog.title} className="blog-main-image" />
          
          {              
            (blog.remarks) ?
            <>
            <div dangerouslySetInnerHTML={{ __html: blog.remarks || "" }} />
            </>: ''
          }
{/*                 
          <div className="blog-detail-text">
        {blog.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>  // Render each paragraph separately
        ))}
      </div> */}


          {/* Action Buttons */}
          <div className="blog-actions">
            <button className="like-button" onClick={() => setLikes(likes + 1)}>
              <FaHeart /> {likes} Likes
            </button>
            <button className="comment-button">
              <FaComment /> Comment
            </button>
            <button className="share-button">
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default BlogDetails;
