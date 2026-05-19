import React from 'react';
import '../Styles/ProjectTile.css';
import { useNavigate } from 'react-router-dom';
const ProjectTile = ({redirectPath, image, name, description }) => {
  const navigate = useNavigate()
  return (
    <div className="project-tile">
      <img src={image} alt={name} className="project-image" loading="lazy"/>
      <h3 className="project-name">{name}</h3>
      <div className="project-description">
        <p>{description}</p>
      </div>
      <button className="read-more-btn" onClick={()=>{navigate(redirectPath)}}>Read More</button>
    </div>
  );
};

export default ProjectTile;
