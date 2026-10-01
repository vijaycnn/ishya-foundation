"use client";

import media from "@/lib/media";
import React, { useState, useEffect } from "react";  
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "../../Styles/Beneficiaries.css"; 

const FeatureSection = ( {data} ) => {

  const beneficiariesData = data;
  // console.log("Feature DATA >>>",  homeData, beneficiariesData.length, beneficiariesData);

  if (!beneficiariesData.length) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % beneficiariesData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? beneficiariesData.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle navigation correctly
  const handleButtonClick = () => {
    const currentLink = beneficiariesData[currentIndex]?.btnLink;

    if (currentLink.startsWith("http")) {
      // Open external links in a new tab
      window.open(currentLink, "_blank");
    } else {
      // Navigate to internal routes
      router.push(currentLink);
    }
  };

  return (
    <div className="beneficiaries-container">
      <button className="nav-button left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      <div className="beneficiary-slide">
        <img src={media(beneficiariesData[currentIndex].fileViewUrl)} loading="lazy" alt="Beneficiary" className="beneficiary-image" />
        <div className="beneficiary-content">
          <h2>{beneficiariesData[currentIndex].title}</h2>
          {              
              (beneficiariesData[currentIndex]?.remarks) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: beneficiariesData[currentIndex].remarks || "" }} />
              </>: ''
            }
          {
            (beneficiariesData[currentIndex]?.btnText && beneficiariesData[currentIndex]?.btnLink) &&
            <>
                <button 
                    className="beneficiary-button"
                    onClick={handleButtonClick}  // Correctly handle internal & external links
                >
                    {beneficiariesData[currentIndex]?.btnText}
                </button>
            </>
          }
        </div>
      </div>

      <button className="nav-button right" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      <div className="dots-container">
        {beneficiariesData.map((_, index) => (
          <span key={index} className={`dot ${index === currentIndex ? "active" : ""}`} onClick={() => setCurrentIndex(index)}></span>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
