import React from "react";
import '../Styles/TheImpact.css';

const TheImpact = ({ heading, subheading, points, image }) => {
  return (
    <div className="third-component">
      <div className="content">
        <h2>{heading}</h2>
        <h3>{subheading}</h3>
        <ul>
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="image-container">
        <img src={image} alt="Impact"loading="lazy" />
      </div>
    </div>
  );
};

export default TheImpact;
