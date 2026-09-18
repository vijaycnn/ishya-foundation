import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

import BannerSection from "../components/BannerSection";
import AboutSection from "../components/AboutSection";
// import FootprintSection from "../components/FootprintSection";
// import ProjectSection from "./components/ProjectSection";
// import TestimonialSection from "./components/TestimonialSection";
// import VideoSection from "./components/VideoSection";
// import ZigZagSection from "./components/ZigZagSection";
// import PartnershipSection from "./components/PartnershipSection";
// import OtherSection from "./components/OtherSection";

const initialFormData = {
  banner:[ {
    title: "",
    subtitle: "",
    description: "",
    image: "",
    buttonText: "",
    buttonUrl: "",
  }],

  about: {
    title: "",
    subtitle: "",
    image1: "",
    image2: "",
    mission: {
      title: "Our Mission",
      description: "",
    },
    vision: {
      title: "Our Vision",
      description: "",
    },
  },

  footprints: {
    title: "",
    description: "",
    mapImage: "",
  },

  projects: {
    projectIds: [],
  },

  testimonials: {
      mode: "latest",
      limit: 3,
      testimonialIds: []
  },

  video: {
    videoUrl: "",
  },

  zigZag: [],

  partnerships: [],

  other: [],
};

const HomePage = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
    fetchHomePage();
  }, []);

  
  const fetchHomePage = async () => {
      setIsLoading(true);

    await axiosInstance.get(`/page/home`)
			.then((response) => {
        console.log('>>> ', response.data);
				setIsLoading(false)
				if (response.data.status === "success") {
					setItems(response.data?.data)	
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

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
      };

      console.log("CMS Payload:", payload);

      if (isEdit) {
        // await updateHomePage(payload);
      } else {
        // await createHomePage(payload);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
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
          <h4>Home Page CMS</h4>
          <p className="text-muted mb-0">
            Manage homepage content and sections
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Home Page"}
        </Button>
      </div>

      <Accordion defaultActiveKey="0">

        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Section 1 - Banner
          </Accordion.Header>

          <Accordion.Body>
            <BannerSection
              data={formData.banner}
              onChange={(value) =>
                handleSectionChange("banner", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Section 2 - About Us
          </Accordion.Header>

          <Accordion.Body>
            <AboutSection
              data={formData.about}
              onChange={(value) =>
                handleSectionChange("about", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* <Accordion.Item eventKey="2">
          <Accordion.Header>
            Section 3 - Our Footprints
          </Accordion.Header>

          <Accordion.Body>
            <FootprintSection
              data={formData.footprints}
              onChange={(value) =>
                handleSectionChange("footprints", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>
            Section 4 - Latest Projects
          </Accordion.Header>

          <Accordion.Body>
            <ProjectSection
              data={formData.projects}
              onChange={(value) =>
                handleSectionChange("projects", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>
            Section 5 - Testimonials
          </Accordion.Header>

          <Accordion.Body>
            <TestimonialSection
              data={formData.testimonials}
              onChange={(value) =>
                handleSectionChange("testimonials", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>
            Section 6 - Video
          </Accordion.Header>

          <Accordion.Body>
            <VideoSection
              data={formData.video}
              onChange={(value) =>
                handleSectionChange("video", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>
            Section 7 - Zig-Zag Sections
          </Accordion.Header>

          <Accordion.Body>
            <ZigZagSection
              data={formData.zigZag}
              onChange={(value) =>
                handleSectionChange("zigZag", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>
            Section 8 - Partnership Logos
          </Accordion.Header>

          <Accordion.Body>
            <PartnershipSection
              data={formData.partnerships}
              onChange={(value) =>
                handleSectionChange("partnerships", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>
            Section 9 - Other Section
          </Accordion.Header>

          <Accordion.Body>
            <OtherSection
              data={formData.other}
              onChange={(value) =>
                handleSectionChange("other", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>
*/}
      </Accordion> 

      <div className="text-end mt-4">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Home Page"}
        </Button>
      </div>

    </div>
  );
};

export default HomePage;