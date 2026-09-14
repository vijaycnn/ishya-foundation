"use client";

import media from "@/lib/media";
import React, { useState } from 'react';
import { useParams } from "next/navigation";
import '../Styles/ProjectTestimonials.css'; // You can place the CSS in a separate file
import projects from '../views/ProjectsData';

const ProjectTestimonials = () => {
  const { id } = useParams();
  const project = projects.find((proj) => proj.id === parseInt(id));

  const [showMore, setShowMore] = useState(false);

  // Toggle to show more reviews
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // If project data is not found
  if (!project) {
    return <h2>Project not found!</h2>;
  }

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <h2>{project.testimonials.heading}</h2>
        <p>{project.testimonials.subheading}</p>
      </div>

      <div className="testimonials-tiles">
        {project.testimonials.data.slice(0, showMore ? project.testimonials.data.length : 3).map((testimonial, index) => (
          <div key={index} className="testimonials-tile">
            <div className="testimonials-header">
              <img src={media(testimonial.image)} alt={testimonial.name} className="testimonials-image"loading="lazy" />
              <div className="testimonials-info">
                <h3 className="testimonials-name">{testimonial.name}</h3>
                <p className="testimonials-occupation">{testimonial.occupation}</p>
                <div className="testimonials-stars">
                  {Array.from({ length: testimonial.stars }, (_, starIndex) => (
                    <span key={starIndex} className="star">★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="testimonials-quote">
              <span className="quote-symbol">“</span>
              <div className="quote-line"></div>
            </div>

            <p className="testimonials-paragraph">{testimonial.paragraph}</p>
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
