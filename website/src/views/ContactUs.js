"use client";

import media from "@/lib/media";
import { React, useState } from "react";
import axios from "axios";
import FAQComponent from "../Components/Faq";
import PageHeader from "../Components/PageHeader";
import "../Styles/ContactUs.css";
import Quotes from "../Components/Quotes";

const ContactUs = ( {data}) => {

  const emailList = data?.email ? data.email.split(",").map(email => email.trim()).filter(Boolean) : [];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate name and phone number
  const validateForm = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (
      !nameRegex.test(formData.first_name) ||
      !nameRegex.test(formData.last_name)
    ) {
      setErrorMessage("Name cannot contain numbers.");
      return false;
    }
    if (!phoneRegex.test(formData.phone_number)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return false;
    }
    setErrorMessage(""); // Clear error if everything is fine
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3001/contact", formData,);
      setResponseMessage(response.data.message);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        message: "",
      });

      // Hide message after 10 seconds
      setTimeout(() => {
        setResponseMessage("");
      }, 5000);
    } catch (error) {
      setResponseMessage("Error submitting the form. Please try again.");
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <PageHeader pageName="Contact Us" breadcrumb="Home / Contact Us" />

      <div className="contact-us-head">
        <h1>{data?.title}</h1>
      </div>

      <div className="contact-container">
        {
          (data?.mapFileViewUrl) &&
          <div className="location-section">
            <img
            src={media(data?.mapFileViewUrl)}
            alt="Map Location"
            className="location-image zoom-hover"
            />
          </div>
        }

        <div className="address-section">
          <h3 className="sub-heading">Address</h3>
          <div className="address-details">
            <div className="address-item contact-address-item">
              <p>
                <strong>{data.addressTitle1}</strong> <br />
                {data.address1} <br />
                {
                  (data?.location1) &&
                  <>
                  <a
                    href={data?.location1}
                    className="map-btn"
                    target="_blank"
                    >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                      <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                    </svg>{" "}
                    View Map
                  </a>
                  </>
                }
              </p>
              {
                (data?.addressTitle2) &&
                <>                
                <p>
                  <strong>{data?.addressTitle2} </strong> <br />
                  {data?.address2}
                  <br />
                  {
                    (data?.location2) &&
                    <>
                  <a
                    href={data?.location2}
                    className="map-btn"
                    target="_blank"
                    >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                      <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                    </svg>{" "}
                    View Map
                  </a>
                    </>
                  }
                </p>
                </>
              }
              {
                (data?.addressTitle3) &&
                <>                
                <p>
                  <strong>{data?.addressTitle3}</strong> <br />
                  {data?.address3} <br />
                  {
                    (data?.location3) &&
                    <>
                  <a
                    href={data?.location3}
                    className="map-btn"
                    target="_blank"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                      <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                    </svg>{" "}
                    View Map
                  </a>
                    </>
                  }
                </p>
                </>
                }
            </div>
            {
              (data?.contactNumber) &&
              <>
            <div className="address-item">
              <h3 className="sub-heading">Phone No.:</h3>
              <p>
                <a
                  href={`tel:${data?.contactNumber}`}
                  className="zoom-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  {data?.contactNumber}
                </a>
              </p>
            </div>
              </>
            }
            {
              (data?.watsappFileViewUrl) &&
              <>              
              <div className="address-item">
                {/* Clickable WhatsApp Number */}
                <h3 className="sub-heading">WhatsApp:</h3>

                <p>
                  <a
                    href="https://wa.me/919876543210"
                    className="zoom-hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img src={media(data?.watsappFileViewUrl)} alt="QR" width={100} />
                  </a>
                </p>
              </div>
              </>
            }

            {/* Clickable Email */}
            {
              (data?.email) &&
              <>
              <div className="address-item">
                <h3 className="sub-heading">Email:</h3>              
                {
                  emailList.map((value) => {
                    const email = value.trim();

                    return (
                      <p key={email}>
                        <a href={`mailto:${email}`} className="zoom-hover">
                          {email}
                        </a>
                      </p>
                    );
                  })
                }
              </div>
              </>
            }
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="form-content">
          <h3 className="form-subheading">{data?.formTitle}</h3>
          <h2 className="form-heading">{data?.formHeading}</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+91"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="send-button">
              Send Message
            </button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {responseMessage && (
            <p className="response-message">{responseMessage}</p>
          )}
        </div>
          {
            (data?.formFileViewUrl) &&
            <>
              <div className="form-image-section">
                {/* Clickable Image with Zoom-in Effect */}
                <a
                  href="https://goo.gl/maps/your-location"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  <img
                    src={media(data?.formFileViewUrl)}
                    alt="Form Decoration"
                    className="form-image zoom-hover"
                    />
                </a>
              </div>
            </>
          }
      </div>

      <Quotes quote={data?.heading} />
      <FAQComponent data={data} faqs={data?.faqs} />
      {/* <Footer /> */}
    </div>
  );
};

export default ContactUs;
