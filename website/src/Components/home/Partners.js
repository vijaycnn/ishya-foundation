"use client";

import media from "@/lib/media";
import React, { useEffect, useState } from "react";

import "../../Styles/Partnerships.css";

const Partners = ({ data = [] }) => {
  const logos = Array.isArray(data) ? data : [];

  const [startIndex, setStartIndex] = useState(0);

  const visibleLogos = logos.length > 4 ? 5 : logos.length;

  const displayedLogos = logos.slice(
    startIndex,
    startIndex + visibleLogos
  );

  useEffect(() => {
    const index = window.location.hash.substring(1);

    if (index !== "") {
      handleLogoClick(index);
    }
  }, []);

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + visibleLogos < logos.length
        ? prevIndex + 1
        : prevIndex
    );
  };

  const handleLogoClick = (index) => {
    // if (!logoLinks || index < 0 || index >= logoLinks.length) {
    //   console.error("Invalid index:", index); // Debugging message
    //   return;
    // }
    // const sectionId = logoLinks[index]; // Ensure this is not undefined
  
    // if (!sectionId) return; // Prevent errors if no matching section exists
  
    // const section = document.getElementById(sectionId);
    // console.log(section);
    // if (section) {
    //   section.scrollIntoView({ behavior: "smooth" });
    // } else {
    //   window.location.href = `/partnerships#${index}`; // Redirect if section isn't found
    // }
  };

  // Hooks have already been called
  if (!logos.length) {
    return null;
  }

  return (
    <div className="partnerships">
      <h2>Partnerships</h2>

      <div className="slider-container">
        <button
          type="button"
          className="nav-button left"
          onClick={handlePrev}
          disabled={startIndex === 0}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="logos-container">
          {displayedLogos.map((logo, index) => (
            <div
              key={logo.id ?? `${startIndex}-${index}`}
              className="logo-item"
              style={{ cursor: "pointer" }}
            >
              <img
                src={media(logo.fileViewUrl)}
                loading="lazy"
                alt={`Partner ${startIndex + index + 1}`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="nav-button right"
          onClick={handleNext}
          disabled={startIndex + visibleLogos >= logos.length}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Partners;