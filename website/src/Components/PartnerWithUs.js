"use client";

import media from "@/lib/media";
import React from 'react'; 
import '../Styles/PartnerWithUs.css';

const PartnerWithUs = ({contactData, contactRemarks}) => {

  return (
    <div className="partner-us-container">
      {              
        (contactRemarks) ?
        <>
        <div dangerouslySetInnerHTML={{ __html: contactRemarks || "" }} />
        </>: ''
      } 
      <div className="partner-us-tiles">
        {contactData.map((option) => (
          <a 
            key={option.id} 
            href={option.link} 
            className="partner-us-tile"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={media(option.fileViewUrl)} alt={option.title} className="partner-us-logo" loading="lazy"/>
            <h3 className="tile-heading">{option.title}</h3>

            {              
              (option.remarks) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: option.remarks || "" }} />
              </>: ''
            }
          </a>
        ))}
      </div>
    </div>
  );
};

export default PartnerWithUs;
