"use client";

import media from "@/lib/media";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FooterCreative from "../Images/FooterCreative.png";
import '../Styles/AboutUs.css';
import OurValues from "../Components/OurValues";
import AboutUsIntro from "../Components/AboutUsIntro";
import OurTeamGallery from "../Components/OurTeamGallery";
import TeamMessage from "../Components/TeamMessage";

const AboutUs = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show the button after 15 seconds
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 15000);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <Navbar />

      {/* Full-width video section */}
      <div className="video-container">
        <video
          className="intro-video"
          autoPlay
          muted
          playsInline
          loop
          onEnded={() => setShowButton(true)} // Show button if video ends
        >
          <source src="/IntroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {showButton && (
          <div className="video-button-container">
            <a
              href="https://www.youtube.com/watch?v=cLNDitreEiE"
              target="_blank"
              rel="noopener noreferrer"
              className="watch-full-video-btn"
            >
              Watch Full Video on YouTube
            </a>
          </div>
        )}
      </div>

      <AboutUsIntro/>
      <OurValues/>
      <TeamMessage/>
      <OurTeamGallery/>
      <div className="footer-creative-container">
        <img src={media(FooterCreative)} alt="FooterCreative" className="footer-creative" />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
