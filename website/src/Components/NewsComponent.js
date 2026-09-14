"use client";

import media from "@/lib/media";
import React from "react";
import "../Styles/NewsComponent.css"; // Import the CSS file
import newspaper from "../Images/newsPaper.png"; // Overlapping image
import newspaper1 from "../Images/News/News (1).png"; // Overlapping image
import newspaper2 from "../Images/News/News (2).png"; // Overlapping image
import newspaper3 from "../Images/News/News (3).png"; // Overlapping image
import newspaper4 from "../Images/News/News (4).png"; // Overlapping image
import newspaper5 from "../Images/News/News (5).png"; // Overlapping image
import newspaper6 from "../Images/News/News (6).png"; // Overlapping image
import newspaper7 from "../Images/News/News (7).png"; // Overlapping image
import newspaper8 from "../Images/News/News (8).png"; // Overlapping image
import newspaper9 from "../Images/News/News (9).png"; // Overlapping image
import newspaper10 from "../Images/News/News (10).png"; // Overlapping image
import newspaper11 from "../Images/News/News (11).png"; // Overlapping image
import newspaper20 from "../Images/News/News (20).png"; // Overlapping image

const newsData = [
  {
    id: 1,
    image: newspaper1,
    name: "The Daily Times",
    description: "What would you tell your younger self about menstruation?According to a study, 71% of India’s menstruating population is unaware of what periods are until they get it themselves. It’s time to stop the hush-hush talks around Periods and make everyone (especially younger girls) aware so that they know what to expect and how to react instead of panicked confusion. Let’s take an initiative and start talking about your experience when you got your first period...",
    date: "Feb 14, 2025",
  },
  {
    id: 2,
    image: newspaper2,
    name: "Providing various basic amenities to facilitate online education",
    description: "Ishya Foundation is providing various basic amenities like Speakers, computers, 5G cables, counters and dongles to facilitate online education. Beyond that they have provided uniforms, school bags, ID cards and other important stuff needed. Children are required to empower with the quality education and the knowledge that can be applied in their real life...",
    date: "Feb 13, 2025",
  },
  {
    id: 3,
    image: newspaper3,
    name: "Finding the level of education being provided in rural government schools",
    description: "We try to enable the kids of these schools for future so that they can obtain employment in a variety of settings and eventually becoming self-sufficient and financially secure. While the education system in urban areas is not in a top shape as well, it is the rural education scenario which is the benchmark of a country’s progress...",
    date: "Feb 12, 2025",
  },
  {
    id: 4,
    image: newspaper4,
    name: "Improving quality Education",
    description: "Ishya foundation is acting as a bridge between passionate volunteers and underprivileged children in rural India to improve their quality of education through technology.    ..",
    date: "Feb 11, 2025",
  },
  {
    id: 5,
    image: newspaper5,
    name: "Morning Herald",
    description: "Sports highlights and major league updates...",
    date: "Feb 11, 2025",
  },
  {
    id: 6,
    image: newspaper6,
    name: "Morning Herald",
    description: "Sports highlights and major league updates...",
    date: "Feb 11, 2025",
  },
  {
    id: 7,
    image: newspaper7,
    name: "Finding the level of education being provided in rural government schools",
    description: "We try to enable the kids of these schools for future so that they can obtain employment in a variety of settings and eventually becoming self-sufficient and financially secure. While the education system in urban areas is not in a top shape as well, it is the rural education scenario which is the benchmark of a country’s progress...",
    date: "Feb 11, 2025",
  },
  
  {
    id: 9,
    image: newspaper9,
    name: "Donated tricycles to soldiers in need",
    description: "We at Ishya Foundation are honored to have donated tricycles to soldiers in need, and we want to express our sincere gratitude to everyone who supported us in achieving this goal. Your unwavering support has been invaluable, and we are proud to have made a meaningful difference in the lives of those who have bravely served our country. We are committed to continuing our efforts to create a positive impact, and we hope that you will continue to stand with us in this important work...",
    date: "Feb 11, 2025",
  },
  {
    id: 10,
    image: newspaper10,
    name: "Morning Herald",
    description: "Sports highlights and major league updates...",
    date: "Feb 11, 2025",
  },
  {
    id: 11,
    image: newspaper11,
    name: "Workshop on menstrual hygiene by our Founder",
    description: "We conducted a workshop on menstrual hygiene to create awareness among our girls about their body. We discussed about Menstruation Cycle and how to maintain hygienic practices. Since menstrual education is not a part of curriculum in rural schools, many girls have no proper education on how the reproductive system works. We helped them understand their own bodies and it’s functions so that they feel confident. We can’t thank @simplysuparnaa for enough for the lovely session...",
    date: "Feb 11, 2025",
  },
  {
    id: 12,
    image: newspaper20,
    name: "District Level Tournament Championship",
    description: " Victory! 🎉 Our talented football team from GSSS Chula has brought home the District Level Tournament Championship Trophy in the District Kotputli-Behror! 🏆 This incredible achievement is a testament to their hard work, dedication, and the unwavering support of our Ishya Foundation family....",
    date: "Feb 11, 2025",
  },

];

const NewsComponent = () => {
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
        {newsData.map((news) => (
          <div key={news.id} className="news-box">
            <img src={media(news.image)} alt={news.name} className="news-image" loading="lazy"/>
            <div className="news-content">
              <h3 className="news-heading">{news.name}</h3>
              <p className="news-description">{news.description} [...]</p>
              <div className="news-footer">
                <span className="news-date">
                  <i className="fa fa-calendar calendar-icon"></i> {news.date}
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
