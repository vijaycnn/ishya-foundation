"use client";

import media from "@/lib/media";
import React from 'react';
import '../Styles/AreasCovered.css';
import indiaMap from '../Images/IndiaMap.png';

const AreasCoveredComponent = () => {
  return (
    <div className="areas-covered-container">
      <div className="areas-covered">
        {/* Left Image Section (Indian map) */}
        <div className="map-section">
          <img
            src={media(indiaMap)} // Replace with actual image URL
            alt="Indian Map"
            className="india-map-image"
            loading="lazy"
          />
        </div>
        {/* Right Text Section */}
        <div className="text-section">
          <h2 className="heading">Our Footprints</h2>
          <p className="description">
          Ishya Foundation has helped children of various cities across India like Alwar, Dharamshala & New Delhi. With your help, we want to help as many as we can across the World.
          </p>
          <div className="horizontal-bar">
            <p className="bar-text">“Never Forget to leave footprints of love on the surface of the loving universe”</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasCoveredComponent;
