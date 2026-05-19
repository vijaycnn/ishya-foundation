import React from "react"; 
import "../Styles/OurTeamGallery.css"; // Import CSS file
import TeamMember1 from "../Images/Team Member (1).png"
import TeamMember2 from "../Images/Team Member (2).png"
import TeamMember3 from "../Images/Team Member (3).png"
import TeamMember4 from "../Images/Team Member (4).png"
import TeamMember5 from "../Images/Team Member (5).png"
import TeamMember6 from "../Images/Team Member (6).png"
import TeamMember7 from "../Images/Team Member (7).png"

const images = [
  TeamMember1,
  TeamMember2,
  TeamMember3,
  TeamMember4,
  TeamMember5,
  TeamMember6,
  TeamMember7
];

const OurTeamGallery = () => {
  return (
    <div className="grid-wrapper">
      <h2 className="grid-heading">Our Team</h2>
      <div className="grid-container">
        {/* First row - 3 images */}
        <div className="row first-row">
          {images.slice(0, 3).map((src, index) => (
            <img key={index} src={src} alt={`Team Member ${index + 1}`} className="grid-image large" loading="lazy"/>
          ))}
        </div>

        {/* Second row - 4 images */}
        <div className="row second-row">
          {images.slice(3, 7).map((src, index) => (
            <img key={index + 3} src={src} alt={`Team Member ${index + 4}`} className="grid-image small"loading="lazy" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeamGallery;
