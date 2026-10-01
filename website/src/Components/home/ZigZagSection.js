"use client";

import media from "@/lib/media";
import React from "react";
import "../../Styles/ZigZagSection.css"; 

const ZigZagSection = ({homeData, data}) => {

  const zigzags = data;
  // console.log("zigzag DATA >>>",  homeData, zigzags.length, zigzags);

  if (!zigzags.length) {
    return null;
  }
  return (
    <div className="zigzag-container">
      {/* First Section - Image Right, Text Left */}

      
          <h2 className="zigzag-heading">{homeData?.zigzagTitle }</h2>

      {zigzags.map((zigzag, index) => (
          <div key={zigzag.id} >
            <div className="zigzag-image rightt">
              <img
              src={media(zigzag.fileViewUrl)}
              alt="image"
              loading="lazy"
            />
            </div>
          <div className="projectS-content">
            {              
              (zigzag.remarks) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: zigzag.remarks || "" }} />
              </>: ''
            }
          </div>
        </div>
      ))}

      {/* <div className="zigzag-section">
        <div className="zigzag-text">
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
      </div> */}


    </div>
  );
};

export default ZigZagSection;
