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

function EditMentor() {
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

  const getMentor = async () => {
    setLoading(true);
    setPreviousData(null);
    await axiosInstance
      .get(`/mentor/getById/${id}`)
      .then((response) => {
        // console.log(">>> ", response.data);
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
    getMentor();
  }, []);

  const [data, setData] = useState({
    name: "",
    orderNumber: "",
    title: "",
    remark1: "",
    remark2: "",
    fileUrl: "",
  });
  useEffect(() => {
    if (previousData) {
      setData({
        name: previousData.name,
        orderNumber : previousData.orderNumber,
        title: previousData.title,
        remark1: previousData.remark1,
        remark2: previousData.remark2,
        fileUrl: previousData.fileUrl,
      });
    }
  }, [previousData]);

  const [fileError, setFileError] = useState("");
  const [uploadMediaFile, setUploadMediaFile] = useState(null);

  // Allowed file types
  const allowedTypes = [
    "image/svg+xml",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/bmp",
    "image/tiff",
    "image/gif",
    "image/webp",
  ];
  const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
  const fileUploadEvent = (file) => {
    const selected = file; //e.target.files[0];
    setFileError(""); // reset
    if (!selected) return;
    console.log("fileType", selected.type);
    if (!allowedTypes.includes(selected.type)) {
      setFileError(
        "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed."
      );
      setUploadMediaFile(null);
      return;
    }

    if (selected.size > MAX_SIZE) {
      setFileError("File size must be less than 100 MB.");
      setUploadMediaFile(null);
      return;
    }
    setUploadMediaFile(selected);
  };
  const handleFileChange = (e) => {
    // console.log("handleFileChange >>");
    fileUploadEvent(e.target.files[0]);
  };

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
    if (
      !values.name || values.name == "" || !values.title || values.title == "" || values.orderNumber == "" || !values.orderNumber || (uploadMediaFile == null && previousData.fileUrl == "")
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
      let hasError = validation(data);
      if (!hasError && previousData.id > 0) {
        setLoading(true);
        let validateBody = {
          mentorId: previousData.id,
          name: data.name,
          title: data.title ? data.title : "",
        };
        await axiosInstance
          .post(`/mentor/valid`, validateBody)
          .then(async (response) => {
            console.log("validate response >>> ", response.data);
            if (response.data.status === "success") {
              //Now, process with data
              setLoading(true);
              let fileUrl = previousData.filePath;
              if (uploadMediaFile != null) {
                let uploadRes = await uploadFileOnS3();
                if (uploadRes) {
                  fileUrl = uploadRes;
                }
              }
              await formProcess(fileUrl);
              setLoading(false);
            } else if (response.data.status === "error") {
              setError(response.data.message);
            }
          })
          .catch((error) => {
            console.log(">>> ", error.status, error);
            if (error.status === 403) {
              handleLogout();
            }
            setError("Something went wrong, please try again");
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

  const getUploadUrl = async (file) => {
    const response = await fetch(`${baseURL}/enquiry/generateUrl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });
    return response.json();
  };

  const uploadFileOnS3 = async () => {
    // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, uploadMediaFile);
    setLoading(true);
    const { uploadUrl, fileUrl } = await getUploadUrl(uploadMediaFile);
    // console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": uploadMediaFile.type },
      body: uploadMediaFile,
    });
    // console.log("uploadRes", uploadRes);
    if (uploadRes.status == 200) {
      setLoading(false);
      return fileUrl;
    } else {
      setError("File upload failed");
      setLoading(false);
      return false;
    }
  };

  const formProcess = async (fileUrl) => {
    let body = {
      mentorId: previousData.id,
      name: data.name,
      orderNumber: data.orderNumber,
      title: data.title,
      remark1: data.remark1,
      remark2: data.remark2,
      fileUrl: fileUrl,
    };
    // console.log("data >>", data);
    await axiosInstance
      .post(`/mentor/update`, body)
      .then((response) => {
        // console.log('response >>> ', response.data);
        if (response.data.status === "success") {
          setData({
            name: "",
            orderNumber: "",
            title: "",
            remark1: "",
            remark2: "",
            fileUrl: "",
          });
          setSuccessMsg(response?.data?.message);
          setLoading(false);
          setTimeout(() => {
            navigate(`${adminAlias}/mentors`);
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
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };
  const avoidAlphabets = (event) => {
    var k = event ? event.which : window.event.keyCode;
    if (k >= 48 && k <= 57) {
      return true;
    } else {
      event.preventDefault();
    }
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Edit Mentor</h1>
        <div>
          <Link to={`${adminAlias}/mentors`} className="btn btn-primary btn-sm">
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
            <Col md={2} className="text-center">
              {/* image preview */}
              {data.fileUrl != "" ? (
                <>
                  <img src={data.fileUrl} alt="" />
                </>
              ) : (
                ""
              )}
            </Col>
            <Col md={10} className="ps-md-5">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={data.name}
                      placeholder="Enter Name"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      Image <small>(Max. FileSize 100 mb)</small>
                      <span className="text-danger">*</span>
                    </Form.Label>
                    {fileError && (
                      <p className="mt-2 text-sm text-red-600">
                        ⚠️ {fileError}
                      </p>
                    )}
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      Expertise<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={data.title}
                      placeholder="Enter Expertise"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      Order Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="orderNumber"
                      value={data.orderNumber}
                      placeholder="Order Number"
                      onChange={handleChange}
                      maxLength={2}
                      onKeyPress={avoidAlphabets}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Description</Form.Label>
                    <ReactQuill
                      theme="snow"
                      name="remark1"
                      value={data.remark1}
                      onChange={(content) =>
                        setData((prev) => ({ ...prev, remark1: content }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Overview</Form.Label>
                    <ReactQuill
                      theme="snow"
                      name="remark2"
                      value={data.remark2}
                      onChange={(content) =>
                        setData((prev) => ({ ...prev, remark2: content }))
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
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default EditMentor;
