import React, { useEffect, useState } from 'react';  
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageHeader from '../Components/PageHeader';
import '../Styles/ContactUs.css';
import Partner from "../Components/Partner";
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
import Partner2 from '../Images/Partner (2).png';
import Partner3 from '../Images/Partner (3).png';
import MentalWell from '../Images/MentalWell.jpg';
import Menstrual from '../Images/MenstrualHygiene.jpg';
import HealthCamp from '../Images/HealthCamp.jpg';
import Partnerships from '../Components/Partnerships';
import Quotes from '../Components/Quotes';
import PartnerWithUs from '../Components/PartnerWithUs';
const partnershipsPageLogos = [
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
  
  const partnershipsPageLogoLinks = [
    "2", // Will scroll to #social-protection
    "3",    // Will scroll to #women-training
    "4"   // Will scroll to #mental-wellbeing
  ];
const PartnershipsPage = () => {
  const[logoLinks,setlogoLinks]=useState([]);
    const partnersData = [

      // Add Partnerships here
      // {
      //   id:1,  
      //   heading: "Project Baala",
      //   imageSrc: Partner1,
      //   subheading: "Back to the future: Quality education through respect, commitment and accountability",
      //   description: "At Ishya, we strongly believe education is that one key that can open many doors for the youth of India. Education combined with the right skill set can prove to be the gateway for better prospects."
      // },
      {
        id:2,  
        heading: "Social Protection Scheme training",
        imageSrc: Partner2,
        subheading: "Empowering Communities Through Awareness of Social Protection Schemes",
        description: "On April 27th, lawyer Ms. Ritu Mehra conducted an enlightening session at the Ishya Learning Centre, empowering residents of Chhalera Village and nearby slums with knowledge about social protection schemes. A total of 53 community members attended the session, gaining crucial insights into programs designed to provide essential support and assistance."
      },
      {   
        id:3,
        heading: "Women interface training session with NCUI & ISRA",
        imageSrc: Partner3,
        subheading: "Empowering women through training sessions",
        description: "On April 27th, lawyer Ms. Ritu Mehra conducted an enlightening session at the Ishya Learning Centre, empowering residents of Chhalera Village and nearby slums with knowledge about social protection schemes. A total of 53 community members attended the session, gaining crucial insights into programs designed to provide essential support and assistance."
      },
      {   
        id:4,
        heading: "Mental Wellbeing",
        imageSrc: MentalWell,
        subheading: "Empowering Communities by spreading awareness about Mental Wellbeing",
        description: "We believe that mental wellbeing is integral to living a healthy life. But mental well-being sometimes does not get due importance as the problem does not get manifested in clear terms. Driven by the aim of providing holistic medical care, the Ishya Foundation has taken up and executed many projects in the ﬁeld of mental wellbeing."
      },
      {   
        id:5,
        heading: "Workshop on Women Hygiene & Sanitation in association with Project Baala.",
        imageSrc: Menstrual,
        subheading: "Empowering women by spreading awareness anout hygiene",
        description: "Menstrual hygiene is one subject that we do not discuss openly; rather, a stigma is attached to it. To dispel myths surrounding it and ensure that women from underprivileged sections adopt good hygiene practices, we took various steps. Workshop on Women Hygiene & Sanitation in association with Project Baala.We organized a menstrual hygiene session at Chhalera Bagh and successfully empowered 100 women and young girls with essential knowledge, skills, and resources. By promoting sustainable practices and providing reusable pads, we contributed to a healthier and more environmentally conscious community."
      },
      {   
        id:6,
        heading: "Ishya foundation hosted a Q&A featuring Dr. Rakesh Rai Sapra, Director of Cardiology at Marengo Asia Hospital",
        imageSrc: HealthCamp,
        subheading: "Empowering Communities Through Awareness of Social Protection Schemes",
        description: "One of the requisites required to live a fulﬁlling life is one’s health and well-being. Of all the forms of inequality, injustice in health is the most shocking and inhuman. Being healthy should not be considered a privilege; rather, it should be the norm. At the Ishya Foundation, we understand the importance of health and well-being fully. Sometimes the lack of health and well-being stems from a lack of resources, and sometimes it is because of ignorance mixed with age-old superstitions. And we work on both aspects—we regularly organise health camps and also conduct awareness programs on various health and wellness issues. Along with, we also pitch in with services that help in enhancing lifestyles. We are driven by the aim of making health and wellness accessible to all and creating a society that’s strong from within. On the following pages, you’ll ﬁnd some of the projects we have executed to this effect. We have been organising health camps regularly on a quarterly and half-yearly basis where we reach out to people with limited access to resources. One such camp was organised at the Ishya Learning Centre with the support of Yatharth Hospital. The camp provided comprehensive health assessments directly to the community, with a special focus on promoting preventive healthcare.",
      },
      // {   
      //   id:7,
      //   heading: "Women interface training session with NCUI & ISRA",
      //   imageSrc: Partner3,
      //   subheading: "Empowering Communities Through Awareness of Social Protection Schemes",
      //   description: "On April 27th, lawyer Ms. Ritu Mehra conducted an enlightening session at the Ishya Learning Centre, empowering residents of Chhalera Village and nearby slums with knowledge about social protection schemes. A total of 53 community members attended the session, gaining crucial insights into programs designed to provide essential support and assistance."
      // },
    ];
    useEffect(()=>{
      let tempLinks=[];
      partnersData.forEach((data,index)=>{
        tempLinks.push(data.id?.toString());
      })
      setlogoLinks(tempLinks);
    },[])
  
    return (
      <div>
        <Navbar />
        <PageHeader pageName="Partnerships" breadcrumb="Home/Partnerships" />
  
        {/* ✅ Corrected: Mapping through partnersData */}
        <div className="partners-list">
        {partnersData.map((partner,index) => (
          <Partner 
            id={partner.id}  
            heading={partner.heading}
            imageSrc={partner.imageSrc}
            subheading={partner.subheading}
            description={partner.description}
          />
        ))}
      </div>
      <Quotes 
      quote= "No act of kindness, no matter how small, is ever wasted. - Aesop"
      />
      <PartnerWithUs/>
      <Partnerships logos={partnershipsPageLogos} logoLinks={partnershipsPageLogoLinks} />;
      <Footer />
      </div>
    );
  };
  
  export default PartnershipsPage;