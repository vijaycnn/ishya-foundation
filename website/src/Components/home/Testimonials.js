"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import "../../Styles//Testimonial.css";

const Testimonial = ( {homeData, data} ) => {
  const testimonials = data;
  // console.log("testimonial DATA >>>",  homeData, projects.length, projects);

  if (!testimonials.length) {
    return null;
  }

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
        <h4 className="small-heading">{ homeData.testimonialTitle }</h4>
        <h2 className="big-heading">{homeData.testimonialHeading}</h2>
      </div>
      <div className="testimonial-content">
        {/* Left Section */}
        <div className="testimonial-left">
          <img
            src={media(testimonials[currentIndex].fileViewUrl)}
            alt={testimonials[currentIndex].name}
            className="testimonial-image"
            loading="lazy"
          />
          <p className="testimonial-profession">
            {testimonials[currentIndex].title}
          </p>
          <p className="testimonial-name">{testimonials[currentIndex].name}</p>
          <button className="arrow-btn left-arrow" onClick={handlePrev}>
            ←
          </button>
        </div>
        {/* Right Section */}
        <div className="testimonial-right">
          {/* <p className="testimonial-text">
            {testimonials[currentIndex].remark1}
          </p> */}
          {              
              (testimonials[currentIndex].remark1) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: testimonials[currentIndex].remark1 || "" }} />
              </>: ''
            }
          <button className="arrow-btn right-arrow" onClick={handleNext}>
            →
          </button>
        </div>
      </div>
      {/* Marker for testimonials */}
      {/* <div className="testimonial-markers">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`marker ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div> */}
    </div>
  );
};

export default Testimonial;
