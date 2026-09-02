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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosInstance from "../../helper/constants/axiosInstance";
import { decode as base64_decode, encode as base64_encode } from "base-64";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";
// import RichTextEditor, { isQuillEmpty } from "../../components/RichTextEditor";

function EditSlide() {
  const params = useParams();
  const decode = base64_decode(params.id);
  let id = decode.split("+")[1];
  id = parseInt(id);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const [previousData, setPreviousData] = useState(null);

  const getSlide = async () => {
    setLoading(true);
    setPreviousData(null);
    await axiosInstance
      .get(`/slide/getById/${id}`)
      .then((response) => {
        console.log(">>> ", response.data);
        setLoading(false);
        if (response.data.status === "success") {
          setPreviousData(response?.data?.data);
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
    getSlide();
  }, []);

  const [data, setData] = useState({
    slideNumber: "",
    title: "",
    subtitle: "",
    remark: "",
  });
  useEffect(() => {
    if (previousData) {
      setData({
        slideNumber: previousData.slideNumber,
        title: previousData.title,
        subtitle: previousData.subtitle,
        remark: previousData.remark,
      });
    }
  }, [previousData]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setData((prev) => ({
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
      let hasError = validation(data);
      if (!hasError && previousData.id > 0) {
        setLoading(true);
        let body = {
            slideId: previousData.id,
            slideNumber: data.slideNumber,
            title: data.title,
            subtitle: data.subtitle,
            remark: data.remark,
        };
        // console.log("data >>", data);
        await axiosInstance
        .post(`/slide/update`, body)
        .then((response) => {
            // console.log('response >>> ', response.data);
            if (response.data.status === "success") {
            setData({
                slideNumber: "",
                title: "",
                subtitle: "",
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Edit Context</h1>
        <div>
          <Link to={`${adminAlias}/slides`} className="btn btn-primary btn-sm">
            <span className="nav-link-text">Back</span>
          </Link>
        </div>
      </div>
      <div className="table-view bg-white rounded-4 p-4">
        {error && <Alert variant="danger">⚠️{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form
          onSubmit={handleSubmit}
          className="login-form p-xl-0 p-md-5 p-4 col-xl-12 m-auto"
        >
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
                    value={data.slideNumber}
                    placeholder="Enter Here" 
                    onChange={handleChange} disabled={true}
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
                  value={data.title}
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
                  value={data.subtitle}
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
                    value={data.remark}
                    onChange={(content) =>
                    setData((prev) => ({ ...prev, remark: content }))
                    }
                />
                {/* <RichTextEditor
                  value={data.remark}
                  onChange={(content) =>
                  setData((prev) => ({ ...prev, remark: content }))
                  }
                  placeholder="Enter description..."
                  error={error}
                /> */}
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

export default EditSlide;
