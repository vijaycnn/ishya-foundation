"use client";

import React from "react"; 
import { useParams } from "next/navigation";
import '../Styles/ProjectDetail.css';
import projects from "./ProjectsData";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import PageHeader from "../Components/PageHeader";
import AboutProject from "../Components/AboutProject";
import TheNeed from "../Components/TheNeed";
import TheImpact from "../Components/TheImpact";
import Quotes from "../Components/Quotes";
import useScrollAnimation from "../Components/ScrollAnimation";
import JoinUs from "../Components/JoinUs";
import ProjectTestimonials from "../Components/ProjectTestimonials";

const ProjectDetail = ( {pageData} ) => {

  const project = pageData;
  const { id } = useParams();
  // const project = projects.find((proj) => proj.id === parseInt(id));
  const breadcrumbText = `Home/Our Programs / ${project.name || "Project"}`;

  // ✅ Move the hook to the top (before any conditional returns)
  useScrollAnimation();

  return (
    <div className="project-page">
      {/* <Navbar /> */}
            <PageHeader pageName={project.name} breadcrumb={breadcrumbText} />

      {/* First Component */}
      <div className="hidden">
        <AboutProject
          image={project.fileViewUrl}
          heading={project.title}
          description={project?.remarks}
          buttonText="Get Involved"
        />
      </div>

      {/* Second Component: THE NEED */}
      {
        (project.ProgramNeeds && project.ProgramNeeds?.length ) &&
        <>
          
          <div className="hidden">
            <TheNeed needs={project.ProgramNeeds}
              // images={project.theNeed?.images}
              // descriptions={project.theNeed?.descriptions}
            />
          </div>
        </>
      }

      {/* Third Component: THE IMPACT */}
      <div className="hidden">
        <Quotes quote={project.impactHeading} />
        <TheImpact
          heading="THE IMPACT"
          subheading={project?.impactTitle}
          points={project?.impactDescription}
          image={project?.impactFileViewUrl}
        />
      </div>

      {/* Testimonial Component */}
      <div className="hidden">
        {
          (project.Mentors && project.Mentors?.length) &&
          <>
          <ProjectTestimonials testimonials={project.Mentors} />
          </>
          
        //   (
        //   <ProjectTestimonials
        //     heading={project.testimonials.heading}
        //     subheading={project.testimonials.subheading}
        //     reviews={project.testimonials.reviews}  
        //   />
        // ) : (
        //   <div>No testimonials available.</div>
        // )
        }
      </div>

        {
          (project?.joinTitle || project?.joinDescription) &&
            <JoinUs
            heading={project?.joinTitle}
            description={project?.joinDescription}
            image={  project?.joinFileUrl ? project?.joinFileViewUrl : null}
            /> 
        }
      
      {/* <Footer /> */}
    </div>
  );
};

export default ProjectDetail;
