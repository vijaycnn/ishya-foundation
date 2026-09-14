"use client";

import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const ATGDetails = () => {
  return (
    <>
    <Navbar/>
    <div style={{ textAlign: 'center', padding: '20px',marginTop: '100px' }}>
      <h2>ATG Details</h2>
      <iframe 
        src="/Documents/80G-New-till-AY26-27-Ishya Foundation (2).pdf"
        width="70%" 
        height="600px" 
        title="Donation Details"
        style={{ border: "none" }}
      ></iframe>
    </div>
    <Footer/>
    </>
  );
};

export default ATGDetails;
