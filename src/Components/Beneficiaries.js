import React, { useState, useEffect } from "react";  
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../Styles/Beneficiaries.css"; 
import Beneficiary1 from "../Images/Beneficiary1.png";
import IshyaEntrance from '../Images/IshyaEntrance.png';
import SendStudents from '../Images/ProjectDetails/ShikshaImpact.png';

const beneficiariesData = [
  {
    id: 1,
    image: Beneficiary1,
    heading: "What our beneficiaries say",
    description: "इश्या फाउंडेशन के समर्थन से मुझे पता चला कि सार्वजनिक स्कूलों में EWS सीटें आरक्षित हैं...",
    buttonText: "Help Women Upskill",
    link: "https://rzp.io/rzp/donateforwomen"  // External Razorpay link
  },
  {
    id: 2,
    image: SendStudents,
    heading: "Send Students To School",
    description: "To help underprivileged children develop their capabilities, we opened the Ishya learning center...",
    buttonText: "Send Students to School",
    link: "https://rzp.io/rzp/donateforhigheredu"  // External Razorpay link
  },
  {
    id: 3,
    image: IshyaEntrance,
    heading: "Ishya Learning Center",
    description: "Ishya Learning Center provides early childhood education to children aged 3 to 6...",
    buttonText: "Ishya Learning Center",
    link: "/ishya-learning-centre"  // Internal route
  },
];

const Beneficiaries = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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
    const currentLink = beneficiariesData[currentIndex].link;

    if (currentLink.startsWith("http")) {
      // Open external links in a new tab
      window.open(currentLink, "_blank");
    } else {
      // Navigate to internal routes
      navigate(currentLink);
    }
  };

  return (
    <div className="beneficiaries-container">
      <button className="nav-button left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      <div className="beneficiary-slide">
        <img src={beneficiariesData[currentIndex].image} loading="lazy" alt="Beneficiary" className="beneficiary-image" />
        <div className="beneficiary-content">
          <h2>{beneficiariesData[currentIndex].heading}</h2>
          <p>{beneficiariesData[currentIndex].description}</p>
          <button 
            className="beneficiary-button"
            onClick={handleButtonClick}  // Correctly handle internal & external links
          >
            {beneficiariesData[currentIndex].buttonText}
          </button>
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

export default Beneficiaries;
