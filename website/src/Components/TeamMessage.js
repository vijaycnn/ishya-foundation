"use client";

import media from "@/lib/media";
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
                src={media(ProfileImage)}
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
              "We do not build for communities, we build with them, because real
              and lasting change is created together."
            </p>
            <p className="profile-description">
              At Ishya Foundation, we believe that every individual deserves the
              opportunity to learn, live with dignity, access healthcare, and
              build a better future. Our mission is to foster education for the
              young, dignified livelihoods for those left behind, healthcare
              where it is hardest to reach, and awareness that empowers
              communities to lead their own change.
            </p>
          </div>
          <div className="profile-image-wrapper">
            <div className="profile-image-thumb">
              <img
                src={media(CoFounderImage)}
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
          src={media(FloralDesign2)}
          alt="Corner Design"
          className="corner-design"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ProfileSection;
