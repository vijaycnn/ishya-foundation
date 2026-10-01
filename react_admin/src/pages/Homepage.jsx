import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

import BannerSection from "../components/BannerSection";
import AboutSection from "../components/AboutSection";
import FootprintSection from "../components/FootprintSection";
import ProjectSection from "../components/ProjectSection";
import TestimonialSection from "../components/TestimonialSection";
import VideoSection from "../components/VideoSection";
import ZigZagSection from "../components/ZigZagSection";

// import OtherSection from "./components/OtherSection";


const HomePage = () => {

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
  const [pageMap, setPageMap] = useState(
    {
      title: "",
      subTitle: "",
      remarks: "",
      fileUrl: "", 
    }
  );
  const [pageVideo, setPageVideo] = useState(
    [ {
      id: 0,
      pageId,
      type: "",
      fileUrl: "",
    }]
  );

  const initialFormData = {
    pageData: {},
    banner:pageBanner,
    about: pageAbout,
    footprints: pageMap,
    video: pageVideo,

    projects: {
      projectIds: [],
    },

    testimonials: {
        testimonialIds: []
    },

    zigZag: {
      title: "",
      items: []
    },

    other: [],
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
    fetchHomePage();
  }, []);

  
  const fetchHomePage = async () => {
      setIsLoading(true);

    await axiosInstance.get(`/page/home`)
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
            footprints: pageData?.PageMaps || pageMap,
            video: pageData?.PageVideos || pageVideo,
            zigZag: {
              title: pageData?.zigzagTitle || "",
              items: pageData?.PageZigZags || [],
            }
          });
					// setItems(response.data?.data);
          // setPageBanner(response.data?.data?.pageBanner);
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
            Manage homepage content and sections {pageId}
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
            Section 3 - Our Footprints
          </Accordion.Header>

          <Accordion.Body>
            <FootprintSection
              data={formData.footprints}
              pageId={pageId}
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
              data={formData.pageData}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("projects", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>
            Section 5 - Testimonial
          </Accordion.Header>

          <Accordion.Body>
            <TestimonialSection
              data={formData.pageData}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("testimonials", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>
            Section 6 - Image / Video
          </Accordion.Header>

          <Accordion.Body>
            <VideoSection
              data={formData.video}
              pageId={pageId}
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
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("zigZag", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* 


        <Accordion.Item eventKey="7">
          <Accordion.Header>
            Section 7 - Other Section
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