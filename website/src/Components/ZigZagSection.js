"use client";

import media from "@/lib/media";
import React from "react";
import "../Styles/ZigZagSection.css"; // Make sure to create and style this file

// Import your images
import Image1 from "../Images/ZigZag (3).png"; 
import Image2 from "../Images/ZigZag (2).png"; 
import Image3 from "../Images/ZigZag (1).png"; 
const ZigZagSection = () => {
  return (
    <div className="zigzag-container">
      {/* First Section - Image Right, Text Left */}
      <div className="zigzag-section">
        <div className="zigzag-text">
          <h2 className="zigzag-heading">Building a  Sustainable Future</h2>
          <ul>
            <li><span className="circle orange"></span> Quality Education</li>
            <li><span className="circle blue"></span> Good Health and WellBeing</li>
            <li><span className="circle orange"></span> Women Empowerment </li>
          </ul>
        </div>
        <div className="zigzag-image rightt">
          <img src={media(Image1)} alt="Students studying" loading="lazy"/>
        </div>
      </div>

      <div className="zigzag-section reverse">
        <div className="zigzag-image leftt">
          <img src={media(Image2)} alt="Women empowerment" loading="lazy" />
        </div>
        <div className="zigzag-text">
          <ul>
            <li><span className="circle blue"></span>Protection</li>
            <li><span className="circle orange"></span> Livelihood</li>
            <li><span className="circle blue"></span> Humanitarian</li>
          </ul>
        </div>
      </div>

      {/* Third Section - Image Right, Text Left */}
      <div className="zigzag-section">
        <div className="zigzag-text">
          <ul>
            <li><span className="circle orange"></span> Gender Equality </li>
            <li><span className="circle blue"></span> Partnerships</li>
          </ul>
        </div>
        <div className="zigzag-image rightt">
          <img src={media(Image3)} alt="Childen celebrating holi" loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export default ZigZagSection;
