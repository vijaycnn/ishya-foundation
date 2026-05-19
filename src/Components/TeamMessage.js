import React from "react";
import "../Styles/TeamMessage.css";
import ProfileImage from "../Images/Founder.png"; // Replace with actual image
import FloralDesign1 from "../Images/FloralDesign1.png"; // Provide the PNG
import FloralDesign2 from "../Images/FloralDesign2.png"; // Provide the PNG

const ProfileSection = () => {
  return (
    <div className="profile-section">
      <img src={FloralDesign1} alt="Background Design" className="background-design" loading="lazy"/>
      
      <div className="profile-content">
        <div className="profile-image-wrapper">
          <img src={ProfileImage} alt="Profile" className="profile-image" loading="lazy"/>
        </div>
        <div className="profile-text">
          <p className="profile-description">
            My goal for ishya is to develop an organisation that combats the disparity in knowledge and poverty within the society . iam to achieve this by estabilishing a resourceful institution that promotes and focters financial autonomy for individuals.
          </p>
          <p className="profile-name">Shalini Gupta</p>
          <p className="profile-designation">FOUNDER</p>
        </div>
      </div>

      <img src={FloralDesign2} alt="Corner Design" className="corner-design" loading="lazy"/>
    </div>
  );
};

export default ProfileSection;
