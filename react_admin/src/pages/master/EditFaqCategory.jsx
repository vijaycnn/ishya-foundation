import {
  Container,
  Alert,
  Form,
  Badge,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

function EditFaqCategory() {
  const params = useParams();
  const decode = base64_decode(params.id);
  let id = decode.split("+")[1];
  id = parseInt(id);

  const [loading, setLoading] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const getFaqCategory = async () => {
    setLoading(true);
    setPreviousData(null);
    await axiosInstance
      .get(`/faq/getCategoryById/${id}`)
      .then((response) => {
        // console.log('>>> ', response.data);
        setLoading(false);
        if (response.data.status === "success") {
          setPreviousData(response.data.data);
        }
      })
      .catch((error) => {
        // console.log('>>> ', error.status, error);
        if (error.status === 403) {
          handleLogout();
        }
        setLoading(false);
      });
  };
  useEffect(() => {
    getFaqCategory();
  }, []);

  const [data, setData] = useState({
    name: "",
  });
  useEffect(() => {
    if (previousData) {
      setData({
        name: previousData.name,
      });
    }
  }, [previousData]);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setData((prev) => ({
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
      if (!data.name || data.name.trim() == "") {
        setError("Missing Required!");
        return;
      }
      setIsSubmit(true);
      setLoading(true);
      let body = {
        categoryId: previousData.id,
        name: data.name,
      };
      await axiosInstance
        .post(`/faq/updateCategory`, body)
        .then((response) => {
          // console.log('>>> ', response.data);
          if (response.data.status === "success") {
            setData({ name: "" });
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Edit Faq Category</h1>
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
                value={data.name}
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

export default EditFaqCategory;
