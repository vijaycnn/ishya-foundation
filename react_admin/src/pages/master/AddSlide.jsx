import {
  Container,
  Alert,
  Form,
  Badge,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

function Slide() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slideNumber: "",
    title: "",
    subtitle: "",
    remark: "",
  });
  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validation = (values) => {
    setError("");
    let hasError = false;
    let remark = values.remark
    .replace(/<(.|\n)*?>/g, '') // remove html tags
    .replace(/&nbsp;/g, ' ')
    .trim();

    if (!values.slideNumber || values.slideNumber == "" ) {
      setError("Mandatory fields are missing");
      hasError = true;
    }
    if((!values.title && !values.subtitle && remark.length === 0)){
      setError("One of the fields(Title/Sub-Title/Description) should be filled");
      hasError = true;
    }
    return hasError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    // console.log("formData >>", formData);
    try {
      let hasError = validation(formData);
      if (!hasError) {
        setLoading(true);
        
        let body = {
            slideNumber: formData.slideNumber,
            title: formData.title,
            subtitle: formData.subtitle,
            remark: formData.remark,
        };
        // console.log("data >>", data);
        await axiosInstance
            .post(`/slide/create`, body)
            .then((response) => {
            // console.log('response >>> ', response.data);
            if (response.data.status === "success") {
                setFormData({
                slideNumber: "",
                title: "",
                subtitle:"",
                remark: "",
                });
                setSuccessMsg(response?.data?.message);
                setLoading(false);
                setTimeout(() => {
                    navigate(`${adminAlias}/slides`);
                }, 2000);
            } else if (response.data.status === "error") {
                setError(response.data.message);
            }
         })
        .catch((error) => {
            console.log(">>> ", error.status, error);
            if (error.status === 403) {
                handleLogout();
            }
            setLoading(false);
            setIsSubmit(false);
         });
        
        setLoading(false);
      }
      setIsSubmit(false);
    } catch (error) {
      // console.log("Catch Err >>", error);
      setError(error.message);
      alert(error.message);
      setLoading(false);
      setIsSubmit(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };

  return (
    <>
      {loading == true ? (
        <>
          <div className="loader">
            <div className="loader-spinner"></div>
          </div>
        </>
      ) : (
        ""
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0 font-secondary fw-medium">Add Context</h1>
        <div>
          <Link to={`${adminAlias}/slides`} className="btn btn-primary btn-sm">
            <span className="nav-link-text">Back</span>
          </Link>
        </div>
      </div>

      <div className="table-view bg-white rounded-4 p-4">
        {error && <Alert variant="danger">⚠️{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* <Alert alert={alert} /> */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Slide/Tab Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="slideNumber"
                  value={formData.slideNumber}
                  placeholder="Enter Here"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  placeholder="Enter Here"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Sub-Title
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  placeholder="Enter Here"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Description</Form.Label>
                <ReactQuill
                  theme="snow"
                  name="remark"
                  value={formData.remark}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, remark: content }))
                  }
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="text-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmit}
                  className="pill"
                  size="lg"
                >
                  <span>Submit</span>
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default Slide;
