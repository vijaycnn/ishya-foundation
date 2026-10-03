import React, { useEffect, useState } from "react";
import { Card, Button, Form, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const BannerSection = ({ data = [], pageId, onChange }) => {

    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("isAuthenticated");
        localStorage.clear("auth-token");
        localStorage.clear();
        navigate(adminAlias);
    };
    
    const currentBanner = data?.[0] || null;

    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [fileError, setFileError] = useState("");
    const [uploadMediaFile, setUploadMediaFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState( '');

    const [bannerFormData, setBannerFormData] = useState({
        id: currentBanner?.id || 0,
        pageId: currentBanner?.pageId || pageId,
        type: currentBanner?.type || "",
        fileUrl: currentBanner?.fileUrl || "",
        fileViewUrl: currentBanner?.fileViewUrl || "",
    });    
    
    useEffect(() => {
        const banner = data?.[0];
        console.log('banner data', banner)
        if (banner) {
            setBannerFormData({
                id: banner.id || 0,
                pageId: banner.pageId || pageId,
                type: banner.type || "",
                fileUrl: banner.fileUrl || "",
                fileViewUrl : banner.fileViewUrl,
            });

            // setPreviewUrl(banner.fileUrl || "");
        } else {
            setBannerFormData({
                id: 0,
                pageId,
                type: "",
                fileUrl: "", fileViewUrl: "",
            });

            // setPreviewUrl("");
        }
        setUploadMediaFile(null);
    }, [data, pageId]);

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
    const allowedVideoTypes = [
        "video/mp4",
        "audio/mpeg",
        "video/x-ms-wmv",
        "webm",
        "mkv",
        "flv",
        "vob",
        "mov",
        "avi",
        "wmv",
        "yuv",
        "amv",
        "mp4",
        "mpg",
        "svi",
        "3gp",
        "3g2",
    ];
    const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100 MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
    const MAX_IMAGE_SIZE_LBL = "100 MB";
    const MAX_VIDEO_SIZE_LBL = "100 MB";

    const fileUploadEvent = (file) => {
      const selected = file; //e.target.files[0];
      setFileError(""); // reset
      if (!selected) return;
      console.log("fileType", selected.type );
      if(selected.type.includes('video')){
        setBannerFormData((prev)=> ({
            ...prev, type: selected.type
        }));
        if (!allowedVideoTypes.includes(selected.type)) {
            setFileError(
            "Only WEBM, MP4, MP3, AVI, VOB, MKV, MOV, FLV, AMV, MPG, WMV, 3GP, 3G2, SVI files are allowed."
            );
            setUploadMediaFile(null);
            return;
        }
        if (selected.size > MAX_VIDEO_SIZE) {
          setFileError(`File size must be less than ${MAX_VIDEO_SIZE_LBL}.`);
          setUploadMediaFile(null);
          return;
        }
      }else if(selected.type.includes('image')){
        setBannerFormData((prev)=> ({
            ...prev, type: selected.type
        }));

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
      }else{
        setBannerFormData((prev)=> ({
            ...prev, type: ""
        }));
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

    const validation = (values) => {
        setError("");
        let hasError = false;
        
        if ((!uploadMediaFile || uploadMediaFile == null)) {
          setError("Media file is required");
          hasError = true;
        }
        if(uploadMediaFile){
          if(values.type.includes('video')){
            if (!allowedVideoTypes.includes(uploadMediaFile.type)) {
                setFileError(
                "Only WEBM, MP4, MP3, AVI, VOB, MKV, MOV, FLV, AMV, MPG, WMV, 3GP, 3G2, SVI files are allowed."
                );
                hasError = true;
            }
            if (uploadMediaFile.size > MAX_VIDEO_SIZE) {
              setFileError(`File size must be less than ${MAX_VIDEO_SIZE_LBL}.`);
              hasError = true;
            }
          }else if(values.type.includes('image') ){
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
          }else{
            setFileError("Invalid File");
            hasError = true;
          }
        }
        return hasError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setIsSubmit(true);
        console.log("formData >>", bannerFormData);
        try {
        let hasError = validation(bannerFormData);
        if (!hasError) {
            //Now, process with data
            setIsLoading(true);
            if (uploadMediaFile) {
                await formProcess();
            } 
            setIsLoading(false);  //setShow(false);
        }
        setIsSubmit(false); 
        } catch (error) {
        console.log("Catch Err >>", error);
        setError(error.message);
        alert(error.message);
        setIsLoading(false);
        setIsSubmit(false);
        return;
        }    
        // getGalleries();
    };

    const formProcess = async () => {
        // console.log("fileObject >>", `${baseURL}/enquiry/upload-url`, uploadMediaFile);

        const { uploadUrl, fileUrl } = await getUploadUrl(uploadMediaFile);
        console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

        const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadMediaFile.type },
        body: uploadMediaFile,
        });
        console.log("uploadRes", uploadRes);
        if (uploadRes.status !== 200) {
            throw new Error("Media upload failed");
        }            
        if(!bannerFormData.id){
            await addMedia(fileUrl.trim());
        }else{
            await updateMedia(bannerFormData.id, fileUrl.trim());
        }
    };

    const addMedia = async (fileUrl) => {

        const body = {
            pageId,
            type: bannerFormData.type,
            fileUrl,
        };
        console.log("add banner >>", body);
        try {
            const response = await axiosInstance.post(`/page/addBanner`,body);

            if (response.data.status === "success") {
                const savedBanner = response.data.data;

                setBannerFormData(savedBanner);
                setPreviewUrl(savedBanner.fileUrl);
                setUploadMediaFile(null);

                setSuccessMsg(response.data.message);
                // Update HomePage state
                onChange([savedBanner]);

            } else {
                setError(response.data.message);
            }

        } catch (error) {
            console.log("Add banner error:", error);
            if (error.status === 403) {
                handleLogout();
            }

            setError(error.response?.data?.message || error.message || "Unable to save banner" );

        } finally {
            setIsLoading(false);
            setIsSubmit(false);
        }
    };

    const updateMedia = async (bannerId, fileUrl) => {

        const body = {
            bannerId,
            type: bannerFormData.type,
            fileUrl,
        };

        try {

            const response = await axiosInstance.post(`/page/updateBanner`, body);

            if (response.data.status === "success") {

                const updatedBanner = response.data.data;
                console.log('update banner', updateBanner, response.data);

                setBannerFormData(updatedBanner);
                setUploadMediaFile(null);

                setSuccessMsg(response.data.message);
                onChange([updatedBanner]);

            } else {

                setError(response.data.message);
            }

        } catch (error) {

            console.log("Update banner error:", error);
            if (error.status === 403) {
                handleLogout();
            }
            setError( error.response?.data?.message || error.message || "Unable to update banner");

        } finally {

            setIsLoading(false);
            setIsSubmit(false);
        }
    };
    const updateMediaOld = async (mediaId, fileUrl)=>{
        let body = {
        galleryId: mediaId,
        type: formData.type,
        title: formData.title,
        fileUrl: fileUrl,
        };
        // console.log("data >>", data);
        await axiosInstance
        .post(`/gallery/update`, body)
        .then((response) => {
            // console.log('response >>> ', response.data);
            if (response.data.status === "success") {
            setFormData({
                type: "",
                title: "",
                fileUrl: "",  filePath:""
            });
            setSuccessMsg(response?.data?.message);
            setIsLoading(false);
            } else if (response.data.status === "error") {
            setError(response.data.message);
            }
        })
        .catch((error) => {
            console.log(">>> ", error.status, error);
            if (error.status === 403) {
            handleLogout();
            }
            setIsLoading(false);
            setIsSubmit(false);
        });
        setIsLoading(false);
    }

  const addBanner = () => {
    onChange([
      ...data,
      {
        title: "",
        subtitle: "",
        description: "",
        image: "",
        buttonText: "",
        buttonUrl: "",
        sortOrder: data.length + 1,
        status: true,
      },
    ]);
  };

  const removeBanner = (index) => {
    // const updated = data.filter((_, i) => i !== index);
    onChange([]);
  };

  const updateBanner = (index, field, value) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  return (
    <>
      {/* {data?.map((item, index) => ( */}
        <Card className="mb-3" key="banner">
          <Card.Body>

            <div className="d-flex justify-content-between mb-3">
              <h6>Banner </h6>

              {/* {bannerFormData?.id > 0 && (
                    <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={removeBanner}
                    disabled={isLoading}
                    >
                    {isLoading ? "Removing..." : "Remove Banner"}
                    </Button>
                )}                 */}
            </div>
            <Form>
                {error && <Alert variant="danger">⚠️{error}</Alert>}
                {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {/* Image uploader here */}

            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-12">
                        <Form.Label className="fw-medium">
                        <small>(Max. FileSize {MAX_IMAGE_SIZE_LBL})</small>
                        <span className="text-danger">*</span>
                        </Form.Label>
                        {fileError && (
                        <p className="mt-2 text-sm text-red-600 text-danger"><small>⚠️ {fileError}</small></p>
                        )}
                        <Form.Control type="file"  onChange={handleFileChange} />
                    </Form.Group>

                </div>
                <div className="col-md-6">
                    <div className="mb-3 text-center">
                    {
                        (uploadMediaFile && previewUrl) && 
                        <>
                        <img src={previewUrl} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                        </>
                    }
                    {
                        (!uploadMediaFile && bannerFormData.fileViewUrl && bannerFormData.type.includes('image')) &&
                        <>
                            <img src={bannerFormData.fileViewUrl} height={100} width={100} alt="img" />
                        </>

                    }
                    {
                        (!uploadMediaFile && bannerFormData.fileViewUrl && bannerFormData.type.includes('video')) &&
                        <>
                            <video
                                src={bannerFormData.fileViewUrl}
                                controls
                                style={{
                                    maxHeight: "200px",
                                    maxWidth: "100%",
                                    borderRadius: "8px"
                                }}
                            />                           
                        </>

                    }
                    <div className="text-muted mt-1">
                        <small>{bannerFormData?.id ? "Current banner" :  (uploadMediaFile ? "New banner preview" : "")}</small>
                    </div>
                    </div>
                </div> 

                <div className="text-end mt-3">
                    <Button variant="outline-primary" onClick={handleSubmit} disabled={isLoading || !uploadMediaFile} >
                        {isLoading ? "Saving..." : bannerFormData?.id ? "Replace Banner" : "Save Banner"}
                    </Button>
                </div>
                          
            </div>

            </Form>      

          </Card.Body>
        </Card>
      {/* ))} */}
      {/* { 
        (data[0]?.id == 0 || !data) &&
        <Button variant="outline-primary" onClick={addBanner}>+ Add Banner</Button>
      } */}

    </>
  );
};
export default BannerSection;