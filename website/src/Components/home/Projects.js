"use client";

import media from "@/lib/media";
import React from "react";
import "../../Styles/Projects.css";
import Link from "next/link";

const LatestProjects = ( {homeData, data } ) => {

  const projects = data;
  // console.log("project DATA >>>",  homeData, projects.length, projects);

  if (!projects.length) {
    return null;
  }

  return (
    <div className="latest-projects-container">
      {/* Header Section */}
      <div className="latest-projects-header">
        <div>
          <h4 className="small-heading">{homeData?.partnerPageTitle}</h4>
          <h2 className="big-heading">{homeData?.partnerPageHeading}</h2>
          <h2 className="big-heading-2">{homeData?.partnerPageSubHeading}</h2>
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
              src={media(project.fileViewUrl)}
              alt={project.name}
              className="projectS-image"
              loading="lazy"
            />
            <div className="projectS-content">
              <p className="projectS-category">{project['ProgramType.name']}</p>
              <h3 className="projectS-title">{project.name}</h3>
              <p className="projectS-description">{project.shortDesc}</p>
              <Link href={`project/${project.id}`} className="read-more-btn-projects">Read more</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestProjects;