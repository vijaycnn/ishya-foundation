"use client";

import media from "@/lib/media";
import React, { useState } from 'react';
import { useParams } from "next/navigation";
import '../Styles/ProjectTestimonials.css'; // You can place the CSS in a separate file
import projects from '../views/ProjectsData';

const ProjectTestimonials = ( {testimonials} ) => {
  
  // const { id } = useParams();
  // const project = projects.find((proj) => proj.id === parseInt(id));

  const [showMore, setShowMore] = useState(false);

  // Toggle to show more reviews
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // If project data is not found
  if (!testimonials) {
    return <h2>Testimonial not found!</h2>;
  }

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <h2>{testimonials.name}</h2>
        <p>{testimonials.title}</p>
      </div>

      <div className="testimonials-tiles">
        {testimonials.slice(0, showMore ? testimonials.length : 3).map((testimonial, index) => (
          <div key={index} className="testimonials-tile">
            <div className="testimonials-header">
              {
                (testimonial.fileUrl) ?
                <>
                <img src={media(testimonial?.fileViewUrl)} alt={testimonial.name} className="testimonials-image"loading="lazy" />
                </>:
                <>
                </>
              }
              <div className="testimonials-info">
                <h3 className="testimonials-name">{testimonial.name}</h3>
                <p className="testimonials-occupation">{testimonial.title}</p>
                <div className="testimonials-stars">
                  {Array.from({ length: testimonial.rating }, (_, starIndex) => (
                    <span key={starIndex} className="star">★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="testimonials-quote">
              <span className="quote-symbol">“</span>
              <div className="quote-line"></div>
            </div>
            {              
              (testimonial.remark1) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: testimonial.remark1 || "" }} />
              </>: ''
            }
            {/* <p className="testimonials-paragraph">{testimonial.paragraph}</p> */}
          </div>
        ))}
      </div>

      <button className="show-more-btn" onClick={toggleShowMore}>
        {showMore ? 'Show Less Reviews' : 'See More Reviews'}
      </button>
    </div>
  );
};

export default ProjectTestimonials;
