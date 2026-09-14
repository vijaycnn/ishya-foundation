"use client";

import media from "@/lib/media";
import React from 'react';
import '../Styles/ProjectTile.css';
import { useRouter } from "next/navigation";
const ProjectTile = ({redirectPath, image, name, description }) => {
  const router = useRouter()
  return (
    <div className="project-tile">
      <img src={media(image)} alt={name} className="project-image" loading="lazy"/>
      <h3 className="project-name">{name}</h3>
      <div className="project-description">
        <p>{description}</p>
      </div>
      <button className="read-more-btn" onClick={()=>{router.push(redirectPath)}}>Read More</button>
    </div>
  );
};

export default ProjectTile;
