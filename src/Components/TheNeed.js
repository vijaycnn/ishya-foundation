import React from "react";
import '../Styles/TheNeed.css';

const TheNeed = ({ images, descriptions }) => {
  return (
    <div className="second-component">
      <h2 style={{ color: "#A6C769" }}>THE NEED</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} loading="lazy"alt={`Need ${index + 1}`} />
            <p>{descriptions[index]}</p>
            {/* <button style={{ backgroundColor: "#6D3780", color: "#FFF" }}>
              Get Involved
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheNeed;
