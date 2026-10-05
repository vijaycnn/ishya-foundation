"use client";

import media from "@/lib/media";
import React, { useState } from 'react';
import '../Styles/Faq.css'; // Include the CSS below
// import FAQ from '../Images/FAQ.png';
const FAQComponent = ({data, faqs}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {/* Left Section */}
      <div className="faq-left">
        <h3 className="faq-subheading">{data?.faqTitle}</h3>
        <h1 className="faq-mainheading">{data?.faqHeading}</h1>
        {
          (data?.faqFileViewUrl) &&
          <>
          <div className="faq-greenbox">
            <img src={media(data?.faqFileViewUrl)}loading="lazy" alt="FAQ Illustration" className="faq-image" />
          </div>
          </>
        }
      </div>

      {/* Right Section */}
      <div className="faq-right">
        {(faqs || []).map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{faq.quest}</span>
              <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && 
            <>
              <div dangerouslySetInnerHTML={{ __html: faq.answer || "" }} />
            </>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;
