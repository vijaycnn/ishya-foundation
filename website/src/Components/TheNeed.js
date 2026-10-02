"use client";

import media from "@/lib/media";
import React from "react";
import '../Styles/TheNeed.css';

const TheNeed = ({ needs }) => {
  return (
    <div className="second-component">
      <h2 style={{ color: "#A6C769" }}>THE NEED</h2>
      <div className="image-grid">
        {needs.map((need, index) => (
          <div key={index} className="image-item">
            <img src={media(need.fileViewUrl)} loading="lazy"alt={`Need ${index + 1}`} />
            {              
              (need.remarks) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: need.remarks || "" }} />
              </>: ''
            }
            {/* <p>{descriptions[index]}</p> */}
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
