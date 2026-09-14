"use client";

import media from "@/lib/media";
import React from "react";
import '../Styles/AboutProject.css';

const AboutProject = ({ image, heading, description, buttonText }) => {
  return (
    <div className="first-component">
      <div className="image-container-aboutproject">
        <img src={media(image)} alt={heading} loading="lazy"/>
      </div>
      <div className="content">
        <h1 style={{ color: "#A6C769", fontFamily: "Playfair Display" }}>{heading}</h1>
        <p>{description}</p>
        <button style={{ backgroundColor: "#6D3780", color: "#FFF" }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AboutProject;
