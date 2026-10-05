import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

import BannerSection from "../components/BannerSection";
import AboutSection from "../components/AboutSection";
import FeatureSection from "../components/FeatureSection";
import ValueSection from "../components/ValueSection";
import FounderSection from "../components/FounderSection";
import TeamSection from "../components/TeamSection";

const AboutPage = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pageId, setPageId] = useState(0);

  const [pageBanner, setPageBanner] = useState(
    [ {
      id: 0,
      pageId,
      type: "",
      fileUrl: "",
    }]
  );
  const [pageAbout, setPageAbout] = useState(
    {
      title: "",
      title2: "",
      title3: "",
      remarks: "",
      fileUrl1: "", fileUrlTxt1: "",
      fileUrl2: "", fileUrlTxt2: "",
      tagTitle1: "", tagDescription1: "",
      tagTitle2:"",  tagDescription2: "",
    }
  );
  const [PageFounder, setPageFounder] = useState(
    {
      title: "",
      name1: "",
      designation1: "",
      name2: "",
      designation2: "",
      fileUrl1: "", 
      fileUrl2: "", 
      remarks: "",
    }
  );

  const initialFormData = {
    pageData: {},
    banner:pageBanner,
    about: pageAbout,
    feature: {
      items: []
    },
    founder: PageFounder,
    team: {
        items: []
    },

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
    fetchAboutPage();
  }, []);

  
  const fetchAboutPage = async () => {
      setIsLoading(true);

    await axiosInstance.get(`/page/about`)
			.then((response) => {
        setIsLoading(false)
            if (response.data.status == "success") {
                const pageData = response.data?.data?.[0];
                console.log('pageData>>> ', pageData, response.data); 
                
                const id = pageData?.id || 0;
                console.log('id >>', id);
                setPageId(id);

                setFormData({
                    pageData: pageData,
                    banner: pageData?.PageBanners || [],
                    about: pageData?.PageAbouts || pageAbout,
                    founder: pageData?.PageFounders || PageFounder,
                    feature: {
                        items: pageData?.PageValues || []
                    },
                    team: {
                        items: pageData?.PageTeams || []
                    },
                    });
            	}
			}).catch((error) => {
        // console.log('>>> ', error.status, error);
        if(error.status === 403){
          handleLogout();
        }
        setIsLoading(false)
      });
  };

  const handleSectionChange = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value,
    }));
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
          <h4>About Page CMS</h4>
          <p className="text-muted mb-0">
            Manage aboutpage content and sections
          </p>
        </div>

        {/* <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Home Page"}
        </Button> */}
      </div>

      <Accordion defaultActiveKey="0">

        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Section 1 - Banner
          </Accordion.Header>

          <Accordion.Body>
            <BannerSection
              data={formData.banner}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("banner", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Section 2 - About
          </Accordion.Header>

          <Accordion.Body>
            <AboutSection
              data={formData.about}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("about", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>


        <Accordion.Item eventKey="2">
          <Accordion.Header>
            Section 3 - Our Values
          </Accordion.Header>

          <Accordion.Body>
            <ValueSection
              data={formData.feature}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("feature", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>
            Section 4 - Founder Section
          </Accordion.Header>

          <Accordion.Body>
            <FounderSection
              data={formData.founder}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("founder", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>
            Section 5 - Our Teams
          </Accordion.Header>

          <Accordion.Body>
            <TeamSection
              data={formData.team}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("team", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>


      </Accordion> 

      <div className="text-end mt-4"></div>

    </div>
  );
};

export default AboutPage;