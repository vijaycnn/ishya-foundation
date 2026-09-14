"use client";

import media from "@/lib/media";
import React, { useState } from "react";
import "../Styles/Footer.css";
import Logo from "../Images/IshyaLogo.png";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before request

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you for subscribing!");
        setEmail(""); // Clear input after success
      } else {
        setMessage(
          data.error.message || "Subscription failed. Please try again.",
        );
      }
    } catch (error) {
      setMessage("Error connecting to server. Try again later.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo and Text */}
        <div className="footer-column">
          <div className="footer-logo">
            <Link href="/">
              <img src={media(Logo)} alt="Logo" style={{ width: "100px" }} />
            </Link>
          </div>
          <p className="footer-text">
            Ishya Foundation empowers underprivileged children and women in
            Delhi through education. We believe education unlocks a brighter
            future, and that’s why we provide high-quality learning experiences,
            life skills training, and leadership development programs. Join us
            in building a future where every child and woman thrives.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about-us">About Us</a>
            </li>
            <li>
              <a href="/blogs">Blog</a>
            </li>
            <li>
              <a href="/gallery">Photo Gallery</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Get in Touch */}
        <div className="footer-column">
          <h4>Get in Touch</h4>
          <ul className="footer-links">
            <li>
              <a href="contactus">Contact Us</a>
            </li>
            <li>
              <a href="donate" className="donate-now">
                Donate Now
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Address */}
        <div className="footer-column footer-address">
          <h4>Address</h4>
          <p>
            <strong>Registered address:-</strong> <br />
            Ishya Foundation, 904, 9th Floor, Surya Kiran Building, K.G. Marg,
            Connaught Place, Delhi – 110001
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

        {/* Column 5: Newsletter */}
        <div className="footer-column">
          <h4>Newsletter</h4>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
          {message && <p className="footer-note">{message}</p>}

          <h4>Follow Us</h4>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/ishya.foundation"
              className="icon"
            >
              FB
            </a>
            <a
              href="https://www.instagram.com/ishya_foundation/"
              className="icon"
            >
              IG
            </a>
            <a
              href="https://www.linkedin.com/company/ishya-foundation/"
              className="icon"
            >
              LI
            </a>
            <a
              href="https://www.youtube.com/@ishyafoundation329"
              className="icon"
            >
              YT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
