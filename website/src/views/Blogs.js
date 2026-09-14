"use client";

import media from "@/lib/media";
import React from "react";
import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa"; // Calendar & Clock icons
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from '../Components/PageHeader';
import "../Styles/Blogs.css"; // Ensure styling is applied
import Blog1 from "../Images/Blog1.png";
import Blog2 from "../Images/Blog2.png"
import Blog3 from "../Images/Blog3.png"
import Blog4 from "../Images/Blog4.png"
import Blog5 from "../Images/Blog5.png"
import Blog6 from "../Images/Blog6.png"
import Blog7 from "../Images/Blog7.png"

import BlogHero from "../Images/bloghero.png"
import Link from "next/link";


// Sample Blog Data
const blogPosts = [
  {
    id: 1,
    title: "How should students improve their mental health? ",
    writer: "Disha Gupta",
    writerImg: "https://via.placeholder.com/30", // Replace with actual writer image
    date: "Jan 25, 2025",
    readTime: "5 min",
    image: Blog1, // Replace with blog image
    excerpt: "High school is difficult and a lot of students struggle with mental health issues as a result. In fact, according to the National Alliance on Mental Illness (NAMI), one in five teens are experiencing a mental health condition, worldwide. And these issues can become chronic (meaning they follow you into adulthood); 50% of chronic mental illnesses develop at age 14...",
    link: "/blog/mental-health",
  },
  {
    id: 2,
    title: "Why is it critical for girls to play sports?",
    writer: "Disha Gupta",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 2, 2025",
    readTime: "7 min",
    image: Blog2,
    excerpt: "Unfortunately, while Indians are progressing towards a positive mindset regarding sports, they hesitate in pursuing it themselves. A shockingly high percentage, 75% of Indians believe that sports is significant in their day-to-day lives according to a research conducted by BBC in 2020...",
    link: "/blog/girl-sports",
  },
  {
    id: 3,
    title: "Why is Education important?",
    writer: "Shalini Gupta",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 10, 2025",
    readTime: "6 min",
    image: Blog3,
    excerpt: "Education’s importance in society goes much farther than an individual’s capacity to find work or gain a livelihood, It determines the society’s thoughts and ideas as a whole. In a place like India, with one of the highest population in the world, it is important that all of us move ahead instead of just a few...",
    link: "/blog/importance-of-education",
  },
  {
    id: 4,
    title: "Exercise Right",
    writer: "Yogita(Student at ISHYA)",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 10, 2025",
    readTime: "5 min",
    image: Blog4,
    excerpt: "Physical activity refers to all movements including during leisure time or for transport to get to and from places, or as part of a person's work. Both moderate and vigorous-intensity physical activity improve health. Physical activity is any form of exercise or movement of the body that uses energy. Some of your daily life activities—doing active chores around the house, yard work, walking the dog—are a few examples...",
    link: "/blog/react-vs-vue",
  },
  {
    id: 5,
    title: " Online vs Offline education",
    writer: "Muskan Rajput(Student at ISHYA)",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 10, 2025",
    readTime: "4 min",
    image: Blog5,
    excerpt: "The Covid-19 pandemic brought a dynamic shift in the world’s education system. The imposition of lockdown led to shutdown of physical classrooms and therefore online education became the new norm...",
    link: "/blog/react-vs-vue",
  },
  {
    id: 6,
    title: "The Importance of Physical Fitness",
    writer: "Kamini(Student at ISHYA)",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 10, 2025",
    readTime: "2 min",
    image: Blog6,
    excerpt: "Physical fitness is the key to a healthy body. At the end of the day, your health is your responsibility...",
    link: "/blog/react-vs-vue",
  },
  {
    id: 7,
    title: "The Ripple Effect of Kindness: How One Act Can Inspire Many ",
    writer: "Kamini(Student at ISHYA)",
    writerImg: "https://via.placeholder.com/30",
    date: "Feb 10, 2025",
    readTime: "8 min",
    image: Blog7,
    excerpt: "We all know that kindness is a virtue that should be practiced every day. But did you know that one act of kindness can have a ripple effect that inspires others to do the same? It's true! Whether it's...",
    link: "/blog/react-vs-vue",
  },
];

const Blogs = () => {
  return (
    <div>
      <Navbar />
      <PageHeader pageName="Blogs" breadcrumb="Home/Blogs" />
      <div className="blogs-header">
        <div className="header-text">
          <h2 className="header-title">PEN IT NOW</h2>
          <div className="header-line"></div>
          <p className="submit-btn">
          <Link href="/submit-blog" >Submit Here</Link>
        </p>        
        </div>
        <div className="header-image">
          <img src={media(BlogHero)} alt="Header" />
        </div>
      </div>

      <div className="blogs-container">
        {blogPosts.map((blog, index) => (
          <div key={blog.id} className={`blog-item ${index % 2 === 0 ? "left" : "right"}`}>
            <Link href={`/blog/${blog.id}`} className="blog-image">
              <img src={media(blog.image)} alt={blog.title} loading="lazy"/>
            </Link>
            <div className="blog-content">
              <Link href={`/blog/${blog.id}`} className="blog-title">{blog.title}</Link>
              <div className="blog-meta">
               <FaUser className="icon" /> 
               <span>{blog.writer}</span> 
                <FaCalendarAlt className="icon" />
                <span>{blog.date}</span>
                <FaClock className="icon" />
                <span>{blog.readTime}</span>
              </div>
              <Link href={`/blog/${blog.id}`} className="blog-excerpt">{blog.excerpt}</Link>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
