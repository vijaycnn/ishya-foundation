"use client";

import media from "@/lib/media";
import React from "react";
import "../Styles/JoinUs.css";

const JoinUs = ({ heading, description, image}) => {
  return (
    <div className="join-us-container">
      <div className="join-us-content">
        {/* Image on the Left */}
        {
          (image) && 

        <div className="join-us-image">
          <img src={media(image)} alt="Join Us" loading="lazy"/>
        </div>
        }

        {/* Text on the Right */}
        <div className="join-us-text">
          <h2>{heading}</h2>
          {              
            (description) ?
            <>
            <div dangerouslySetInnerHTML={{ __html: description || "" }} />
            </>: ''
          }
          {/* <p>{description}</p> */}
          <button type="button">
            Join Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
