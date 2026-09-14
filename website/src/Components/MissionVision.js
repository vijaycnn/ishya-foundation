"use client";

import media from "@/lib/media";
import React from 'react';
import '../Styles/MissionVision.css';
import KidsCircle from '../Images/KidCircle.png';

const MissionVision = () => {
  return (
    <div className="custom-component-container">
      <div className="custom-component">
        {/* Left Section */}
        <div className="left-section">
          <h4 className="small-heading">Dawn of hope</h4>
          <h1 className="big-heading">Let Us Come Together</h1>
          <h1 className="big-heading2">To Make a Difference</h1>
          <p className="description-mission">
          The Ishya Foundation was formed in the year 2021 with the aim of empowering the underprivileged and helping them realize their true potential. Our effort has been to ﬁll the need gap, which restricts the growth of the people who have limited access to resources.          </p>
          <div className="tiles">
            <div className="tile">
              <h3>Our Mission</h3>
              <p>We want to bring about a positive change in the following aspects: education, health & wellbeing, community development, women empowerment & development, environment, and art & culture.</p>
            </div>
            <div className="tile">
              <h3>Our Vission</h3>
              <p>We envision empowering the underprivileged section of our society through a holistic approach to help them realize their full potential.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="image-container-mission">
            <img
              src={media(KidsCircle)}
              alt="Placeholder"
              className="square-image"
              loading="lazy"
            />
          </div>
          <div className="points-tile">
                <p>Diversity & Inclusion</p>
                <p>Collaboration/ Teamwork</p>
                <p>Integrity/ Accountability</p>
                <p>Transformation</p>
                <p>People Focussed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
