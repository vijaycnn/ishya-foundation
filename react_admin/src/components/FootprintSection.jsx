import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const FootprintSection = ({ data =[], pageId, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentMap = data?.[0] || null;
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploadMediaFile, setUploadMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState( '');

  const [mapFormData, setMapFormData] = useState({
      id: currentMap?.id || 0,
      pageId: currentMap?.pageId || pageId,

      title: currentMap?.title || "",
      subTitle: currentMap?.subTitle || "",
      remarks: currentMap?.remarks || "",
      fileUrl: currentMap?.fileUrl || "", 
      fileViewUrl: currentMap?.fileViewUrl || "",
  }); 

  useEffect(() => {
      const map = data?.[0];
      console.log('setmap data', map)
      if (map) {
          setMapFormData({
            id: map.id || 0,
            pageId: map.pageId || pageId,
            title: map?.title || "",
            subTitle: map?.subTitle || "",
            remarks: map?.remarks || "",
            fileUrl: map?.fileUrl || "", 
            fileViewUrl: map?.fileViewUrl || "",
          });

      } else {
          setMapFormData({
            id: 0,
            pageId,
            title: "",
            subTitle: "",
            remarks: "",
            fileUrl: "",
          });

      }
      setUploadMediaFile(null);

  }, [data, pageId]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setMapFormData((prev) => ({
      ...prev,  [name]: value,
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
    const MAX_IMAGE_SIZE = 200 * 1024 * 1024; // 200 MB
    const MAX_IMAGE_SIZE_LBL = "200 MB";

  const fileUploadEvent = (file) => {
    const selected = file; //e.target.files[0];
    setFileError(""); // reset
    if (!selected) return;
    // console.log("fileType", selected.type );
    if(selected.type.includes('image')){

      if (!allowedImgTypes.includes(selected.type)) {
          setFileError(
          "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed."
          );
          setUploadMediaFile(null);
          return;
      }  
      if (selected.size > MAX_IMAGE_SIZE) {
        setFileError(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
        setUploadMediaFile(null);
        return;
      }      
    }
    setUploadMediaFile(selected);
  };
  const handleFileChange = (e) => {
    // console.log("handleFileChange >>");
    const file = e.target.files[0];
    if (!file) return;

    fileUploadEvent(file);
    setPreviewUrl(URL.createObjectURL(file));
  }; 
  
  const validation = (values) => {
    setError("");
    let hasError = false;
    if (!values.pageId || values.pageId == "" || !values.title || values.title == "" || !values.remarks || values.remarks == "" ) {
      setError("Mandatory fields are missing");
      hasError = true;
    }
    if(!values.id || values.id == null){        //check this for add case
        if(!uploadMediaFile || uploadMediaFile == null){
            setError("Image File is missing");
            hasError = true;
        }
    }
    if(uploadMediaFile){
        if (!allowedImgTypes.includes(uploadMediaFile.type)) {
            setFileError(
                "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed."
            );
            hasError = true;
        }            
        if (uploadMediaFile.size > MAX_IMAGE_SIZE) {
            setFileError(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
            hasError = true;
        }
    }
    return hasError;
  };
  const handleMapSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    // console.log("formData >>", mapFormData);
    try {
      let hasError = validation(mapFormData);
      if (!hasError) {
        setIsLoading(true);

        let fileUrl = mapFormData?.fileUrl;
        if (uploadMediaFile != null) {
            let uploadRes = await uploadFileOnS3();
            if (uploadRes) {
                fileUrl = uploadRes;
                // console.log('file save step1');
            }
        }
        // console.log('file save step2 ');
        await formProcess(fileUrl);
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

  const uploadFileOnS3 = async () => {
    // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, uploadMediaFile);
    setIsLoading(true);
    const { uploadUrl, fileUrl } = await getUploadUrl(uploadMediaFile);
    // console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": uploadMediaFile.type },
      body: uploadMediaFile,
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

  const formProcess = async (fileUrl) => {
    const body = {
      mapId: mapFormData?.id,
      pageId: mapFormData.pageId,
      title: mapFormData.title,
      subTitle: mapFormData.subTitle,
      remarks: mapFormData.remarks,
      fileUrl: fileUrl,
    };
    let urlEndPoint = `/page/addPagemap`;
    if(mapFormData?.id > 0){
        urlEndPoint = `/page/updatePagemap`;
    }
    console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        // console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const savedMap = response.data.data;

            setMapFormData(savedMap);
            setPreviewUrl(savedMap.fileViewUrl);
            setUploadMediaFile(null);

            setSuccessMsg(response.data.message);
            // Update HomePage state
            onChange([savedMap]);
        } else {
            setError(response.data.message);
        }

    } catch (error) {
        console.log("Add Footprint error:", error);
        if (error.status === 403) {
            handleLogout();
        }

        setError(error.response?.data?.message || error.message || "Unable to save footprint" );
    } finally {
        setIsLoading(false);
        setIsSubmit(false);
    }
  };

  return (
    <div>
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
              value={mapFormData.title}
              placeholder="Enter Title"
              onChange={handleChange} maxLength={55}
            />
          </Form.Group>
        </Col>
        <Col md={6}></Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Sub Title 
            </Form.Label>
            <Form.Control
              type="text"
              name="subTitle"
              value={mapFormData.subTitle}
              placeholder="Enter Here"
              onChange={handleChange} max={55}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description</Form.Label>
            <ReactQuill
              theme="snow"
              name="remarks"
              value={mapFormData.remarks}
              onChange={(content) =>
                setMapFormData((prev) => ({ ...prev, remarks: content }))
              }
            />
          </Form.Group>
        </Col>

        
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
              <span className="text-danger">*</span>
            </Form.Label>
            {fileError && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError}
              </p>
            )}
            <Form.Control type="file" name="fileUrl" onChange={handleFileChange} />
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
                (!uploadMediaFile && mapFormData.fileViewUrl) &&
                <>
                    <img src={mapFormData.fileViewUrl} height={100} width={100} alt="img" />
                </>
            }
        </Col>          
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleMapSubmit} disabled={isSubmit || isLoading}>
              <span>{ !mapFormData?.id ? "Save" : "Update" }
              </span>
            </Button>
          </Form.Group>
        </Col>



      </Row>  
    </Form>

      

    </div>
  );
};
export default FootprintSection;