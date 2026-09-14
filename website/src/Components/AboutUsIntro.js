"use client";

import media from "@/lib/media";
// OverlappingImageSection.js
import "../Styles/AboutUsIntro.css";
import overlap1 from "../Images/AboutOverlap1.png"
import overlap2 from "../Images/AboutOverlap2.png"


export default function OverlappingImageSection() {
  return (
    <div className="container">
      <div className="image-container">
        {/* Main Image */}
        <img
          src={media(overlap1)}
          alt="Main"
          className="main-image"
          loading="lazy"
        />
        {/* Overlapping Image */}
        <img
          src={media(overlap2)}
          alt="Overlay"
          className="overlay-image"
          loading="lazy"
        />
      </div>
      <div className="text-container">
        <h2>We Believe In The Transformational Power Of Education </h2>
        <p>
        Education is the foundation stone for building the future of the society. We are working in the field of education, which we believe has the most long-lasting impact in the development of the society and the nation.We began our journey in June 2021 to use our resources and expertise to help the underprivileged. We realised that through education, we can help the youth of India to excel and build a society with a prosperous future.
At Ishya, we organise regular Online Classes for under-privileged students. As one of our first endeavours, we have started with English language speaking lessons, as our research shows the most demand in that sector. The speaking skills open doors for the youth in our competitive job market. It not only helps them get education, but also boosts self-confidence and essential skills to navigate a career in the 21st century.


        </p>
      </div>
    </div>
  );
}
