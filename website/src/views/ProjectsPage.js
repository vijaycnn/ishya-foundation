"use client";

import React, { useState } from 'react';
import ProjectTile from '../Components/ProjectsTile';
import '../Styles/ProjectPage.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageHeader from '../Components/PageHeader';
import Udaan from '../Images/Udaan.png';
import ShikshaSeSaksham from '../Images/ShikshaSeSaksham.png';
import Swasthya from '../Images/Swasthya.png';
import Unnati from '../Images/Unnati.png';
import Sarvodaya from '../Images/Sarvodaya.png';
import Sahayak from '../Images/Sahayak.png';
import Saarthi from '../Images/Saarthi.png';
import Saurvi from '../Images/Saurvi.png';
import KushalSakhi from '../Images/KushalSakhi.jpeg';

const projects = [
    {
        id: 1,
        image:Udaan ,
        name: 'UDAAN',
        description: 'A program for children aged 3-6, enrolling 31 children in a critical development stage.',
        category: 'Education',
    },
    {
        id: 2,
        image: ShikshaSeSaksham,
        name: 'SHIKSHA SE SAKSHAM',
        description: 'Catering to 32 children who never attended formal school or dropped out, providing a path back into education.',
        category: 'Education',
    },
    {
        id: 3,
        image: Saurvi,
        name: 'SAURVI',
        description: 'Supporting 37 children from families struggling to afford additional academic support.',
        category: 'Education',
    },
    {
        id: 4,
        image: Sarvodaya,
        name: 'SARVODAYA',
        description: 'Engaging over 50 parents and guardians, fostering collaboration between home and school for optimal child development.',
        category: 'Community Development',
    },
    {
        id: 5,
        image: Unnati,
        name: 'UNNATI',
        description: 'A program for children aged 3-6, enrolling 31 children in a critical development stage.',
        category: 'Education',
    },
    {
        id: 6,
        image: Saarthi,
        name: 'SAARTHI',
        description: 'Catering to 32 children who never attended formal school or dropped out, providing a path back into education.',
        category: 'Education',
    },
    {
        id: 7,
        image: Sahayak,
        name: 'SAHAYAK',
        description: 'Supporting 37 children from families struggling to afford additional academic support.',
        category: 'Education',
    },
    {
        id: 8,
        image: Swasthya,
        name: 'SWASTHYA',
        description: 'Promoting health and well-being in the community.',
        category: 'Health & Wellbeing',
    },
    // {
    //     id: 9,
    //     image: 'project2.jpg',
    //     name: 'SIKSHAN',
    //     description: 'A program for children aged 3-6, enrolling 31 children in a critical development stage.',
    //     category: 'Education',
    // },
    {
        id: 10,
        image: KushalSakhi,
        name: 'KUSHAL SAKHI',
        description: 'Empowering women through skill development and livelihood opportunities.',
        category: 'Women Empowerment',
    },
];

const categories = ['All', 'Education', 'Health & Wellbeing', 'Community Development', 'Women Empowerment', 'Environment', 'Art & Culture'];


const ProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredProjects = selectedCategory === 'All'
        ? projects
        : projects.filter((project) => project.category === selectedCategory);

    return (
        <div className="projects-page-container">
            <Navbar />
            <PageHeader pageName="Our Programs" breadcrumb="Home/Our Programs" />

            <div className="content-wrapper">
                <div className="category-bar">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                            {selectedCategory === category && <span className="tick-mark">✓</span>}
                        </button>
                    ))}
                </div>

                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="project-grid-item">
                            <ProjectTile
                                image={project.image}
                                name={project.name}
                                description={project.description}
                                redirectPath={`/project/${project.id}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProjectsPage;