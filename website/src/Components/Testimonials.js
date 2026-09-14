"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import "../Styles//Testimonial.css";
import Cardiologist from '../Images/Cardiologist.png';
import CEO from '../Images/CEO.png';
import AssociateProfessor from '../Images/AssociateProfessor.png';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      image: Cardiologist,
      profession: "Cardiologist",
      name: "Dr Rakesh Sapra",
      text: "It was an absolute privilege to collaborate with Ishya Foundation for the online event. The work they are doing to uplift underprivileged youth in the community through education, healthcare, and empowerment initiatives is truly commendable. Their commitment to creating lasting impact in society is inspiring, and I am deeply appreciative of the opportunity to contribute to their mission. I look forward to supporting Ishya in their future endeavors.",
    },
    {
      id: 2,
      image: CEO,
      profession: "CEO, Sheetal Batra Design House LLP",
      name: "Sheetal Batra",
      text: "I love being associated with Ishya Foundation and am so proud to see Shalini helping underprivileged kids and educating them. Very thrilled to see the students happy and was amazed by the creative skills they all have. This has become a second home for the kids. I was also very delighted to see how kids performed in the last summer camp. This is a platform where childrenare also showcasing their talent. Ishya is not only fulﬁlling the dreams of children but also of their parents. I wish all these children’s dreams come true and I will help them as much as I can. ",
    },
    {
      id: 3,
      image: AssociateProfessor,
      profession: "Associate Professor, Delhi University",
      name: "Sangeeta Relan",
      text: "Ishya Foundation, founded by Shalini Gupta, has been a beacon of hope and empowerment for countless girls. Through Shalini's visionary leadership, the foundation provides quality education, scholarships, and mentorship programs, transforming lives and breaking the cycle of poverty. The profound impact of the Foundation's work is evident in the academic and personal growth of these young girls, fostering a brighter and more equitable future for all. Its dedication to social change is inspiring, making a signiﬁcant difference in our community.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="testimonial-container">
      <div className="testimonial-header">
        <h4 className="small-heading">Our Testimonials</h4>
        <h2 className="big-heading">What People Say</h2>
      </div>
      <div className="testimonial-content">
        {/* Left Section */}
        <div className="testimonial-left">
          <img
            src={media(testimonials[currentIndex].image)}
            alt={testimonials[currentIndex].name}
            className="testimonial-image"
            loading="lazy"
          />
          <p className="testimonial-profession">
            {testimonials[currentIndex].profession}
          </p>
          <p className="testimonial-name">{testimonials[currentIndex].name}</p>
          <button className="arrow-btn left-arrow" onClick={handlePrev}>
            ←
          </button>
        </div>
        {/* Right Section */}
        <div className="testimonial-right">
          <p className="testimonial-text">
            {testimonials[currentIndex].text}
          </p>
          <button className="arrow-btn right-arrow" onClick={handleNext}>
            →
          </button>
        </div>
      </div>
      {/* Marker for testimonials */}
      <div className="testimonial-markers">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`marker ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
