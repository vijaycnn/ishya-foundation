import React, { useEffect, useState } from "react";
import { Card, Button, Form, Alert, Accordion, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./../components/LoadingSpinner";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const VideoSection = ({ data = [], pageId, onChange }) => {

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

    const [videoFormData, setVideoFormData] = useState({
        id: currentBanner?.id || 0,
        pageId: currentBanner?.pageId || pageId,
        type: currentBanner?.type || "",
        fileUrl: currentBanner?.fileUrl || "",
        fileViewUrl: currentBanner?.fileViewUrl || "",
    });    
    
    useEffect(() => {
        const banner = data?.[0];
        console.log('video data', banner)
        if (banner) {
            setVideoFormData({
                id: banner.id || 0,
                pageId: banner.pageId || pageId,
                type: banner?.type || "",
                fileUrl: banner.fileUrl || "",
                fileViewUrl : banner.fileViewUrl,
            });

        } else {
            setVideoFormData({
                id: 0,
                pageId,
                type: "",
                fileUrl: "", fileViewUrl: "",
            });

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
        "video/webm",
        "video/quicktime",     // MOV
        "video/x-msvideo",     // AVI
        "video/x-ms-wmv",      // WMV
        "video/mpeg",          // MPG/MPEG
        "video/3gpp",          // 3GP
        "video/3gpp2",         // 3G2
    ];
    const MAX_IMAGE_SIZE = 200 * 1024 * 1024; // 200 MB
    const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB
    const MAX_IMAGE_SIZE_LBL = "200 MB";
    const MAX_VIDEO_SIZE_LBL = "200 MB";

    const fileUploadEvent = (file) => {
      const selected = file; //e.target.files[0];
      setFileError(""); // reset
      if (!selected) return;
      console.log("fileType", selected.type );
        setVideoFormData((prev)=> ({
            ...prev, type: selected.type
        }));

      if(selected.type.includes('video')){
        
        if (!allowedVideoTypes.includes(selected.type)) {
            setFileError("Only WEBM, MP4, AVI, MOV, MPG, WMV, 3GP, 3G2 files are allowed.");
            setUploadMediaFile(null);
            return;
        }
        if (selected.size > MAX_VIDEO_SIZE) {
          setFileError(`File size must be less than ${MAX_VIDEO_SIZE_LBL}.`);
          setUploadMediaFile(null);
          return;
        }
      }else if(selected.type.includes('image')){
        
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
        if(!values.type || values.type.trim() == ''){
          setError("Media information is missing");
          hasError = true;
        }
        if(uploadMediaFile){
          if(values.type.includes('video')){
            if (!allowedVideoTypes.includes(uploadMediaFile.type)) {
                setFileError("Only WEBM, MP4, AVI, MOV, MPG, WMV, 3GP, 3G2 files are allowed.");
                hasError = true;
            }
            if (uploadMediaFile.size > MAX_VIDEO_SIZE) {
              setFileError(`File size must be less than ${MAX_VIDEO_SIZE_LBL}.`);
              hasError = true;
            }
          }else if(values.type.includes('image') ){
            if (!allowedImgTypes.includes(uploadMediaFile.type)) {
                setFileError("Only JPEG, PNG, JPG, TIFF, GIF, WEBP, SVG, BMP files are allowed.");
                hasError = true;
            }  
            if (uploadMediaFile.size > MAX_IMAGE_SIZE) {
              setFileError(`File size must be less than ${MAX_IMAGE_SIZE_LBL}.`);
              hasError = true;
            }      
          }
        }
        return hasError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setIsSubmit(true);
        console.log("formData >>", videoFormData);
        try {
        let hasError = validation(videoFormData);
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
        if(!videoFormData.id){
            await addMedia(fileUrl.trim());
        }else{
            await updateMedia(videoFormData.id, fileUrl.trim());
        }
    };

    const addMedia = async (fileUrl) => {

        const body = {
            pageId,
            type: videoFormData.type,
            fileUrl,
        };
        console.log("add video >>", body);
        try {
            const response = await axiosInstance.post(`/page/addPagevideo`,body);

            if (response.data.status === "success") {
                const savedBanner = response.data.data;

                setVideoFormData(savedBanner);
                // setPreviewUrl(savedBanner.fileUrl);
                setUploadMediaFile(null);

                setSuccessMsg(response.data.message);
                // Update HomePage state
                onChange([savedBanner]);

            } else {
                setError(response.data.message);
            }

        } catch (error) {
            console.log("Add video error:", error);
            if (error.status === 403) {
                handleLogout();
            }

            setError(error.response?.data?.message || error.message || "Unable to save video" );

        } finally {
            setIsLoading(false);
            setIsSubmit(false);
        }
    };

    const updateMedia = async (videoId, fileUrl) => {

        const body = {
            videoId,
            type: videoFormData.type,
            fileUrl,
        };

        try {

            const response = await axiosInstance.post(`/page/updatePagevideo`, body);

            if (response.data.status === "success") {

                const updatedBanner = response.data.data;
                console.log('update video', updateBanner, response.data);

                setVideoFormData(updatedBanner);
                setUploadMediaFile(null);

                setSuccessMsg(response.data.message);
                onChange([updatedBanner]);

            } else {

                setError(response.data.message);
            }

        } catch (error) {

            console.log("Update video error:", error);
            if (error.status === 403) {
                handleLogout();
            }
            setError( error.response?.data?.message || error.message || "Unable to update video");

        } finally {

            setIsLoading(false);
            setIsSubmit(false);
        }
    };

    const isImage = (fileType) => {
        console.log('isImage aya ', fileType)
        return fileType?.includes("image");
    };

    const isVideo = (fileType) => {
        console.log('isVideo aya ', fileType)
        return fileType?.includes("video");
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
        <Card className="mb-3" key="banner">
          <Card.Body>

            <div className="d-flex justify-content-between mb-3">
              <h6>Image / Video </h6>

              {/* {videoFormData?.id > 0 && (
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
                        <small>(Max. FileSize {MAX_VIDEO_SIZE_LBL})</small>
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
                        {isImage(videoFormData.type)}
                        {uploadMediaFile &&
                            previewUrl &&
                            isImage(videoFormData.type) && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxHeight: "200px",
                                        maxWidth: "100%",
                                        borderRadius: "8px"
                                    }}
                                />
                            )
                        }

                        {/* New selected VIDEO */}
                        {uploadMediaFile &&
                            previewUrl &&
                            isVideo(videoFormData.type) && (
                                <video
                                    src={previewUrl}
                                    controls
                                    style={{
                                        maxHeight: "200px",
                                        maxWidth: "100%",
                                        borderRadius: "8px"
                                    }}
                                />
                            )
                        }

                        {/* Existing IMAGE */}
                        {!uploadMediaFile &&
                            videoFormData.fileViewUrl &&
                            isImage(videoFormData.type) && (
                                <img
                                    src={videoFormData.fileViewUrl}
                                    alt="Current media"
                                    style={{
                                        maxHeight: "200px",
                                        maxWidth: "100%",
                                        borderRadius: "8px"
                                    }}
                                />
                            )
                        }


                        {/* Existing VIDEO */}
                        {!uploadMediaFile &&
                            videoFormData.fileViewUrl &&
                            isVideo(videoFormData.type) && (
                                <video
                                    src={videoFormData.fileViewUrl}
                                    controls
                                    style={{
                                        maxHeight: "200px",
                                        maxWidth: "100%",
                                        borderRadius: "8px"
                                    }}
                                />
                            )
                        }
                        
                    {/* {
                        (uploadMediaFile && previewUrl) && 
                        <>
                        <img src={previewUrl} alt="preview" style={{ maxHeight: "150px", borderRadius: "8px" }} />
                        </>
                    }
                    {
                        (!uploadMediaFile && videoFormData.fileViewUrl) &&
                        <>
                            <img src={videoFormData.fileViewUrl} height={100} width={100} alt="img" />
                        </>

                    } */}
                    </div>
                </div> 

                <div className="text-end mt-3">
                    <Button variant="outline-primary" onClick={handleSubmit} disabled={isLoading || !uploadMediaFile} >
                        {isLoading ? "Saving..." : videoFormData?.id ? "Update" : "Save"}
                    </Button>
                </div>
                          
            </div>

            </Form>      

          </Card.Body>
        </Card>
    </>
  );
};
export default VideoSection;