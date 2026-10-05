import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

import ContactSection from "../components/ContactSection";;

const ContactPage = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
      title: "",
      mapFileUrl: "",
      contactNumber: "", watsappFileUrl: "", email : "",
      addressTitle1: "", address1: "", location1: "",
      addressTitle2: "", address2: "", location2: "",
      addressTitle3: "", address3: "", location3: "",      
      heading: "",
      formTitle: "", formHeading: "", formFileUrl: "",
      faqTitle: "", faqHeading: "", faqFileUrl: "",
    };
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isEdit, setIsEdit] = useState(false);


  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };

  useEffect(() => {
    fetchContactPage();
  }, []);

  
  const fetchContactPage = async () => {
      setIsLoading(true);

    await axiosInstance.get(`/contactus/getPageData`)
			.then((response) => {
        setIsLoading(false)
            if (response.data.status == "success") {
                const pageData = response.data?.data?.[0];
                console.log('pageData>>> ', pageData, response.data); 
                
                setFormData(pageData);
            	}
			}).catch((error) => {
        // console.log('>>> ', error.status, error);
        if(error.status === 403){
          handleLogout();
        }
        setIsLoading(false)
      });
  };

  // const handleSectionChange = (section, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [section]: value,
  //   }));
  // };
  const handleSectionChange = (value) => {
      setFormData(value);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>Contact Page CMS</h4>
          <p className="text-muted mb-0">
            Manage contactpage content
          </p>
        </div>
      </div>

        <ContactSection data={formData} onChange={handleSectionChange} />

    </div>
  );
};

export default ContactPage;