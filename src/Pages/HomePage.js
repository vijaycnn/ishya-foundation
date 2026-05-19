import React, { useEffect, useState } from 'react'; 
import '../Styles/Homepage.css'; // Import the external CSS file
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Testimonial from '../Components/Testimonials';
import Partnerships from '../Components/Partnerships';
import careerForteLogo from '../Images/PartnersLogo/CareerForte.png';
import chadhachadha from '../Images/PartnersLogo/Chadha&Chadha.png';
import projectBala from '../Images/PartnersLogo/ProjectBala.png';
import essci from '../Images/PartnersLogo/ESSCI.png';
import giveIndia from '../Images/PartnersLogo/GiveIndia.png';
import GovtofJK from '../Images/PartnersLogo/GovtofJammuKashmir.png';
import HeadspaceHealing from '../Images/PartnersLogo/HeadspaceHealing.png';
import iCanDoIt from '../Images/PartnersLogo/ICanDoIt.png';
import katha from '../Images/PartnersLogo/Katha.png';
import nsdc from '../Images/PartnersLogo/NSDC.png';
import qrg from '../Images/PartnersLogo/QRG.png';
import sambhavna from '../Images/PartnersLogo/Sambhavna.png';
import simplySuparna from '../Images/PartnersLogo/SimplySuparna.png';
import yuno from '../Images/PartnersLogo/YUNO.png';
import vishramVridhAshramSheows from '../Images/PartnersLogo/VishramVridhAshramSheows.png';
import salaamBaalakTrust from '../Images/PartnersLogo/SalaamBaalakTrust.png';
import marengoAsiaHospital from '../Images/PartnersLogo/MarengoAsiaHospital.png';
import ministryofHAFW from '../Images/PartnersLogo/MinistryofHAFW.png';
import KasturbaGandhiBalikaVidyalaya from '../Images/PartnersLogo/KasturbaGandhiBalikaVidyalaya.png';
import Ishyagif from '../Images/IshyaWebsite.gif';
import LatestProjects from '../Components/Projects';
import FooterCreative from '../Images/FooterCreative.png';
import MissionVision from '../Components/MissionVision';
import AreasCoveredComponent from '../Components/AreasCovered';
import FloatingWhatsAppButton from '../Components/FloatingWhatsappButton';
import ZigZagSection from '../Components/ZigZagSection';
import Beneficiaries from '../Components/Beneficiaries';
import { Link } from 'react-router-dom';
import { partnersData } from './PartnersData';

const partners = [
  projectBala,
  qrg,
  yuno,
  nsdc,
  essci,
  careerForteLogo,
  simplySuparna,
  ministryofHAFW,
  KasturbaGandhiBalikaVidyalaya,
  vishramVridhAshramSheows,
  HeadspaceHealing,
  GovtofJK,
  chadhachadha,
  sambhavna,
  marengoAsiaHospital,
  salaamBaalakTrust,
  iCanDoIt,
  katha,
  giveIndia
  
];
const homepageLogoLinks = [
  "2", // Will scroll to #social-protection
  "3",    // Will scroll to #women-training
  "4"   // Will scroll to #mental-wellbeing
];

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="join-us-button">
        <Link to="/joinus">
        <button>Join Us</button>
        </Link>
        </div>
      </div>
      <FloatingWhatsAppButton phoneNumber="+919871005650" message="Hello! I need some help." /> {/* Use the component */}
      <MissionVision/>
      <AreasCoveredComponent/>
      <LatestProjects/>
      <Testimonial/>

      <div className="gif-section">
        <img
          src={Ishyagif} // Display the GIF
          alt="Hero GIF"
          className="hero-gif"
        />
      </div>
      <ZigZagSection/>
      <Partnerships logos={partners} logoLinks={homepageLogoLinks}/>
      
      <Beneficiaries/>
      <div className="footer-creative-container">
      <img src={FooterCreative} alt="FooterCreative" className="footer-creative" />
      </div>
      <Footer/>
    </div>
  );
};

export default HomePage;
