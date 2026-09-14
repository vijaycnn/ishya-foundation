"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/Gallery.css";
import ShikshaSeSakshamNeed1 from '../Images/ProjectDetails/ShikshaSeSakshamNeed1.png';
import ShikshaSeSakshamNeed2 from '../Images/ProjectDetails/ShikshaSeSakshamNeed2.png';
import ShikshaSeSakshamNeed3 from '../Images/ProjectDetails/ShikshaSeSakshamNeed3.png';
import ShikshaImpact from '../Images/ProjectDetails/ShikshaImpact.png';

import UdaanProject from '../Images/ProjectDetails/UdaanProject.png';
import UdaanNeed1 from '../Images/ProjectDetails/UdaanNeed.png';
import UdaanNeed2 from '../Images/ProjectDetails/UdaanNeed2.png';
import UdaanNeed3 from '../Images/ProjectDetails/UdaanNeed3.png';
import UdaanImpact from '../Images/ProjectDetails/UdaanImpact.png';
import Saurvi from '../Images/ProjectDetails/Saurvi.jpg';
import Saurvi1 from '../Images/ProjectDetails/Saurvi (1).jpg';
import Saurvi2 from '../Images/ProjectDetails/Saurvi (2).jpg';
import Saurvi3 from '../Images/ProjectDetails/Saurvi (3).jpg';
import Saurvi4 from '../Images/ProjectDetails/Saurvi (4).jpg';
import Saurvi6 from '../Images/ProjectDetails/Saurvi (6).jpg';

import Saurvi7 from '../Images/ProjectDetails/Saurvi (7).jpg';
import Unnati from '../Images/ProjectDetails/Unnati (6).png';
import Unnati1 from '../Images/ProjectDetails/Unnati (1).png';
import Unnati2 from '../Images/ProjectDetails/Unnati (2).png';
import Unnati3 from '../Images/ProjectDetails/Unnati (3).png';
import Unnati4 from '../Images/ProjectDetails/Unnati (4).png';
import Unnati5 from '../Images/ProjectDetails/Unnati (5).png';
import Sarvodaya1 from '../Images/ProjectDetails/Sarvodaya (1).png';
import Sarvodaya2 from '../Images/ProjectDetails/Sarvodaya (2).png';
import Sarvodaya3 from '../Images/ProjectDetails/Sarvodaya (3).png';
import Sarvodaya4 from '../Images/ProjectDetails/Sarvodaya (4).png';
import Sarvodaya5 from '../Images/ProjectDetails/Sarvodaya (5).png';
import Sarvodaya6 from '../Images/ProjectDetails/Sarvodaya (6).png';
import Sahayak1 from '../Images/ProjectDetails/Sahayak (1).png';
import Sahayak2 from '../Images/ProjectDetails/Sahayak (2).png';
import KushalSakhi1 from '../Images/ProjectDetails/KushalSakhi (1).png';
import KushalSakhi2 from '../Images/ProjectDetails/KushalSakhi (2).png';
import KushalSakhi3 from '../Images/ProjectDetails/KushalSakhi (3).png';
import KushalSakhi4 from '../Images/ProjectDetails/KushalSakhi (5).png';
import KushalSakhi5 from '../Images/ProjectDetails/KushalSakhi (6).png';
import KushalSakhi6 from '../Images/ProjectDetails/KushalSakhi (7).png';
import Swasthya1 from '../Images/ProjectDetails/Swasthya (1).jpg';
import Swasthya2 from '../Images/ProjectDetails/Swasthya (2).jpg';
import Swasthya3 from '../Images/ProjectDetails/Swasthya (4).jpg';
import Swasthya4 from '../Images/ProjectDetails/Swasthya (5).jpg';
import Swasthya5 from '../Images/ProjectDetails/Swasthya (6).jpg';
import Swasthya6 from '../Images/ProjectDetails/Swasthya (7).jpg';
// Sample gallery sections
const gallerySections = {
  "All": [
    Swasthya6, KushalSakhi6,,Sarvodaya6 ,ShikshaImpact,Unnati5,
    Saurvi6,UdaanImpact,UdaanProject,Unnati,Saurvi2,ShikshaSeSakshamNeed3,Sarvodaya1,
    Swasthya5,Swasthya4,KushalSakhi5,Sahayak1,Sarvodaya5,Sahayak2, Unnati1,Saurvi3,Saurvi4,
    Unnati4,Saurvi7,UdaanNeed3,ShikshaSeSakshamNeed2,KushalSakhi3,Unnati2,
    Swasthya1,Sarvodaya3,Sarvodaya2,Unnati3,Saurvi1,UdaanNeed1,UdaanNeed2,
    ShikshaSeSakshamNeed1,KushalSakhi1,Swasthya2,Sarvodaya4,KushalSakhi2,Swasthya3,Saurvi,KushalSakhi4
  ],
  "Our Team": ["team1.jpg", "team2.jpg", "team3.jpg"],
  "Events": ["event1.jpg", "event2.jpg", "event3.jpg"],
  "Community Work": ["community1.jpg", "community2.jpg", "community3.jpg"],
  "Fundraising Campaigns": ["fundraising1.jpg", "fundraising2.jpg", "fundraising3.jpg"],
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="gallery-hero" >
        <h1>Capturing Moments of Change</h1>
        <p>See the impact we create through our work and events.</p>
      </div>

      {/* Category Filter */}
      <div className="category-tabs">
        {Object.keys(gallerySections).map((category) => (
          <button 
            key={category} 
            className={`category-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Gallery Grid */}
      <div className="masonry-gallery">
        {gallerySections[selectedCategory].map((image, index) => (
          <div key={index} className="gallery-item" onClick={() => setSelectedImage(image)}>
            <img src={media(image)} alt={selectedCategory} className="gallery-img" loading="lazy"/>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={media(selectedImage)} alt="Expanded View" className="modal-img" loading="lazy" />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default GalleryPage;
