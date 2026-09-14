"use client";

import media from "@/lib/media";
import React from "react";
import "../Styles/Projects.css";
import KushalSakhi from '../Images/KushalSakhiBanner.png';
import Udaan from '../Images/UdaanBanner.png';
import ShikshaSeSaksham from '../Images/ShikshaseSakshamBanner.png';
import Sahayak from '../Images/SahayakBanner.png';
import Link from "next/link";

const LatestProjects = () => {
  const projects = [
    {
      id: 1,
      image: KushalSakhi,
      category: "Women Empowerment",
      title: "KUSHAL SAKHI",
      description: "Empowering women through skill development and livelihood opportunities.",
      link: "/project/10", // Replace with actual link
    },
    {
      id: 2,
      image: Udaan,
      category: "Education",
      title: "UDAAN",
      description: "A program for children aged 3-6, enrolling 31 children in a critical development stage.",
      link: "/project/1", // Replace with actual link
    },
    {
      id: 3,
      image: ShikshaSeSaksham,
      category: "Education",
      title: "SHIKSHA SE SAKSHAM",
      description: "Catering to 32 children who never attended formal school or dropped out, providing a path back into education.",
      link: "/project/2", // Replace with actual link
    },
    {
      id: 4,
      image: Sahayak,
      category: "Education",
      title: "SAHAYAK",
      description: "Supporting 37 children from families struggling to afford additional academic support.",
      link: "/project/7", // Replace with actual link
    },
  ];

  return (
    <div className="latest-projects-container">
      {/* Header Section */}
      <div className="latest-projects-header">
        <div>
          <h4 className="small-heading">Latest Projects</h4>
          <h2 className="big-heading">Explore Our Projects That</h2>
          <h2 className="big-heading-2">Make A Difference.</h2>
        </div>
        <Link href="/ourprograms" className="explore-more-btn">Explore more projects</Link>
      </div>

      {/* Project Tiles */}
      <div className="projectS-tiles">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`projectS-tile ${index % 2 === 0 ? "green-tile" : "purple-tile"}`}
          >
            <img
              src={media(project.image)}
              alt={project.title}
              className="projectS-image"
              loading="lazy"
            />
            <div className="projectS-content">
              <p className="projectS-category">{project.category}</p>
              <h3 className="projectS-title">{project.title}</h3>
              <p className="projectS-description">{project.description}</p>
              <Link href={project.link} className="read-more-btn-projects">Read more</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestProjects;