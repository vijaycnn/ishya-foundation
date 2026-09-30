import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const ProjectSection = ({ data, pageId, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentProject = data || null;
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [projectFormData, setProjectFormData] = useState({
      pageId: pageId,
      
      partnerPageTitle: currentProject?.partnerPageTitle || "",
      partnerPageHeading: currentProject?.partnerPageHeading || "",
      partnerPageSubHeading: currentProject?.partnerPageSubHeading || "",
  }); 

  useEffect(() => {
      const about = data;
      console.log('prject data', pageId, about)
      if (about) {
          setProjectFormData({
              pageId,
              partnerPageTitle: about?.partnerPageTitle || "",
              partnerPageHeading: about?.partnerPageHeading || "",
              partnerPageSubHeading: about?.partnerPageSubHeading || "",
          });

      } else {
          setProjectFormData({
              pageId,
              partnerPageTitle: "",
              partnerPageHeading: "",
              partnerPageSubHeading: "",
          });

      }

  }, [data, pageId]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setProjectFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const validation = (values) => {
    setError("");
    let hasError = false;
    if (!values.pageId || values.pageId == "" || ( (!values.partnerPageTitle || values.partnerPageTitle.trim() == "") ) ) {
      setError("Title must be filled");
      return hasError = true;
    }
    
    return hasError;
  };
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    console.log("formData >>", projectFormData);
    try {
      let hasError = validation(projectFormData);
      if (!hasError) {
        setIsLoading(true);

        await formProcess();
        setIsLoading(false);
        setIsLoading(false);
      }
      setIsSubmit(false);
    } catch (error) {
      // console.log("Catch Err >>", error);
      setError(error.message);
      alert(error.message);
      setIsLoading(false);
      setIsSubmit(false);
    }
  };

  const formProcess = async () => {
    const body = {
      pageId: projectFormData.pageId,

      partnerPageTitle: projectFormData.partnerPageTitle,
      partnerPageHeading: projectFormData.partnerPageHeading,
      partnerPageSubHeading: projectFormData.partnerPageSubHeading,     
    };

    let urlEndPoint = `/page/updatePageproject`;
    console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const saved = response.data.data;

            setProjectFormData(saved);

            setSuccessMsg(response.data.message);
            // Update HomePage state
            onChange([saved]);
        } else {
            setError(response.data.message);
        }

    } catch (error) {
        console.log("Add Footprint error:", error);
        if (error.status === 403) {
            handleLogout();
        }

        setError(error.response?.data?.message || error.message || "Unable to save footprint" );
    } finally {
        setIsLoading(false);
        setIsSubmit(false);
    }
  };
  
  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateNested = (parent, field, value) => {
    onChange({
      ...data,
      [parent]: {
        ...data[parent],
        [field]: value,
      },
    });
  };

  return (
    <div>
      <Form>
              {error && <Alert variant="danger">⚠️{error}</Alert>}
              {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="partnerPageTitle"
              value={projectFormData.partnerPageTitle}
              placeholder="Enter Title"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Heading
            </Form.Label>
            <Form.Control
              type="text"
              name="partnerPageHeading"
              value={projectFormData.partnerPageHeading}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Sub-Heading
            </Form.Label>
            <Form.Control
              type="text"
              name="partnerPageSubHeading"
              value={projectFormData.partnerPageSubHeading}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>   
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleProjectSubmit} disabled={isSubmit || isLoading}>
              <span>Update</span>
            </Button>
          </Form.Group>
        </Col>

      </Row>   
      </Form>


      

    </div>
  );
};
export default ProjectSection;