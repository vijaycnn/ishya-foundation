"use client";

import media from "@/lib/media";
import React, { useEffect } from "react";
import "../Styles/Partner.css"; // Import the CSS file

const Partner = ({ id, heading, imageSrc, subheading, description }) => {
 
  return (

    <div className="partner-container" id={id}>
      {/* Heading */}
      <h1 className="partner-heading" >{heading}</h1>

      {/* Image */}
      <img src={media(imageSrc)} alt={heading} className="partner-image" loading="lazy" />

      {/* Subheading */}
      <h2 className="partner-subheading">{subheading}</h2>

      {/* Description */}
      <p className="partner-description">{description}</p>
      <div className="modern-line"></div> {/* Modern Line */}
    </div>
  );
};

export default Partner;
