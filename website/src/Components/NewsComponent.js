"use client";

import media from "@/lib/media";
import { formatDate } from "@/utils/dateFormat";
import React from "react";
import "../Styles/NewsComponent.css"; // Import the CSS file
import newspaper from "../Images/newsPaper.png"; // Overlapping image

const NewsComponent = ({pageData}) => {

  return (
    <>
      {/* Centered Circle with Overlapping Image */}
      <div className="circle-container-news">
        <div className="circle-news"></div>
        <img src={media(newspaper)} alt="Icon" className="circle-image" loading="lazy"/>
      </div>

      {/* News Articles in Two Columns */}
      <div className="news-container">
      <div className="news-list">
        {
          Array.isArray(pageData) &&
          pageData.map((news) => (
          <div key={news.id} className="news-box">
            <img src={media(news.image)} alt={news.title} className="news-image" loading="lazy"/>
            <div className="news-content">
              <h3 className="news-heading">{news.title}</h3>
              {/* <p className="news-description">{news.description} [...]</p> */}
              {              
                (news.remark1) ?
                <>
                <div dangerouslySetInnerHTML={{ __html: news.remark1 || "" }} />
                </>: ''
              }
              <div className="news-footer">
                <span className="news-date">
                  <i className="fa fa-calendar calendar-icon"></i> {formatDate(news.createdAt)}
                </span>
                <button className="news-button">Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default NewsComponent;
