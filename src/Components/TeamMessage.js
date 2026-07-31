import React from "react";
import "../Styles/TeamMessage.css";
import CoFounderImage from "../Images/cofounder.jpg";
import ProfileImage from "../Images/Founder.png"; // Replace with actual image

import FloralDesign2 from "../Images/FloralDesign2.png"; // Provide the PNG

const ProfileSection = () => {
  return (
    <div className="profile-section">
      <div className="profile-section-container">
        <div className="profile-content">
          <div className="profile-image-wrapper">
            <div className="profile-image-thumb">
              <img
                src={ProfileImage}
                alt="Profile"
                className="profile-image"
                loading="lazy"
              />
            </div>
            <div className="profile-image-text">
              <h4>Shalini Gupta</h4>
              <p>FOUNDER</p>
            </div>
          </div>
          <div className="profile-text">
            <p className="profile-description">
              {/* My goal for ishya is to develop an organisation that combats the disparity in knowledge and poverty within the society . iam to achieve this by estabilishing a resourceful institution that promotes and focters financial autonomy for individuals. */}
              Our goal for Ishya Foundation is to develop an organisation that
              combats the disparity in knowledge and poverty within society. We
              aim to achieve this by establishing a resourceful learning
              institution that promotes education and financial autonomy for
              individuals.
            </p>
          </div>
          <div className="profile-image-wrapper">
            <div className="profile-image-thumb">
              <img
                src={CoFounderImage}
                alt="Profile"
                className="profile-image"
                loading="lazy"
              />
            </div>

            <div className="profile-image-text">
              <h4>Ishita Gupta</h4>
              <p>CO-FOUNDER</p>
            </div>
          </div>
        </div>

        <img
          src={FloralDesign2}
          alt="Corner Design"
          className="corner-design"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ProfileSection;
