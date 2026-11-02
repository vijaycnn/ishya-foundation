import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

import PartnershipBlogSection from "../components/PartnershipBlog";
import PartnershipContactSection from "../components/PartnershipContact";

const PartnershipPage = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pageId, setPageId] = useState(0);

//   const [pageBanner, setPageBanner] = useState(
//     [ {
//       id: 0,
//       pageId,
//       type: "",
//       fileUrl: "",
//     }]
//   );
//   const [pageAbout, setPageAbout] = useState(
//     {
//       title: "",
//       title2: "",
//       title3: "",
//       remarks: "",
//       fileUrl1: "", fileUrlTxt1: "",
//       fileUrl2: "", fileUrlTxt2: "",
//       tagTitle1: "", tagDescription1: "",
//       tagTitle2:"",  tagDescription2: "",
//     }
//   );
//   const [PageFounder, setPageFounder] = useState(
//     {
//       title: "",
//       name1: "",
//       designation1: "",
//       name2: "",
//       designation2: "",
//       fileUrl1: "", 
//       fileUrl2: "", 
//       remarks: "",
//     }
//   );

  const initialFormData = {
    pageData: {},
    blogs: {
      items: []
    },
    contacts: {
        items: []
    },

    // banner:pageBanner,
    // about: pageAbout,
    // feature: {
    //   items: []
    // },
    // founder: PageFounder,
    // team: {
    //     items: []
    // },

  };
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };

  useEffect(() => {
    fetchPartnershipPage();
  }, []);

  
  const fetchPartnershipPage = async () => {
      setIsLoading(true);

    await axiosInstance.get(`/partnership/getPageData`)
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
                    blogs: {
                        items: pageData?.PartnershipBlogs || []
                    },
                    contacts: {
                        impactHeading: pageData?.impactHeading || "",
                        contactRemarks: pageData?.remarks || "",
                        items: pageData?.PartnershipContacts || []
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
          <h4>Partnership Page CMS</h4>
          <p className="text-muted mb-0">
            Manage page content and sections
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

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Section 1 - Partnership Context
          </Accordion.Header>

          <Accordion.Body>
            <PartnershipBlogSection
              data={formData.blogs}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("blogs", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
            Section 2 - Contacts
          </Accordion.Header>

          <Accordion.Body>
            <PartnershipContactSection
              data={formData.contacts}
              pageId={pageId}
              onChange={(value) =>
                handleSectionChange("contacts", value)
              }
            />
          </Accordion.Body>
        </Accordion.Item>

      </Accordion> 

      <div className="text-end mt-4"></div>

    </div>
  );
};

export default PartnershipPage;