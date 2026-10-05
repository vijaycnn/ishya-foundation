"use client";
import React, { useEffect, useState } from "react";
import ProjectTile from "../Components/ProjectsTile";
import "../Styles/ProjectPage.css";
import "../Styles/JoinUsPage.css";
import PageHeader from "../Components/PageHeader";

// const categories = ['All', 'Education', 'Health & Wellbeing', 'Community Development', 'Women Empowerment', 'Environment', 'Art & Culture'];

const ProjectsPage = ({ pageData }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const storedPrograms = localStorage.getItem("menu");

    if (storedPrograms) {
      try {
        setCategories(JSON.parse(storedPrograms));
      } catch (error) {
        console.error("Invalid programList in localStorage", error);
      }
    }
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredProjects =
    selectedCategory === "All"
      ? pageData
      : pageData.filter(
          (project) => project["ProgramType.name"] === selectedCategory,
        );

  return (
    <div className="projects-page-container">
      <PageHeader pageName="Our Programs" breadcrumb="Home/Our Programs" />

      <div className="content-wrapper">
        <div className="category-bar">
          {categories?.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              {selectedCategory === category && (
                <span className="tick-mark">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-grid-item">
              <ProjectTile
                image={project.fileViewUrl}
                name={project.name}
                description={project.shortDesc}
                redirectPath={`/project/${project.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
