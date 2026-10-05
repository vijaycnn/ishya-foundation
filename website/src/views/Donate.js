"use client";

import media from "@/lib/media";
import React, { useState } from 'react';  
import '../Styles/Donate.css';
import { FaCaretDown } from 'react-icons/fa';
import DonateImage from '../Images/Donate.png';
import DonateQuote from '../Images/DonateQuote.png';
import PageHeader from '../Components/PageHeader';
import { useRouter } from "next/navigation";

const donationOptions = {
  "Send a Child to School": "https://rzp.io/rzp/donateforschool",
  "Help Women Gain Skills": "https://rzp.io/rzp/donateforwomen",
  "Sponsor Higher Education": "https://rzp.io/rzp/donateforhigheredu",
  "Support Healthcare Access": "https://rzp.io/rzp/donateforhealthcare"
};

const Donate = ({pageData}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(""); 
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleDonationSelect = (option) => {
    setSelectedDonation(option);
    setIsDropdownOpen(false);
  };

  const handleDonateNow = () => {
    if (selectedDonation && donationOptions[selectedDonation]) {
      window.location.href = donationOptions[selectedDonation];
    } else {
      // Redirect to Razorpay donation form if no option is selected
      window.location.href = "https://rzp.io/rzp/4QiMoMC";
    }
  };

  return (
    <div>
      <PageHeader pageName="Donate Now" breadcrumb="Home/Donate" />
      <div className="donate-container">
        <div className="donate-header">
          {/* <h1>EVERY <span className="green-text">PENNY</span> MATTERS</h1> */}
          <h1>
            {pageData?.title}
          </h1>
        </div>
        
        <div className="donate-subheading">
          {          
          pageData?.shortDesc ? (
            <>
              <div
                dangerouslySetInnerHTML={{ __html: pageData?.shortDesc || "" }}
              />
            </>
          ) : ("")}
          {/* <h2>SUPPORT US</h2>
          <h3>JOIN HANDS WITH US TO CREATE A BETTER FUTURE FOR OUR SOCIETY</h3> */}
        </div>

        <div className="donate-info-box">
          {          
          pageData?.remarks ? (
            <>
              <div
                dangerouslySetInnerHTML={{ __html: pageData?.remarks || "" }}
              />
            </>
          ) : ("")}
        </div>
        
        <div className="donate-dropdown">
          <button onClick={toggleDropdown} className="donate-btn">
            {selectedDonation || "Choose How to Help"}
            <FaCaretDown className="dropdown-arrow" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {Object.keys(donationOptions).map((option, index) => (
                <button 
                  key={index} 
                  className={`dropdown-item ${selectedDonation === option ? "selected" : ""}`}
                  onClick={() => handleDonationSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="donate-now-container">
          <button className="donate-now-btn" onClick={handleDonateNow}>
            Donate Now
          </button>
        </div>

        <div className='donate-reminder'>
          {          
          pageData?.donateDesc ? (
            <>
              <div
                dangerouslySetInnerHTML={{ __html: pageData?.donateDesc || "" }}
              />
            </>
          ) : ("")}
        </div>

        {/* Button to view donation receipt */}
        {
          (pageData?.btnText && pageData?.btnLink) &&
          <>
        <div className="donation-receipt-container">
          <button className="receipt-btn" onClick={() => router.push(pageData?.btnLink)}>
            {pageData?.btnText}
          </button>
        </div>
          </>
        }

        {
          (pageData?.fileViewUrl1) &&
          <>
            <div className="right-image-container">
              <div className="right-image">
                <img src={media(pageData?.fileViewUrl1)} alt="Quote Overlay" />
                {
                  (pageData?.overlayText) &&
                  <>
                  <div className="quote-overlay">
                    <p>{pageData?.overlayText}</p>
                  </div>
                  </>
                }
              </div>
            </div>
          </>
        }

        {
          (pageData?.fileViewUrl2) &&
          <>
            <div className="center-image">
              <img src={media(pageData?.fileViewUrl2)} alt='Children in Summer camp' loading="lazy"/>
            </div>
          </>
        }
      </div>
      
    </div>
  );
};

export default Donate;
