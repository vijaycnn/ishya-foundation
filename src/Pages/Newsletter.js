import React from "react"; 
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/Newsletter.css";
import JanNewsletter from '../Images/Newsletters/Ishya’s January Newsletter (1).jpg';
import FebNewsletter from '../Images/Newsletters/Ishya Feb Newsletter.jpg';
import MarNewsletter from '../Images/Newsletters/Ishya March Newsletter.jpg';
import AprNewsletter from '../Images/Newsletters/Ishya April Newsletter.jpg';
import MayNewsletter from '../Images/Newsletters/Ishya May Newsletter.jpg';
import JuneNewsletter from '../Images/Newsletters/Ishya June Newsletter.jpg';
import JulyNewsletter from '../Images/Newsletters/Ishya July Newsletter.jpg';
import AugNewsletter from '../Images/Newsletters/Ishya August Newsletter.jpg';
import SeptNewsletter from '../Images/Newsletters/Ishya Sept Newsletter.jpg';
import OctNewsletter from '../Images/Newsletters/Ishya Oct Newsletter.jpg';
import NovNewsletter from '../Images/Newsletters/Ishya Nov Newsletter.jpg';
import DecemberNewsletter from '../Images/Newsletters/Ishya December Newsletter.jpg';
import Jan25Newsletter from '../Images/Newsletters/Ishya Jan25 Newsletter.jpg';

// Importing PDF files  
import JanPDF from "../Newsletters/Ishya’s January Newsletter.pdf";
import FebPDF from "../Newsletters/Ishya Feb Newsletter.pdf";
import MarPDF from "../Newsletters/Ishya March Newsletter.pdf";
import AprPDF from "../Newsletters/Ishya April Newsletter.pdf";
import MayPDF from "../Newsletters/Ishya May Newsletter.pdf";
import JunePDF from "../Newsletters/Ishya June Newsletter.pdf";
import JulyPDF from "../Newsletters/Ishya July Newsletter.pdf";
import AugPDF from "../Newsletters/Ishya August Newsletter.pdf";
import SeptPDF from "../Newsletters/Ishya Sept Newsletter.pdf";
import OctPDF from "../Newsletters/Ishya Oct Newsletter.pdf";
import NovPDF from "../Newsletters/Ishya Nov Newsletter.pdf";
import DecPDF from "../Newsletters/Ishya December Newsletter.pdf";
import Jan25PDF from "../Newsletters/Ishya Jan Newsletter.pdf";
import PageHeader from "../Components/PageHeader";
// Sample Newsletter Data
const newsletters = [
  {
    id: 1,
    title: "Ishya Foundation exands with new learning centre in Khizrabad, New Delhi",
    description: "Ishya Foundation is excited to announce the opening of a new branch",
    date: "Jan, 2025",
    image: Jan25Newsletter,
    pdf: Jan25PDF, // Add the PDF path
  },
  {
    id: 2,
    title: "Succesfully launched Project Udaan raising funds for education of 15 children",
    description: "The project aims to make formal education accessible",
    date: "Feb, 2024",
    image: FebNewsletter,
    pdf: FebPDF,
  },
  {
    id: 3,
    title: "Women's Day Celebration",
    description: "The women's day celebration on 4th March",
    date: "Mar, 2024",
    image: MarNewsletter,
    pdf: MarPDF, // Add the PDF path
  },
  {
    id: 4,
    title: "Community awareness session on Social Protection Scheme",
    description: "On Aril 27th, lawyer Miss Ritu Mehra hosted an educational session",
    date: "April, 2024",
    image: AprNewsletter,
    pdf: AprPDF,
  },
  {
    id: 5,
    title: "Raised awareness on substance abuse through street play",
    description: "On May 20th, in collaboration with 'I Can Do It'",
    date: "May, 2024",
    image: MayNewsletter,
    pdf: MayPDF, // Add the PDF path
  },
  {
    id: 6,
    title: "Environment Day Celebration",
    description: "We celebrated world environment day",
    date: "June, 2024",
    image: JuneNewsletter,
    pdf: JunePDF,
  },
  {
    id: 7,
    title: "Sponsored education for 10 more children under Project Udaan",
    description: "We have successfully entrolled 10 children in phase 2",
    date: "July, 2024",
    image: JulyNewsletter,
    pdf: JulyPDF, // Add the PDF path
  },
  {
    id: 8,
    title: "70th Independence Day Celebration at ILC-Noida",
    description: "Ishya foundation celebrated independence day",
    date: "Aug, 2024",
    image: AugNewsletter,
    pdf: AugPDF,
  },
  {
    id: 9,
    title: "Celebrating Teachers' Day: A day of joy and togetherness",
    description: "This teachers' day, our children came together to honour their educators",
    date: "Sept, 2024",
    image: SeptNewsletter,
    pdf: SeptPDF, // Add the PDF path
  },
  {
    id: 10,
    title: "Ishya Haat-Stalls at Annual Day Function",
    description: "At the Annual Day, there was Ishya Haat, featuring 8 stalls",
    date: "Oct, 2024",
    image: OctNewsletter,
    pdf: OctPDF,
  },
  {
    id: 11,
    title: "Ishya Foundation's 3-year milestone recieves widespread media coverage",
    description: "We are delighted to share that Ishya Foundation's celebration of",
    date: "Nov, 2024",
    image: NovNewsletter,
    pdf: NovPDF, // Add the PDF path
  },
  {
    id: 12,
    title: "Organized Aadhar Camp update on 16th and 17th December, 2024",
    description: "Ishya Foundation successfully organized an Aadhar Camp",
    date: "Dec, 2024",
    image: DecemberNewsletter,
    pdf: DecPDF, // Add the PDF path
  },
  {
    id: 13,
    title: "Coaching for football team to promote the participation of girls in sports",
    description: "Ishya Foundation has formed a girls football team...",
    date: "Jan, 2024",
    image: JanNewsletter,
    pdf: JanPDF,
  },
];

const NewslettersPage = () => {
  return (
    <>
      <Navbar />
      <PageHeader pageName="Newsletters" breadcrumb="Home/Newsletters" />
      <div className="newsletter-container">
        <h3 className="newsletter-subtitle">
          Stay updated with our latest initiatives, projects, and impact stories.
        </h3>

        <div className="newsletter-list">
          {newsletters.map((newsletter) => (
            <div key={newsletter.id} className="newsletter-card">
              <img
                src={newsletter.image}
                alt={newsletter.title}
                className="newsletter-image"
                loading="lazy"
              />
              <div className="newsletter-content">
                <h3 className="newsletter-heading">{newsletter.title}</h3>
                <p className="newsletter-description">{newsletter.description} [...]</p>
                <div className="newsletter-footer">
                  <span className="newsletter-date">{newsletter.date}</span>
                  {/* Download PDF on button click */}
                  <a href={newsletter.pdf} download className="newsletter-button">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewslettersPage;
