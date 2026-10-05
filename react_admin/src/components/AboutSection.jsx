import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const AboutSection = ({ data = [], pageId, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentAbout = data?.[0] || null;
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
  

  const [aboutFormData, setAboutFormData] = useState({
      id: currentAbout?.id || 0,
      pageId: currentAbout?.pageId || pageId,
      
      title: currentAbout?.title || "",
      title2: currentAbout?.title2 || "",
      title3: currentAbout?.title3 || "",
      remarks: currentAbout?.remarks || "",
      fileUrl1: currentAbout?.fileUrl1 || "", 
      fileUrl2: currentAbout?.fileUrl2 || "", 

      fileViewUrl1: currentAbout?.fileViewUrl1 || "",
      fileViewUrl2: currentAbout?.fileViewUrl2 || "",

      fileUrlTxt1: currentAbout?.fileUrlTxt1 || "",
      fileUrlTxt2: currentAbout?.fileUrlTxt2 || "",
      tagTitle1: currentAbout?.tagTitle1 || "", 
      tagDescription1: currentAbout?.tagDescription1 || "",
      tagTitle2: currentAbout?.tagTitle2 || "",  
      tagDescription2: currentAbout?.tagDescription2 ||  "",
  }); 

  useEffect(() => {
      const about = data?.[0];
      console.log('about data', about)
      if (about) {
          setAboutFormData({
              id: about.id || 0,
              pageId: about.pageId || pageId,
              title: about?.title || "",
              title2: about?.title2 || "",
              title3: about?.title3 || "",
              remarks: about?.remarks || "",
              fileUrl1: about?.fileUrl1 || "", 
              fileUrl2: about?.fileUrl2 || "", 

              fileViewUrl1: about?.fileViewUrl1 || "",
              fileViewUrl2: about?.fileViewUrl2 || "",

              fileUrlTxt1: about?.fileUrlTxt1 || "",
              fileUrlTxt2: about?.fileUrlTxt2 || "",
              tagTitle1: about?.tagTitle1 || "", 
              tagDescription1: about?.tagDescription1 || "",
              tagTitle2: about?.tagTitle2 || "",  
              tagDescription2: about?.tagDescription2 ||  "",
          });

      } else {
          setAboutFormData({
              id: 0,
              pageId,
              title: "",
              title2: "",
              title3: "",
              remarks: "",
              fileUrl1: "", fileUrlTxt1: "",
              fileUrl2: "", fileUrlTxt2: "",
              tagTitle1: "", tagDescription1: "",
              tagTitle2:"",  tagDescription2: "",
          });

      }
      setUploadMediaFile(null);
      setUploadMediaFile2(null);

  }, [data, pageId]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setAboutFormData((prev) => ({
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
    const MAX_IMAGE_SIZE = 200 * 1024 * 1024; // 200 MB
    const MAX_IMAGE_SIZE_LBL = "200 MB";

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
    if (!values.pageId || values.pageId == "" || ( (!values.title || values.title.trim() == "") && (!values.title2 || values.title2.trim() == "") && (!values.title3 || values.title3.trim() == "")) ) {
      setError("Atleast One field Title, Line1 or Line2 must be filled");
      return hasError = true;
    }
    if (!values.remarks || values.remarks == "" ) {
      setError("Mandatory fields are missing");
      return hasError = true;
    }
    if(!values.id || values.id == null){        //check this for add case
        if( (!uploadMediaFile || uploadMediaFile == null)  && (!values.fileUrlTxt1 || values.fileUrlTxt1.trim() == '') ){
            setError("At least One field Image File1 or Image Text must be filled");
            return hasError = true;
        }
        if( (!uploadMediaFile2 || uploadMediaFile2 == null)  && (!values.fileUrlTxt2 || values.fileUrlTxt2.trim() == '') ){
            setError("At least One field Image File2 or Image Text must be filled");
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
    if(values.tagTitle1){
      if(!values.tagDescription1 || values.tagDescription1.trim() == ''){
        setError("Sub Title -Description is missing");
        return hasError = true;
      }
    }
    if(values.tagTitle2){
      if(!values.tagDescription2 || values.tagDescription2.trim() == ''){
        setError("Sub Title -Description is missing");
        return hasError = true;
      }
    }
    return hasError;
  };
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    console.log("formData >>", aboutFormData);
    try {
      let hasError = validation(aboutFormData);
      if (!hasError) {
        setIsLoading(true);

        let fileUrl1 = aboutFormData?.fileUrl1;
        let fileUrl2 = aboutFormData?.fileUrl2;
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
      aboutId: aboutFormData?.id,
      pageId: aboutFormData.pageId,

      title: aboutFormData.title,
      title2: aboutFormData.title2,
      title3: aboutFormData.title3,
      remarks: aboutFormData.remarks,
      fileUrlTxt1: aboutFormData.fileUrlTxt1,
      fileUrlTxt2: aboutFormData.fileUrlTxt2,
      tagTitle1: aboutFormData.tagTitle1,
      tagTitle2: aboutFormData.tagTitle2,
      tagDescription1: aboutFormData.tagDescription1,
      tagDescription2: aboutFormData.tagDescription2,

      fileUrl1: fileUrl1,
      fileUrl2: fileUrl2,      
    };
    let urlEndPoint = `/page/addPageabout`;
    if(aboutFormData?.id > 0){
        urlEndPoint = `/page/updatePageabout`;
    }
    console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const saved = response.data.data;

            setAboutFormData(saved);
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
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={aboutFormData.title}
              placeholder="Enter Title"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}></Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Line 1 
            </Form.Label>
            <Form.Control
              type="text"
              name="title2"
              value={aboutFormData.title2}
              placeholder="Enter Here"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Line 2
            </Form.Label>
            <Form.Control
              type="text"
              name="title3"
              value={aboutFormData.title3}
              placeholder="Enter Here"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description<span className="text-danger">*</span></Form.Label>
            <ReactQuill
              theme="snow"
              name="remarks"
              value={aboutFormData.remarks}
              onChange={(content) =>
                setAboutFormData((prev) => ({ ...prev, remarks: content }))
              }
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
                (!uploadMediaFile && aboutFormData.fileViewUrl1) &&
                <>
                    <img src={aboutFormData.fileViewUrl1} height={100} width={100} alt="img" />
                </>

            }
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image Text
            </Form.Label>
            <ReactQuill
              theme="snow"
              name="remarks"
              value={aboutFormData.fileUrlTxt1}
              onChange={(content) =>
                setAboutFormData((prev) => ({ ...prev, fileUrlTxt1: content }))
              }
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image 2 <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
              <span className="text-danger">*</span>
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
                (!uploadMediaFile2 && aboutFormData.fileViewUrl2) &&
                <>
                    <img src={aboutFormData.fileViewUrl2} height={100} width={100} alt="img" />
                </>

            }
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Image Text
            </Form.Label>
            <ReactQuill
              theme="snow"
              name="remarks"
              value={aboutFormData.fileUrlTxt2}
              onChange={(content) =>
                setAboutFormData((prev) => ({ ...prev, fileUrlTxt2: content }))
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Sub Title 1
            </Form.Label>
            <Form.Control
              type="text"
              name="tagTitle1"
              value={aboutFormData.tagTitle1}
              placeholder="Enter Here"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description 
              {
                (aboutFormData.tagTitle1) && 
                <span className="text-danger">*</span>
              }
            </Form.Label>
            <ReactQuill
              theme="snow"
              name="tagDescription1"
              value={aboutFormData.tagDescription1}
              onChange={(content) =>
                setAboutFormData((prev) => ({ ...prev, tagDescription1: content }))
              }
            />
          </Form.Group>
        </Col>   
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Sub Title 2
            </Form.Label>
            <Form.Control
              type="text"
              name="tagTitle2"
              value={aboutFormData.tagTitle2}
              placeholder="Enter Here"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Description
              {
                (aboutFormData.tagTitle2) && 
                <span className="text-danger">*</span>
              }
            </Form.Label>
            <ReactQuill
              theme="snow"
              name="tagDescription2"
              value={aboutFormData.tagDescription2}
              onChange={(content) =>
                setAboutFormData((prev) => ({ ...prev, tagDescription2: content }))
              }
            />
          </Form.Group>
        </Col>    
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleAboutSubmit} disabled={isSubmit || isLoading}>
              <span>{ !aboutFormData?.id ? "Save" : "Update" }</span>
            </Button>
          </Form.Group>
        </Col>



      </Row>   
      </Form>


      

    </div>
  );
};
export default AboutSection;