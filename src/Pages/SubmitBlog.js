import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from '../Components/PageHeader';
import "../Styles/SubmitBlog.css"; // Create this CSS file

const SubmitBlog = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    blog_title: "",
    blog_content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/submit-blog", formData);
      alert(response.data.message);
      setFormData({ full_name: "", email: "", blog_title: "", blog_content: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Error submitting blog. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <PageHeader pageName="Submit Your Blog" breadcrumb="Home/Submit Blog" />

      <div className="submit-blog-container">
        <h2>Share Your Story</h2>
        <p>Write and submit your blog to get featured on our platform!</p>
        
        <form onSubmit={handleSubmit} className="submit-blog-form">
          <label>Full Name</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Blog Title</label>
          <input type="text" name="blog_title" value={formData.blog_title} onChange={handleChange} required />

          <label>Blog Content</label>
          <textarea name="blog_content" rows="6" value={formData.blog_content} onChange={handleChange} required></textarea>

          <button type="submit" className="submit-button">Submit Blog</button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitBlog;
