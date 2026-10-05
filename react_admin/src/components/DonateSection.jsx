import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const DonateSection = ({ data, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentDonate = data || null;
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
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
    const MAX_IMAGE_SIZE_LBL = "2 MB";

  const [donateFormData, setDonateFormData] = useState({
      id: currentDonate?.id || 0,
      
      title: currentDonate?.title || "",
      shortDesc: currentDonate?.shortDesc || "",
      remarks: currentDonate?.remarks || "",
      donateDesc: currentDonate?.donateDesc || "",
      btnText: currentDonate?.btnText || "",
      btnLink: currentDonate?.btnLink || "",
      overlayText: currentDonate?.overlayText || "",
      fileUrl1: currentDonate?.fileUrl1 || "", 
      fileUrl2: currentDonate?.fileUrl2 || "", 
      
      fileViewUrl1: currentDonate?.fileViewUrl1 || "",
      fileViewUrl2: currentDonate?.fileViewUrl2 || "",  
  }); 

  useEffect(() => {
      const donate = Array.isArray(data) ? data[0] : data;
    //   console.log('donate data', donate)
      if (donate) {
          setDonateFormData({
              id: donate.id || 0,

            title: donate?.title || "",
            shortDesc: donate?.shortDesc || "",
            remarks: donate?.remarks || "",
            donateDesc: donate?.donateDesc || "",
            btnText: donate?.btnText || "",
            btnLink: donate?.btnLink || "",
            overlayText: donate?.overlayText || "",
            fileUrl1: donate?.fileUrl1 || "", 
            fileUrl2: donate?.fileUrl2 || "", 
            
            fileViewUrl1: donate?.fileViewUrl1 || "",
            fileViewUrl2: donate?.fileViewUrl2 || "", 
          });

      } else {
          setDonateFormData({
            id: 0,
            title: "",
            shortDesc: "", 
            remarks : "",
            donateDesc : "",
            btnText : "",
            btnLink : "",
            overlayText: "",
            fileUrl1: "",
            fileUrl2: "", 
          });

      }
      setUploadMediaFile(null);
      setUploadMediaFile2(null);

  }, [data]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setDonateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fileUploadEvent = (file, index) => {
    const selected = file; //e.target.files[0];
    setFileError(""); // reset
    if (!selected) return;
    // console.log("fileType", selected.type );
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
    }else if(index == 2){
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
    }else if(index == 2){
      setPreviewUrl2(URL.createObjectURL(file));
    }
  }; 
  
  
  const validation = (values) => {
    setError("");
    let hasError = false;
    if ( (!values.title || values.title.trim() == "") || (!values.remarks || values.remarks.trim() == "") || (!values.donateDesc || values.donateDesc.trim() == "") ) {
      setError("Mandatory fields are missing");
      return hasError = true;
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
    if(values.btnText && values.btnText?.trim() != ''){
        if ( (!values.btnLink || values.btnLink.trim() == "") ) {
            setError("Link field is missing");
            return hasError = true;
        }
    }
    if(values.btnLink && values.btnLink?.trim() != ''){
        if ( (!values.btnText || values.btnText.trim() == "") ) {
            setError("ATG Text field is missing");
            return hasError = true;
        }
    }
    
    return hasError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    // console.log("formData >>", donateFormData);
    try {
      let hasError = validation(donateFormData);
      if (!hasError) {
        setIsLoading(true);

        let fileUrl1 = donateFormData?.fileUrl1;
        let fileUrl2 = donateFormData?.fileUrl2;
        if (uploadMediaFile != null) {
            let uploadRes = await uploadFileOnS3(uploadMediaFile);
            if (uploadRes) {
                fileUrl1 = uploadRes;
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
      donateId: donateFormData?.id,

      title: donateFormData.title,
      shortDesc: donateFormData?.shortDesc || "",
      remarks: donateFormData?.remarks || "",
      donateDesc: donateFormData?.donateDesc || "",
      btnText: donateFormData?.btnText || "",
      btnLink: donateFormData?.btnLink || "",
      overlayText: donateFormData?.overlayText || "",
      fileUrl1: fileUrl1, 
      fileUrl2: fileUrl2,     
    };
    let urlEndPoint = `/donate/add`;
    if(donateFormData?.id > 0){
        urlEndPoint = `/donate/update`;
    }
    // console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        // console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const saved = response.data.data;

            setDonateFormData(saved);
            setUploadMediaFile(null);
            setUploadMediaFile2(null);

            setSuccessMsg(response.data.message);
            // Update HomePage state
            onChange(saved);
        } else {
            setError(response.data.message);
        }

    } catch (error) {
        console.log("Donate Submit error:", error);
        if (error.status === 403) {
            handleLogout();
        }

        setError(error.response?.data?.message || error.message || "Unable to save donate details" );
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

  return (
    <div className="table-view bg-white rounded-4 p-4">
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
              name="title"
              value={donateFormData.title}
              placeholder="Enter Title"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>

        <Col md={12}>
            <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Short Description</Form.Label>
            <ReactQuill
                theme="snow"
                name="shortDesc"
                value={donateFormData.shortDesc}
                onChange={(content) =>
                setDonateFormData((prev) => ({ ...prev, shortDesc: content }))
                }
            />
            </Form.Group>
        </Col>
        <Col md={12}>
            <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description<span className="text-danger">*</span></Form.Label>
            <ReactQuill
                theme="snow"
                name="remarks"
                value={donateFormData.remarks}
                onChange={(content) =>
                setDonateFormData((prev) => ({ ...prev, remarks: content }))
                }
            />
            </Form.Group>
        </Col>
        <Col md={12}>
            <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Payment Description<span className="text-danger">*</span></Form.Label>
            <ReactQuill
                theme="snow"
                name="donateDesc"
                value={donateFormData.donateDesc}
                onChange={(content) =>
                setDonateFormData((prev) => ({ ...prev, donateDesc: content }))
                }
            />
            </Form.Group>
        </Col>

        
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              ATG Button Text
            </Form.Label>
            <Form.Control
              type="text"
              name="btnText"
              value={donateFormData.btnText}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={55}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              ATG Link
            </Form.Label>
            <Form.Control
              type="text"
              name="btnLink"
              value={donateFormData.btnLink}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Donate Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
            </Form.Label>
            {fileError && (
              <p className="mt-2 text-sm text-red-600" variant="danger">
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
                (!uploadMediaFile && donateFormData.fileViewUrl1) &&
                <>
                    <img src={donateFormData.fileViewUrl1} height={100} width={100} alt="img" />
                </>
            }
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Donate Image Text
            </Form.Label>
            <Form.Control
              type="text"
              name="overlayText"
              value={donateFormData.overlayText}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Other Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
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
                (!uploadMediaFile2 && donateFormData.fileViewUrl2) &&
                <>
                    <img src={donateFormData.fileViewUrl2} height={100} width={100} alt="img" />
                </>
            }
        </Col>
           
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleSubmit} disabled={isSubmit || isLoading}>
              <span>{ !donateFormData?.id ? "Save" : "Update" }</span>
            </Button>
          </Form.Group>
        </Col>

      </Row>   
      </Form>
    </div>
  );
};
export default DonateSection;