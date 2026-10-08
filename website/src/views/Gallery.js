"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import "../Styles/Gallery.css";
import { GALLERY_TYPE_OPTIONS, getGalleryTypeLabel  } from "@/constants/galleryType";

const GalleryPage = ({pageData}) => {
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const gallerySections =
    selectedCategory === "all"
      ? pageData
      : pageData.filter(
          (data) => data?.type?.trim() === selectedCategory,
        );

  return (
    <>
      
      {/* Hero Section */}
      <div className="gallery-hero" >
        <h1>Capturing Moments of Change</h1>
        <p>See the impact we create through our work and events.</p>
      </div>

      {/* Category Filter */}
      <div className="category-tabs">
        {
          (GALLERY_TYPE_OPTIONS).map((category) => (
          <button 
            key={category.value} 
            className={`category-button ${selectedCategory === category.value ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))
        }
      </div>

      {/* Masonry Gallery Grid */}
      <div className="masonry-gallery">
        {
          Array.isArray(gallerySections) &&
          gallerySections.map((item, index) => (
          <div key={index} className="gallery-item" onClick={() => setSelectedImage(item.fileViewUrl)}>
            <img src={media(item.fileViewUrl)} alt={getGalleryTypeLabel(item.type)} className="gallery-img" loading="lazy"/>
          </div>
        ))
        }
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={media(selectedImage)} alt="Expanded View" className="modal-img" loading="lazy" />
          </div>
        </div>
      )}

    </>
  );
};

export default GalleryPage;
