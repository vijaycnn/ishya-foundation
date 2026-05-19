import React, { useState, useEffect } from 'react';
import '../Styles/SubscribePopup.css';

const SubscribePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem("hasSeenPopup", "true");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before request
  
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Subscribed!');
        setIsSubscribed(true);
        setEmail(''); // Clear input after success
      } else {
        console.log('data.error:', data);
        console.log('data.error.message:', data.error && data.error.message);
        setMessage(data.error && data.error.message ? data.error.message : 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setMessage('Error connecting to server. Try again later.');
    }
  };

  if (!showPopup) return null;

  return (
    <div className="modern-subscribe-popup">
      <div className="modern-popup-content">
        {isSubscribed ? (
          <div className="modern-subscription-success">
            <p>Subscribed: <span role="img" aria-label="tick">✔️</span></p>
            <button className="modern-close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <span className="modern-close-btn" onClick={handleClose}>
              &times;
            </span>
            <div className="modern-popup-header">
              <h2>Subscribe to Our Newsletter</h2>
              <p>Stay updated with our latest news and offers.</p>
            </div>
            <form onSubmit={handleSubscribe} className="modern-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button type="submit" className="modern-subscribe-btn">
                Subscribe
              </button>
            </form>
            {message && <p className="modern-message">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribePopup;
