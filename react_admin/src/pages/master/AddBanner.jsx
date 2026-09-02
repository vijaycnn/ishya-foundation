import {Container, Alert, Form,Badge,Row,Col,Button,} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND+'/api';

function Banner() {
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const [fileError, setFileError] = useState("");
    const [uploadMediaFile, setUploadMediaFile] = useState(null);

    // Allowed file types
    const allowedTypes = [
        "image/svg+xml",
        "image/jpeg", "image/png", "image/jpg", "image/bmp", "image/tiff", "image/gif",
        "image/webp",
    ];
    const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
    const fileUploadEvent = (file)=>{
        const selected = file; //e.target.files[0];
        setFileError(""); // reset
        if (!selected) return;
        console.log("fileType", selected.type);
        if (!allowedTypes.includes(selected.type)) {
            setFileError("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            setUploadMediaFile(null);
            return;
        }

        if (selected.size > MAX_SIZE) {
            setFileError("File size must be less than 100 MB.");
            setUploadMediaFile(null);
            return;
        }
        setUploadMediaFile(selected);
    }
    const handleFileChange = (e) => {
        // console.log("handleFileChange >>");
        fileUploadEvent(e.target.files[0]);      
    };
    const [formData, setFormData] = useState({
        type: "Image",
        title: "",
        description: '',
        fileUrl: ''    
    });
    const handleChange = (e) => {
        const { name, type, value } = e.target; 
        setFormData((prev) => ({...prev,
        [name]: type === "checkbox" ? checked : value,
        }));   
    };

    const validation = (values) => {
        setError('');        
        let hasError = false;
        if ( uploadMediaFile == null) {             //!values.title || values.title == "" ||
            setError("Mandatory field is missing");
            hasError = true;
        }
        return hasError;
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");   setSuccessMsg('');
    setIsSubmit(true);
    // console.log("formData >>", formData);
    try {
        let hasError = validation(formData);
        if (!hasError) {
            setLoading(true);

            setLoading(true);
            await formProcess();
            setLoading(false);
            
            // let validateBody = {
            //     name: formData.name,
            //     title: formData.title ? formData.title : '',
            // };

            // await axiosInstance.post(`/banner/valid`, validateBody)
            //     .then(async(response)  => {   console.log('validate response >>> ', response.data);
            //         if (response.data.status === "success") {
            //             //Now, process with data
            //             setLoading(true);
            //             await formProcess();
            //             setLoading(false);
            //         }else if (response.data.status === "error") {
            //             setError(response.data.message);
            //         }                    
            //     }).catch((error) => {
            //         console.log('>>> ', error.status, error);
            //         if(error.status === 403){
            //             handleLogout();
            //         }
            //         setError('Something went wrong, please try again');
            //         setLoading(false); setIsSubmit(false);
            //     });
            // setLoading(false);
        }
        setIsSubmit(false);
    } catch (error) {
        // console.log("Catch Err >>", error);
        setError(error.message);
        alert(error.message);
        setLoading(false); setIsSubmit(false);
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

    const formProcess = async () => {    
        // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, uploadMediaFile);
        
        const { uploadUrl, fileUrl } = await getUploadUrl(uploadMediaFile);
        // console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": uploadMediaFile.type },
            body: uploadMediaFile,
        });
        // console.log("uploadRes", uploadRes);
        // const uploadRes = { status : 200 }
        if (uploadRes.status == 200) {
            let body = {
                type : formData.type,
                title : formData.title,
                description : formData.description,
                fileUrl     : fileUrl
            };

            // console.log("data >>", data);
            await axiosInstance.post(`/banner/create`, body)
                .then((response) => {
                console.log('response >>> ', response.data);
                    if (response.data.status === "success") {
                        setFormData({ 
                            type: "Image",
                            title: "",
                            description: '',
                            fileUrl: ''
                        });         
                        setSuccessMsg(response?.data?.message);
                        setLoading(false)
                        setTimeout(() => {
                            navigate(`${adminAlias}/banner`);
                        }, 2000);
                    }else if (response.data.status === "error") {
                        setError(response.data.message);
                    }                    
                }).catch((error) => {
                    console.log('>>> ', error.status, error);
                    if(error.status === 403){
                        handleLogout();
                    }
                    setLoading(false); setIsSubmit(false);
                });
            setLoading(false);        
        }
    };

  const handleLogout = () => {addBanner
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
        ) : ("")
        }

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0 font-secondary fw-medium">Add Banner-Image</h1>
        <div>
            <Link to={`${adminAlias}/banner`} className="btn btn-primary btn-sm">
                <span className="nav-link-text">Back</span>
            </Link>            
        </div>
    </div>
      
      <div className="table-view bg-white rounded-4 p-4">
        {error && <Alert variant="danger">⚠️{error}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit} >
            {/* <Alert alert={alert} /> */}
            <Row>                
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                            Title{/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} placeholder="Enter Title"
                            onChange={handleChange}  /> 
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                            Image <small>(Max. FileSize 100 mb)</small><span className="text-danger">*</span>
                        </Form.Label>
                        {fileError && (
                        <p className="mt-2 text-sm text-red-600">
                            ⚠️ {fileError}
                        </p>
                        )}
                        <Form.Control type="file" onChange={handleFileChange}  />  
                    </Form.Group>
                </Col>
                {/* <Col md={4}></Col> */}
            </Row>
            <Col md={12}>
                <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                        Location
                    </Form.Label>
                    <Form.Control type="text" name="description" value={formData.description} placeholder="Enter Location"
                        onChange={handleChange}  />  
                </Form.Group>
            </Col>

            <Col md={12}>
                <Form.Group className="text-end">
                    <Button type="submit" variant="primary" disabled={isSubmit} className="pill" size="lg" >
                        <span>Submit</span>
                    </Button>
                </Form.Group>
            </Col>
            
        </Form>
      </div> 
    </>
  );
}

export default Banner;
