"use client";

import media from "@/lib/media";
import React, { useEffect, useState } from 'react'; 

import '../Styles/Partnerships.css';

const Partnerships = ({ logos, logoLinks }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleLogos = 5; // Number of logos visible at a time  useEffect(()=>{
    let index=window.location.hash.substring(1);
    if (index!=null){
      handleLogoClick(index);
    }
  },[])

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 < 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + 1 + visibleLogos > logos.length ? prevIndex : prevIndex + 1
    );
  };

  const handleLogoClick = (index) => {
    
    if (!logoLinks || index < 0 || index >= logoLinks.length) {
      console.error("Invalid index:", index); // Debugging message
      return;
    }
    const sectionId = logoLinks[index]; // Ensure this is not undefined
  
    if (!sectionId) return; // Prevent errors if no matching section exists
  
    const section = document.getElementById(sectionId);
    console.log(section);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/partnerships#${index}`; // Redirect if section isn't found
    }
  };
  

  const displayedLogos = logos.slice(startIndex, startIndex + visibleLogos);

  return (
    <div className="partnerships">
      <h2>Partnerships</h2>
      <div className="slider-container">
        <button
          className="nav-button left"
          onClick={handlePrev}
          disabled={startIndex === 0}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </button>
        <div className="logos-container">
          {displayedLogos.map((logo, index) => (
            <div 
              key={index} 
              className="logo-item" 
              onClick={() => handleLogoClick(index)} 
              style={{ cursor: "pointer" }}
            >
              <img src={media(logo)} loading="lazy" alt={`Partner ${startIndex + index + 1}`} />
            </div>
          ))}
        </div>
        <button
          className="nav-button right"
          onClick={handleNext}
          disabled={startIndex + visibleLogos >= logos.length}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Partnerships;
