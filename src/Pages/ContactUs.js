import { React, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FAQComponent from "../Components/Faq";
import PageHeader from "../Components/PageHeader";
import "../Styles/ContactUs.css";
import Map from "../Images/BasemapImage.png";
import IshyaEntrance from "../Images/IshyaEntrance.png";
import QrImage from "../Images/qr-code.png";
import Quotes from "../Components/Quotes";

const ContactUs = () => {
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
      const response = await axios.post(
        "http://localhost:3001/contact",
        formData,
      );
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
      <Navbar />
      <PageHeader pageName="Contact Us" breadcrumb="Home / Contact Us" />

      <div className="contact-us-head">
        <h1>We'd Love to Hear From You</h1>
      </div>

      <div className="contact-container">
        <div className="location-section">
          {/* Clickable Map Image with Zoom-in Effect */}
          <a
            href="https://maps.app.goo.gl/rEFsj8ygSYjvvdCc9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Map}
              alt="Map Location"
              className="location-image zoom-hover"
            />
          </a>
        </div>

        <div className="address-section">
          <h3 className="sub-heading">Address</h3>
          <div className="address-details">
            <div className="address-item">
              <p>
                <strong>Registered address:-</strong> <br />
                Ishya Foundation, 904, 9th Floor, Surya Kiran Building, K.G.
                Marg, Connaught Place, Delhi – 110001
              </p>
              <p>
                <strong>ISHYA Learning Center 1:- </strong> <br />
                2B, Chhalera, Sector - 44, Noida, 201303
              </p>
              <p>
                <strong>ISHYA Learning Center 2:- </strong> <br />
                73B, khizarabad, Friends Colony East, Jamia Nagar, New Friends
                Colony, Delhi – 110025
              </p>
            </div>

            <div className="address-item">
              <h3 className="sub-heading">Phone No.:</h3>
              <p>
                <a
                  href="tel:9871005650"
                  className="zoom-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 9871005650
                </a>
              </p>
            </div>
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
                  <img src={QrImage} alt="QR" width={100} />
                </a>
              </p>
            </div>

            {/* Clickable Email */}
            <div className="address-item">
              <h3 className="sub-heading">Email:</h3>
              <p>
                <a href="mailto:contact_us@ishya.co.in" className="zoom-hover">
                  contact_us@ishya.co.in
                </a>
              </p>
              <p>
                <a href="mailto:admin@ishya.co.in" className="zoom-hover">
                  admin@ishya.co.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="form-content">
          <h3 className="form-subheading">Get in Touch</h3>
          <h2 className="form-heading">Send Us a Message</h2>
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

        <div className="form-image-section">
          {/* Clickable Image with Zoom-in Effect */}
          <a
            href="https://goo.gl/maps/your-location"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={IshyaEntrance}
              alt="Form Decoration"
              className="form-image zoom-hover"
            />
          </a>
        </div>
      </div>

      <Quotes quote="Help others without any reason and give without the expectation of receiving anything in return. - Roy T. Bennett" />
      <FAQComponent />
      <Footer />
    </div>
  );
};

export default ContactUs;
