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

function EditNewsLetter() {
  const params = useParams();
  const decode = base64_decode(params.id);
  let id = decode.split("+")[1];
  id = parseInt(id);

  const pageType = `newsletter`;
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
      .get(`/learningpage/getById/${pageType}/${id}`)
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
    type: pageType,
    orderNumber : 1,
    title: "",
    fileUrl: "",
    attachFileUrl: "",
    remark1: "",
  });
  useEffect(() => {
    if (previousData) {
      setData({
        type: previousData.type,
        orderNumber : previousData.orderNumber,
        title: previousData.title,
        remark1: previousData.remark1,
        fileUrl: previousData.fileUrl,
        attachFileUrl: previousData.attachFileUrl,
      });
    }
  }, [previousData]);

    const [fileError, setFileError] = useState("");
    const [uploadMediaFile, setUploadMediaFile] = useState(null);
    const [fileError2, setFileError2] = useState("");
    const [uploadMediaFile2, setUploadMediaFile2] = useState(null);

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
  const allowedAttachTypes = [
    "application/pdf",
    "pdf",
  ];

  const MAX_SIZE = 2 * 1024 * 1024; 
  const MAX_SIZE_LBL = "2 MB";

  const MAX_ATTACH_SIZE = 5 * 1024 * 1024;
  const MAX_ATTACH_SIZE_LBL = "5 MB";

  const fileUploadEvent = (file, index) => {
    const selected = file; //e.target.files[0];
    setFileError(""); // reset
    if (!selected) return;
    console.log("fileType", selected.type);
    if(index == 1){

        if (!allowedTypes.includes(selected.type)) {
            setFileError(
                "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed."
            );
            setUploadMediaFile(null);
            return;
        }
        
        if (selected.size > MAX_SIZE) {
            setFileError(`File size must be less than ${MAX_SIZE_LBL}.`);
            setUploadMediaFile(null);
            return;
        }
        setUploadMediaFile(selected);
    }else{
        if (!allowedAttachTypes.includes(selected.type)) {
            setFileError2("Only PDF files are allowed.");
            setUploadMediaFile2(null);
            return;
        }
        
        if (selected.size > MAX_ATTACH_SIZE) {
            setFileError2(`File size must be less than ${MAX_ATTACH_SIZE_LBL}.`);
            setUploadMediaFile2(null);
            return;
        }
        setUploadMediaFile2(selected);
    }
  };
  const handleFileChange = (e, index) => {
    // console.log("handleFileChange >>");
    fileUploadEvent(e.target.files[0], index);
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
    let remark1 = values?.remark1
    .replace(/<(.|\n)*?>/g, "") // remove html tags
    .replace(/&nbsp;/g, " ")
    .trim();

    if (!values.type || values.type == "" || !values.title || values.title == "" || !remark1 || remark1 == "" || (uploadMediaFile == null && previousData.fileUrl == "") || (uploadMediaFile2 == null && previousData.attachFileUrl == "") ) {
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
          type: previousData.type,
          title: data.title ? data.title : "",
        };
        await axiosInstance
          .post(`/learningpage/valid`, validateBody)
          .then(async (response) => {
            console.log("validate response >>> ", response.data);
            if (response.data.status === "success") {
              //Now, process with data
              setLoading(true);
              let fileUrl = previousData.filePath;
              let attachFileUrl = previousData.attachFilePath;
              if (uploadMediaFile != null) {
                let uploadRes = await uploadFileOnS3();
                if (uploadRes) {
                  fileUrl = uploadRes;
                }
              }
              if (uploadMediaFile2 != null) {
                let uploadRes2 = await uploadFileOnS3(uploadMediaFile2);
                if (uploadRes2) {
                    attachFileUrl = uploadRes2;
                    // console.log('file save step1');
                }
              }
              await formProcess(fileUrl, attachFileUrl);
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
        folderPath: 'NewsLetters',
      }),
    });
    return response.json();
  };
  const uploadFileOnS3 = async (mediaFile) => {
    // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, mediaFile);
    setLoading(true);
    const { uploadUrl, fileUrl } = await getUploadUrl(mediaFile);
    // console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mediaFile.type },
      body: mediaFile,
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

  const formProcess = async (fileUrl, attachFileUrl) => {
    let body = {
      mentorId: previousData.id,
      type: previousData.type,
      orderNumber: data.orderNumber,
      title: data.title,
      fileUrl: fileUrl,
      attachFileUrl: attachFileUrl,
      remark1: data.remark1,
    };
    console.log("data >>", body);
    await axiosInstance
      .post(`/learningpage/update`, body)
      .then((response) => {
        // console.log('response >>> ', response.data);
        if (response.data.status === "success") {
          setData({
            type: pageType,
            orderNumber: "",
            title: "",
            remark1: "",
            fileUrl: "",
            attachFileUrl: "",
          });
          setSuccessMsg(response?.data?.message);
          setLoading(false);
          setTimeout(() => {
            navigate(`${adminAlias}/newsletters`);
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
        <h1 className="h4 mb-0 font-secondary fw-medium">Edit NewsLetter</h1>
        <div>
          <Link to={`${adminAlias}/newsletters`} className="btn btn-primary btn-sm">
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
              
            <Col md={12}>
                <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                    Title<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={data.title}
                    placeholder="Enter Title"
                    onChange={handleChange}
                />
                </Form.Group>
            </Col>
            <Col md={8}>
                <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                    Image <small>(Max. FileSize {MAX_SIZE_LBL})</small>
                    <span className="text-danger">*</span>
                </Form.Label>
                {fileError && (
                    <p className="mt-2 text-sm text-red-600">
                    ⚠️ {fileError}
                    </p>
                )}
                <Form.Control type="file"  onChange={(e)=>handleFileChange(e,1)}  />
                </Form.Group>
            </Col>
            <Col md={2} className="text-center">
                {data.fileUrl != "" ? (
                    <>
                    <img src={data.fileUrl} alt=""  />
                    </>
                ) : (
                    ""
                )}
            </Col>

            <Col md={8}>
                <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                    NewsLetter <small>(Max. FileSize {MAX_ATTACH_SIZE_LBL})</small>
                    <span className="text-danger">*</span>
                </Form.Label>
                {fileError2 && (
                    <p className="mt-2 text-sm text-red-600">⚠️ {fileError2}</p>
                )}
                <Form.Control type="file" onChange={(e)=>handleFileChange(e, 2)} />
                </Form.Group>
            </Col>
            <Col md={2} className="text-center">
                {data.attachFileUrl != "" ? (
                    <>
                    <br/><br/>
                    <a target="_blank" href={data.attachFileUrl} alt="" >View File</a>
                    </>
                ) : (
                    ""
                )}
            </Col>
            
            <Col md={12}>
                <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Description<span className="text-danger">*</span></Form.Label>
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

export default EditNewsLetter;
