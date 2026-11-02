"use client";

import React, { useEffect, useState } from 'react';
import PageHeader from '../Components/PageHeader';
import '../Styles/ContactUs.css';

import PartnerBlogs from "../Components/Partner";
import Quotes from '../Components/Quotes';
import PartnerWithUs from '../Components/PartnerWithUs';
import Partners from "@/Components/home/Partners";
// import Partnerships from '../Components/Partnerships';

const PartnershipsPage = ({data}) => {

  // const[logoLinks,setlogoLinks]=useState([]);
  const partnersData = data.PartnershipBlogs || [];

    // useEffect(()=>{
    //   let tempLinks=[];
    //   partnersData.forEach((data,index)=>{
    //     tempLinks.push(data.id?.toString());
    //   })
    //   setlogoLinks(tempLinks);
    // },[])
  
    return (
      <div>
        <PageHeader pageName="Partnerships" breadcrumb="Home/Partnerships" />
  
        <div className="partners-list">
          {partnersData.map((partner) => (
            <PartnerBlogs 
              key={partner.id}
              id={partner.id}  
              heading={partner.title}
              imageSrc={partner.fileViewUrl}
              subheading=""
              description={partner.remarks}
            />
          ))}
        </div>
      <Quotes quote={data?.impactHeading} />
      <PartnerWithUs contactData={data?.PartnershipContacts} contactRemarks={data?.remarks}/>
      
      <Partners data={data?.partners} />
      </div>
    );
  };
  
  export default PartnershipsPage;