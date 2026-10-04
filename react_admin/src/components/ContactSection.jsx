import React, { useEffect, useState } from "react";
import { Card, Button, Form,  Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const ContactSection = ({ data, onChange }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
      sessionStorage.removeItem("isAuthenticated");
      localStorage.clear("auth-token");
      localStorage.clear();
      navigate(adminAlias);
  };

  const currentContact = data || null;
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

  const [fileError3, setFileError3] = useState("");
  const [uploadMediaFile3, setUploadMediaFile3] = useState(null);
  const [previewUrl3, setPreviewUrl3] = useState( '');

  const [fileError4, setFileError4] = useState("");
  const [uploadMediaFile4, setUploadMediaFile4] = useState(null);
  const [previewUrl4, setPreviewUrl4] = useState( '');
  

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

  const [contactFormData, setContactFormData] = useState({
      id: currentContact?.id || 0,
      
      title: currentContact?.title || "",
      mapFileUrl: currentContact?.mapFileUrl || "", 
      contactNumber: currentContact?.contactNumber || "",
      watsappFileUrl: currentContact?.watsappFileUrl || "", 
      email: currentContact?.email || "",
      addressTitle1: currentContact?.addressTitle1 || "",
      address1: currentContact?.address1 || "",
      location1: currentContact?.location1 || "",
      addressTitle2: currentContact?.addressTitle2 || "",
      address2: currentContact?.address2 || "",
      location2: currentContact?.location2 || "",
      addressTitle3: currentContact?.addressTitle3 || "",
      address3: currentContact?.address3 || "",
      location3: currentContact?.location3 || "",
      heading: currentContact?.heading || "",

      formTitle: currentContact?.formTitle || "",
      formHeading: currentContact?.formHeading || "", 
      formFileUrl: currentContact?.formFileUrl || "",

      faqTitle: currentContact?.faqTitle || "",
      faqHeading: currentContact?.faqHeading || "", 
      faqFileUrl: currentContact?.faqFileUrl || "",
      
      mapFileViewUrl: currentContact?.mapFileViewUrl || "",
      watsappFileViewUrl: currentContact?.watsappFileViewUrl || "",  
      formFileViewUrl: currentContact?.formFileViewUrl || "", 
      faqFileViewUrl: currentContact?.faqFileViewUrl || "",
  }); 

  useEffect(() => {
      const contact = Array.isArray(data) ? data[0] : data;
    //   console.log('contact data', contact)
      if (contact) {
          setContactFormData({
              id: contact.id || 0,

            title: contact?.title || "",
            mapFileUrl: contact?.mapFileUrl || "", 
            contactNumber: contact?.contactNumber || "",
            watsappFileUrl: contact?.watsappFileUrl || "", 
            email: contact?.email || "",
            addressTitle1: contact?.addressTitle1 || "",
            address1: contact?.address1 || "",
            location1: contact?.location1 || "",
            addressTitle2: contact?.addressTitle2 || "",
            address2: contact?.address2 || "",
            location2: contact?.location2 || "",
            addressTitle3: contact?.addressTitle3 || "",
            address3: contact?.address3 || "",
            location3: contact?.location3 || "",
            heading: contact?.heading || "",

            formTitle: contact?.formTitle || "",
            formHeading: contact?.formHeading || "", 
            formFileUrl: contact?.formFileUrl || "",

            faqTitle: contact?.faqTitle || "",
            faqHeading: contact?.faqHeading || "", 
            faqFileUrl: contact?.faqFileUrl || "",
            
            mapFileViewUrl: contact?.mapFileViewUrl || "",
            watsappFileViewUrl: contact?.watsappFileViewUrl || "",  
            formFileViewUrl: contact?.formFileViewUrl || "", 
            faqFileViewUrl: contact?.faqFileViewUrl || "",
          });

      } else {
          setContactFormData({
            id: 0,
            title: "",
            mapFileUrl: "",
            contactNumber: "", watsappFileUrl: "", email : "",
            addressTitle1: "", address1: "", location1: "",
            addressTitle2: "", address2: "", location2: "",
            addressTitle3: "", address3: "", location3: "",     
            heading: "",
            formTitle: "", formHeading: "", formFileUrl: "",
            faqTitle: "", faqHeading: "", faqFileUrl: "",
          });

      }
      setUploadMediaFile(null);
      setUploadMediaFile2(null);
      setUploadMediaFile3(null);
      setUploadMediaFile4(null);

  }, [data]);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setContactFormData((prev) => ({
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
          }else if(index == 3){
            setFileError3("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            setUploadMediaFile3(null);
            return;
          }else if(index == 4){
            setFileError4("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            setUploadMediaFile4(null);
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
        }else if(index == 3){
          setFileError3(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
          setUploadMediaFile3(null);
          return;
        }else if(index == 4){
          setFileError4(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
          setUploadMediaFile4(null);
          return;
        }
      }      
    }
    if(index == 1){
      setUploadMediaFile(selected);
    }else if(index == 2){
      setUploadMediaFile2(selected);
    }else if(index == 3){
      setUploadMediaFile3(selected);
    }else if(index == 4){
      setUploadMediaFile4(selected);
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
    }else if(index == 3){
      setPreviewUrl3(URL.createObjectURL(file));
    }else if(index == 4){
      setPreviewUrl4(URL.createObjectURL(file));
    }
  }; 
  
  
  const validation = (values) => {
    setError("");
    let hasError = false;
    if ( (!values.title || values.title.trim() == "") || (!values.contactNumber || values.contactNumber.trim() == "") || (!values.email || values.email.trim() == "") ) {
      setError("Mandatory fields are missing");
      return hasError = true;
    }
    if(!values.id || values.id == null){        //check this for add case
        if( (!uploadMediaFile || uploadMediaFile == null) ){
            setError("Map Image is missing");
            return hasError = true;
        }
        if( (!uploadMediaFile2 || uploadMediaFile2 == null)  ){
            setError("Watsapp Image is missing");
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
    if ( (!values.addressTitle1 || values.addressTitle1.trim() == "") || (!values.address1 || values.address1.trim() == "") ) {
      setError("Mandatory fields are missing");
      return hasError = true;
    }
    if(uploadMediaFile3){
        if (!allowedImgTypes.includes(uploadMediaFile3.type)) {
            setFileError3("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            return hasError = true;
        }            
        if (uploadMediaFile3.size > MAX_IMAGE_SIZE) {
            setFileError3(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
            return hasError = true;
        }
    }
    if(uploadMediaFile4){
        if (!allowedImgTypes.includes(uploadMediaFile4.type)) {
            setFileError4("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
            return hasError = true;
        }            
        if (uploadMediaFile4.size > MAX_IMAGE_SIZE) {
            setFileError4(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
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
    // console.log("formData >>", contactFormData);
    try {
      let hasError = validation(contactFormData);
      if (!hasError) {
        setIsLoading(true);

        let mapFileUrl = contactFormData?.mapFileUrl;
        let watsappFileUrl = contactFormData?.watsappFileUrl;
        let formFileUrl = contactFormData?.formFileUrl;
        let faqFileUrl = contactFormData?.faqFileUrl;
        if (uploadMediaFile != null) {
            let uploadRes = await uploadFileOnS3(uploadMediaFile);
            if (uploadRes) {
                mapFileUrl = uploadRes;
            }
        }
        if (uploadMediaFile2 != null) {
            let uploadRes2 = await uploadFileOnS3(uploadMediaFile2);
            if (uploadRes2) {
                watsappFileUrl = uploadRes2;
                // console.log('file save step1');
            }
        }
        if (uploadMediaFile3 != null) {
            let uploadRes3 = await uploadFileOnS3(uploadMediaFile3);
            if (uploadRes3) {
                formFileUrl = uploadRes3;
            }
        }
        if (uploadMediaFile4 != null) {
            let uploadRes4 = await uploadFileOnS3(uploadMediaFile4);
            if (uploadRes4) {
                faqFileUrl = uploadRes4;
            }
        }
        // console.log('file save step2 ');
        await formProcess(mapFileUrl, watsappFileUrl, formFileUrl, faqFileUrl);
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

  const formProcess = async (mapFileUrl, watsappFileUrl, formFileUrl, faqFileUrl) => {
    const body = {
      contactId: contactFormData?.id,

      title: contactFormData.title,
      contactNumber: contactFormData.contactNumber,
      email: contactFormData.email,
      addressTitle1: contactFormData.addressTitle1,
      address1: contactFormData.address1 || "",
      location1: contactFormData.location1 || "",
      addressTitle2: contactFormData.addressTitle2 || "",
      address2: contactFormData.address2 || "",
      location2: contactFormData.location2 || "",
      addressTitle3: contactFormData.addressTitle3 || "",
      address3: contactFormData.address3 || "",
      location3: contactFormData.location3 || "",

      heading: contactFormData.heading || "",
      formTitle: contactFormData.formTitle || "",
      formHeading: contactFormData.formHeading || "",
      faqTitle: contactFormData.faqTitle || "",
      faqHeading: contactFormData.faqHeading || "",

      mapFileUrl: mapFileUrl,
      watsappFileUrl: watsappFileUrl,  
      formFileUrl: formFileUrl,  
      faqFileUrl: faqFileUrl,      
    };
    let urlEndPoint = `/contactus/add`;
    if(contactFormData?.id > 0){
        urlEndPoint = `/contactus/update`;
    }
    // console.log("postData >>", urlEndPoint, body);

    try {
        const response = await axiosInstance.post(urlEndPoint, body);
        // console.log('resposne ', response.data);
        if (response.data.status === "success") {
            const saved = response.data.data;

            setContactFormData(saved);
            // setPreviewUrl(saved.fileViewUrl1);
            setUploadMediaFile(null);
            setUploadMediaFile2(null);
            setUploadMediaFile3(null);
            setUploadMediaFile4(null);

            setSuccessMsg(response.data.message);
            // Update HomePage state
            onChange(saved);
        } else {
            setError(response.data.message);
        }

    } catch (error) {
        console.log("ContactUs Submit error:", error);
        if (error.status === 403) {
            handleLogout();
        }

        setError(error.response?.data?.message || error.message || "Unable to save contactus" );
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
              value={contactFormData.title}
              placeholder="Enter Title"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Contact Number<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="contactNumber"
              value={contactFormData.contactNumber}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={15}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Email<span className="text-danger">*</span> <small>(Use "," for multiple emails)</small>
            </Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={contactFormData.email}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}></Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Map Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
              <span className="text-danger">*</span>
            </Form.Label>
            {fileError && (
              <p className="mt-2 text-sm text-red-600" variant="danger">
                ⚠️ {fileError}
              </p>
            )}
            <Form.Control type="file" name="mapFileUrl" onChange={(e)=> handleFileChange(e, 1)} />
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
                (!uploadMediaFile && contactFormData.mapFileViewUrl) &&
                <>
                    <img src={contactFormData.mapFileViewUrl} height={100} width={100} alt="img" />
                </>
            }
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Watsapp QR Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
              <span className="text-danger">*</span>
            </Form.Label>
            {fileError2 && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError2}
              </p>
            )}
            <Form.Control type="file" name="watsappFileUrl" onChange={(e)=> handleFileChange(e, 2)} />
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
                (!uploadMediaFile2 && contactFormData.watsappFileViewUrl) &&
                <>
                    <img src={contactFormData.watsappFileViewUrl} height={100} width={100} alt="img" />
                </>
            }
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address Title<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="addressTitle1"
              value={contactFormData.addressTitle1}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Location Link
            </Form.Label>
            <Form.Control
              type="text"
              name="location1"
              value={contactFormData.location1}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="address1"
              value={contactFormData.address1}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address Title 2
            </Form.Label>
            <Form.Control
              type="text"
              name="addressTitle2"
              value={contactFormData.addressTitle2}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Location Link
            </Form.Label>
            <Form.Control
              type="text"
              name="location2"
              value={contactFormData.location2}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address
            </Form.Label>
            <Form.Control
              type="text"
              name="address2"
              value={contactFormData.address2}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address Title 3
            </Form.Label>
            <Form.Control
              type="text"
              name="addressTitle3"
              value={contactFormData.addressTitle3}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Location Link
            </Form.Label>
            <Form.Control
              type="text"
              name="location3"
              value={contactFormData.location3}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Address
            </Form.Label>
            <Form.Control
              type="text"
              name="address3"
              value={contactFormData.address3}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>        
        
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Form Title
            </Form.Label>
            <Form.Control
              type="text"
              name="formTitle"
              value={contactFormData.formTitle}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Form Heading
            </Form.Label>
            <Form.Control
              type="text"
              name="formHeading"
              value={contactFormData.formHeading}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Form Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
            </Form.Label>
            {fileError3 && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError3}
              </p>
            )}
            <Form.Control type="file" name="formFileUrl" onChange={(e)=> handleFileChange(e, 3)} />
          </Form.Group>
        </Col>
        <Col md="6">
            {
                (uploadMediaFile3 && previewUrl3) && 
                <>
                <img src={previewUrl3} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                </>
            }
            {
                (!uploadMediaFile3 && contactFormData.formFileViewUrl) &&
                <>
                    <img src={contactFormData.formFileViewUrl} height={100} width={100} alt="img" />
                </>
            }
        </Col>

        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Impact Heading
            </Form.Label>
            <Form.Control
              type="text"
              name="heading"
              value={contactFormData.heading}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={255}
            />
          </Form.Group>
        </Col>


        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Faq Title
            </Form.Label>
            <Form.Control
              type="text"
              name="faqTitle"
              value={contactFormData.faqTitle}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Faq Heading
            </Form.Label>
            <Form.Control
              type="text"
              name="faqHeading"
              value={contactFormData.faqHeading}
              placeholder="Enter Here"
              onChange={handleChange} maxLength={155}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">
              Faq Image <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
            </Form.Label>
            {fileError4 && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ {fileError4}
              </p>
            )}
            <Form.Control type="file" name="faqFileUrl" onChange={(e)=> handleFileChange(e, 4)} />
          </Form.Group>
        </Col>
        <Col md="6">
            {
                (uploadMediaFile4 && previewUrl4) && 
                <>
                <img src={previewUrl4} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                </>
            }
            {
                (!uploadMediaFile4 && contactFormData.faqFileViewUrl) &&
                <>
                    <img src={contactFormData.faqFileViewUrl} height={100} width={100} alt="img" />
                </>
            }
        </Col>
           
        <Col md={12}>
          <Form.Group className="text-end">
            <Button variant="outline-primary" onClick={handleSubmit} disabled={isSubmit || isLoading}>
              <span>{ !contactFormData?.id ? "Save" : "Update" }</span>
            </Button>
          </Form.Group>
        </Col>

      </Row>   
      </Form>
    </div>
  );
};
export default ContactSection;