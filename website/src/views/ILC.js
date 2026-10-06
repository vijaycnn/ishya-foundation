"use client";

import media from "@/lib/media";
import React from "react";
import "../Styles/ILC.css";

import PageHeader from "../Components/PageHeader";

const ILC = ( {pageData }) => {
  return (
    <div className="ilc-container">
      
      <PageHeader pageName="Ishya Learning Centre" breadcrumb="Home/Ishya Learning Centre" />
      {Array.isArray(pageData) &&
        pageData.map((item, index) => (
        <section className="ilc-section womens-day" key={item.id}>
          <div className="ilc-content">
            <h2>{item.title}</h2>
            {              
              (item.remark1) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: item.remark1 || "" }} />
              </>: ''
            }
          </div>
          <div className="ilc-image">
            <img src={media(item.image)} alt={item.title} loading="lazy" />
          </div>
        </section>
        ))
      }
    </div>
  );
};

export default ILC;
