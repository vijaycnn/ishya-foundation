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
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;

function Faq() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const getCategoryList = async () => {
    await axiosInstance
      .get(`/faq/categoryDDList`)
      .then((response) => {
        console.log(">>> ", response.data);
        setLoading(false);
        if (response.data.status === "success") {
          setCategoryList(response?.data?.data?.rows);
        }
      })
      .catch((error) => {
        console.log(">>> ", error.status, error);
        if (error.status === 403) {
          // alert('Session Timeout');
          handleLogout();
        }
      });
  };

  useEffect(() => {
    if (categoryList.length == 0) {
      getCategoryList();
    }
  }, []);

  const avoidAlphabets = (event) => {
    var k = event ? event.which : window.event.keyCode;
    if (k >= 48 && k <= 57) {
      return true;
    } else {
      event.preventDefault();
    }
  };

  const [formData, setFormData] = useState({
    categoryId: "",
    orderNumber: 1,
    quest: "",
    answer: "",
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
    if (
      !values.categoryId ||
      values.categoryId == "" ||
      !values.orderNumber ||
      values.orderNumber == "" ||
      !values.quest ||
      values.quest.trim() == "" ||
      !values.answer ||
      values.answer.trim() == ""
    ) {
      setError("Mandatory fields are missing");
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
          categoryId: formData.categoryId,
          orderNumber: formData.orderNumber,
          quest: formData.quest,
          answer: formData.answer,
        };
        await axiosInstance
          .post(`/faq/create`, body)
          .then((response) => {
            // console.log('response >>> ', response.data);
            if (response.data.status === "success") {
              setFormData({
                categoryId: "",
                orderNumber: 1,
                quest: "",
                answer: "",
              });
              setSuccessMsg(response?.data?.message);
              setLoading(false);
              setTimeout(() => {
                navigate(`${adminAlias}/faqs`);
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Add Faq</h1>
        <div>
          <Link to={`${adminAlias}/faqs`} className="btn btn-primary btn-sm">
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
            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Category<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="categoryId"
                  onChange={handleChange}
                  value={formData.categoryId}
                >
                  <option value="">Select Category</option>
                  {categoryList.map((data) => {
                    return (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Order Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  placeholder="Order Number"
                  onChange={handleChange}
                  maxLength={2}
                  onKeyPress={avoidAlphabets}
                />
              </Form.Group>
            </Col>
          </Row>
          <Col md={8}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Question<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="quest"
                value={formData.quest}
                placeholder="Question"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Answer<span className="text-danger">*</span>
              </Form.Label>
              <ReactQuill
                theme="snow"
                name="answer"
                value={formData.answer}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, answer: content }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={8}>
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

export default Faq;
