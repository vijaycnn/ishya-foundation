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
import moment from "moment";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

function FaqCategory() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });
  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // console.log("hasError >>", formData);
    try {
      if (!formData.name || formData.name.trim() == "") {
        setError("Missing Required!");
        return;
      }
      setIsSubmit(true);
      setLoading(true);
      let body = {
        name: formData.name,
      };
      await axiosInstance
        .post(`/faq/createCategory`, body)
        .then((response) => {
          // console.log('>>> ', response.data);
          if (response.data.status === "success") {
            setFormData({ name: "" });
            setSuccessMsg(response?.data?.message);
            setLoading(false);
            setTimeout(() => {
              navigate(`${adminAlias}/category`);
            }, 2000);
          } else if (response.data.status === "error") {
            setError(response.data.message);
          }
        })
        .catch((error) => {
          console.log(">>> ", error.status, error);
          if (error.status === 403) {
            // alert('Session Timeout');
            handleLogout();
          }
          setLoading(false);
          setIsSubmit(false);
        });
      setLoading(false);
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Add Faq Category</h1>
        <div>
          <Link
            to={`${adminAlias}/category`}
            className="btn btn-primary btn-sm"
          >
            <span className="nav-link-text">Back</span>
          </Link>
        </div>
      </div>

      <div className="table-view bg-white rounded-4 p-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* <Alert alert={alert} /> */}
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Faq Category Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                placeholder="Category"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="text-align-center">
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
        </Form>
      </div>
    </>
  );
}

export default FaqCategory;
