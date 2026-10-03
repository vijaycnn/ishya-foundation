import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const FounderSection = ({ data = [], pageId, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentFounder = data?.[0] || null;
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploadMediaFile, setUploadMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState( '');

  const [fileError2, setFileError2] = useState("");
  const [uploadMediaFile2, setUploadMediaFile2] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState( '');
  

  const [founderFormData, setFounderFormData] = useState({
      id: currentFounder?.id || 0,
      pageId: currentFounder?.pageId || pageId,
      
      title: currentFounder?.title || "",
      name1: currentFounder?.name1 || "",
      designation1: currentFounder?.designation1 || "",
      name2: currentFounder?.name2 || "",
      designation2: currentFounder?.designation2 || "",

      remarks: currentFounder?.remarks || "",
      fileUrl1: currentFounder?.fileUrl1 || "", 
      fileUrl2: currentFounder?.fileUrl2 || "", 

      fileViewUrl1: currentFounder?.fileViewUrl1 || "",
      fileViewUrl2: currentFounder?.fileViewUrl2 || "",
  }); 

  useEffect(() => {
      const about = data?.[0];
      console.log('founder data', about)
      if (about) {
          setFounderFormData({
              id: about.id || 0,
              pageId: about.pageId || pageId,
              title: currentFounder?.title || "",
              name1: currentFounder?.name1 || "",
              designation1: currentFounder?.designation1 || "",
              name2: currentFounder?.name2 || "",
              designation2: currentFounder?.designation2 || "",
              remarks: about?.remarks || "",
              fileUrl1: about?.fileUrl1 || "", 
              fileUrl2: about?.fileUrl2 || "", 

              fileViewUrl1: about?.fileViewUrl1 || "",
              fileViewUrl2: about?.fileViewUrl2 || "",
          });

      } else {
          setFounderFormData({
              id: 0,
              pageId,
              title: "",
              name1: "",
              designation1: "",
              name2: "",
              designation2: "",
              remarks: "",
              fileUrl1: "", 
              fileUrl2: "", 
          });

      }
      setUploadMediaFile(null);
      setUploadMediaFile2(null);

  }, [data, pageId]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFounderFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Allowed file types
    const allowedImgTypes = [
      "image/svg+xml",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/bmp",
      "image/tiff",
      "image/gif",
      "image/webp",
    ];
    const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB
    const MAX_IMAGE_SIZE_LBL = "50 MB";

  const fileUploadEvent = (file, index) => {
    const selected = file; //e.target.files[0];
    setFileError(""); // reset
    if (!selected) return;
    console.log("fileType", selected.type );
    if(selected.type.includes('image')){    
      if (!allowedImgTypes.includes(selected.type)) {
          if(index == 1){
            setFileError("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            setUploadMediaFile(null);
            return;
          }else if(index == 2){
            setFileError2("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            setUploadMediaFile2(null);
            return;
          }
      }  
      if (selected.size > MAX_IMAGE_SIZE) {
        if(index == 1){
          setFileError(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
          setUploadMediaFile(null);
          return;
        }else if(index == 2){
          setFileError2(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
          setUploadMediaFile2(null);
          return;
        }
      }      
    }
    if(index == 1){
      setUploadMediaFile(selected);
    }else{
      setUploadMediaFile2(selected);
    }
  };
  const handleFileChange = (e, index) => {
    // console.log("handleFileChange >>");
    const file = e.target.files[0];
    if (!file) return;

    fileUploadEvent(file, index);
    if(index == 1){
      setPreviewUrl(URL.createObjectURL(file));
    }else{
      setPreviewUrl2(URL.createObjectURL(file));
    }
  }; 
  
  
  const validation = (values) => {
    setError("");
    let hasError = false;
    if (!values.pageId || values.pageId == "" || ( (!values.title || values.title.trim() == "") || (!values.name1 || values.name1.trim() == "") || (!values.designation1 || values.designation1.trim() == "")) ) {
      setError("Mandatory fields are missing aa");
      return hasError = true;
    }
    if (!values.remarks || values.remarks == "" ) {
      setError("Mandatory fields are missing bb");
      return hasError = true;
    }
    if(!values.id || values.id == null){        //check this for add case
        if( (!uploadMediaFile || uploadMediaFile == null)  ){
            setError("First Image is missing");
            return hasError = true;
        }
    }
    if(uploadMediaFile){
        if (!allowedImgTypes.includes(uploadMediaFile.type)) {
            setFileError(
                "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed."
            );
            return hasError = true;
        }            
        if (uploadMediaFile.size > MAX_IMAGE_SIZE) {
            setFileError(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
            return hasError = true;
        }
    }

    if ( values.name2 || values.designation2 ){
        if(!values.name2 || values.name2.trim() == "" || !values.designation2 || values.designation2.trim() == "" || !uploadMediaFile2 || uploadMediaFile2 == null){
            setError("Second Founder details are missing");
            return hasError = true;
        }
    } 

    if(uploadMediaFile2){
        if (!allowedImgTypes.includes(uploadMediaFile2.type)) {
            setFileError2("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            return hasError = true;
        }            
        if (uploadMediaFile2.size > MAX_IMAGE_SIZE) {
            setFileError2(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
            return hasError = true;
        }
    }
    return hasError;
  };
  const handleFounderSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    console.log("formData >>", founderFormData);
    try {
      let hasError = validation(founderFormData);
      if (!hasError) {
        setIsLoading(true);

        let fileUrl1 = founderFormData?.fileUrl1;
        let fileUrl2 = founderFormData?.fileUrl2;
        if (uploadMediaFile != null) {
            let uploadRes = await uploadFileOnS3(uploadMediaFile);
            if (uploadRes) {
                fileUrl1 = uploadRes;
                // console.log('file save step1');
            }
        }
        if (uploadMediaFile2 != null) {
            let uploadRes2 = await uploadFileOnS3(uploadMediaFile2);
            if (uploadRes2) {
                fileUrl2 = uploadRes2;
                // console.log('file save step1');
            }
        }
        // console.log('file save step2 ');
        await formProcess(fileUrl1, fileUrl2);
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

  const uploadFileOnS3 = async (mediaFile) => {
    // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, mediaFile);
    setIsLoading(true);
    const { uploadUrl, fileUrl } = await getUploadUrl(mediaFile);
    // console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mediaFile.type },
      body: mediaFile,
    });
    // console.log("uploadRes", uploadRes);
    if (uploadRes.status == 200) {
      setIsLoading(false);
      return fileUrl;
    } else {
      setError("File upload failed");
      setIsLoading(false);
      return false;
    }
  };

  const formProcess = async (fileUrl1, fileUrl2) => {
    const body = {
      founderId: founderFormData?.id,
      pageId: founderFormData.pageId,

      title: founderFormData.title,
      name1: founderFormData.name1,
      designation1: founderFormData.designation1,
      name2: founderFormData.name2,
      designation2: founderFormData.designation2,
      remarks: founderFormData.remarks,
      fileUrl1: fileUrl1,
      fileUrl2: fileUrl2,      
    };
    let urlEndPoint = `/page/addPagefounder`;
    if(founderFormData?.id > 0){
        urlEndPoint = `page/updatePagefounder`;
    }
    console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const saved = response.data.data;

            setFounderFormData(saved);
            // setPreviewUrl(saved.fileViewUrl1);
            setUploadMediaFile(null);
            setUploadMediaFile2(null);

            setSuccessMsg(response.data.message);
            // Update HomePage state
            onChange([saved]);
        } else {
            setError(response.data.message);
        }

    } catch (error) {
        console.log("Add Founder error:", error);
        if (error.status === 403) {
            handleLogout();
        }

        setError(error.response?.data?.message || error.message || "Unable to save founder" );
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
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={founderFormData.title}
              placeholder="Enter Title"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description</Form.Label>
            <ReactQuill
              theme="snow"
              name="remarks"
              value={founderFormData.remarks}
              onChange={(content) =>
                setFounderFormData((prev) => ({ ...prev, remarks: content }))
              }
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name1"
              value={founderFormData.name1}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Designation<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="designation1"
              value={founderFormData.designation1}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image 1 <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
              <span className="text-danger">*</span>
            </Form.Label>
            {fileError && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError}
              </p>
            )}
            <Form.Control type="file" name="fileUrl1" onChange={(e)=> handleFileChange(e, 1)} />
          </Form.Group>
        </Col>
        <Col md="6">
            {
                (uploadMediaFile && previewUrl) && 
                <>
                <img src={previewUrl} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                </>
            }
            {
                (!uploadMediaFile && founderFormData.fileViewUrl1) &&
                <>
                    <img src={founderFormData.fileViewUrl1} height={100} width={100} alt="img" />
                </>

            }
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Name 2
            </Form.Label>
            <Form.Control
              type="text"
              name="name2"
              value={founderFormData.name2}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Designation 2
            </Form.Label>
            <Form.Control
              type="text"
              name="designation2"
              value={founderFormData.designation2}
              placeholder="Enter Here"
              onChange={handleChange}  maxLength={155}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image 2 <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
            </Form.Label>
            {fileError2 && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError2}
              </p>
            )}
            <Form.Control type="file" name="fileUrl2" onChange={(e)=> handleFileChange(e, 2)} />
          </Form.Group>
        </Col>
        <Col md="6">
            {
                (uploadMediaFile2 && previewUrl2) && 
                <>
                <img src={previewUrl2} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                </>
            }
            {
                (!uploadMediaFile2 && founderFormData.fileViewUrl2) &&
                <>
                    <img src={founderFormData.fileViewUrl2} height={100} width={100} alt="img" />
                </>

            }
        </Col>
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleFounderSubmit} disabled={isSubmit || isLoading}>
              <span>{ !founderFormData?.id ? "Save" : "Update" }</span>
            </Button>
          </Form.Group>
        </Col>



      </Row>   
      </Form>


      

    </div>
  );
};
export default FounderSection;