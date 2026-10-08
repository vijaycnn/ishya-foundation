"use client";

import React from "react"; 
import media from "@/lib/media";
import "../Styles/Newsletter.css";
import PageHeader from "../Components/PageHeader";
import { getNewsletterDownloadUrl } from "@/lib/api";
import { formatDate } from "@/utils/dateFormat";

const NewslettersPage = ({pageData}) => {
  const newsletters = pageData;

  const handleDownload = async (id) => {
    try {
      const url = getNewsletterDownloadUrl(id);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `newsletter-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Download error:", error);
    }
  };
  return (
    <>
      <PageHeader pageName="Newsletters" breadcrumb="Home/Newsletters" />
      <div className="newsletter-container">
        <h3 className="newsletter-subtitle">
          Stay updated with our latest initiatives, projects, and impact stories.
        </h3>

        <div className="newsletter-list">
          {
            Array.isArray(newsletters) &&
            newsletters.map((newsletter) => (
            <div key={newsletter.id} className="newsletter-card">
              <img
                src={media(newsletter.image)}
                alt={newsletter.title}
                className="newsletter-image"
                loading="lazy"
              />
              <div className="newsletter-content">
                <h3 className="newsletter-heading">{newsletter.title}</h3>
                {              
                  (newsletter.remark1) ?
                  <>
                  <div dangerouslySetInnerHTML={{ __html: newsletter.remark1 || "" }} />
                  </>: ''
                }
                <div className="newsletter-footer">
                  <span className="newsletter-date">{formatDate(newsletter.createdAt)}</span>
                  {/* Download PDF on button click */}
                  {/* <a onClick={() => handleDownload(newsletter.id)} className="newsletter-button">
                    Read More
                  </a> */}

                  <button type="button" className="newsletter-button" onClick={() => handleDownload(newsletter.id)} >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewslettersPage;
