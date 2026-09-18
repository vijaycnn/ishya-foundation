import React, { useEffect, useState } from "react";
import { Card, Button, Form, Accordion, Spinner } from "react-bootstrap";
import LoadingSpinner from "./../components/LoadingSpinner";

const BannerSection = ({ data = [], onChange }) => {


    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [fileError, setFileError] = useState("");
    const [uploadMediaFile, setUploadMediaFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
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
    const MAX_IMAGE_SIZE = 200 * 1024 * 1024; // 200 MB
    const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
    const MAX_IMAGE_SIZE_LBL = "200 MB";
    const MAX_VIDEO_SIZE_LBL = "500 MB";

    const fileUploadEvent = (file) => {
      const selected = file; //e.target.files[0];
      setFileError(""); // reset
      if (!selected) return;
      console.log("fileType", selected.type, formData);
      // if(formData.type.trim() == 'video'){
      //   if (!allowedVideoTypes.includes(selected.type)) {
      //       setFileError(
      //       "Only WEBM, MP4, MP3, AVI, VOB, MKV, MOV, FLV, AMV, MPG, WMV, 3GP, 3G2, SVI files are allowed."
      //       );
      //       setUploadMediaFile(null);
      //       return;
      //   }
      //   if (selected.size > MAX_VIDEO_SIZE) {
      //     setFileError(`File size must be less than ${MAX_VIDEO_SIZE_LBL}.`);
      //     setUploadMediaFile(null);
      //     return;
      //   }
      // }else{
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
      // }
      setUploadMediaFile(selected);
    };
    const handleFileChange = (e) => {
      // console.log("handleFileChange >>");
      const file = e.target.files[0];
      if (!file) return;

      fileUploadEvent(file);
      setPreviewUrl(URL.createObjectURL(file));
    };

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
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
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
      {data?.map((item, index) => (
        <Card className="mb-3" key={index}>
          <Card.Body>

            <div className="d-flex justify-content-between mb-3">
              <h6>Banner {index + 1}</h6>

              <Button
                variant="danger"
                size="sm"
                onClick={() => removeBanner(index)}
              >
                Remove
              </Button>
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
                        <img
                        src={previewUrl}
                        alt="preview"
                        style={{ maxHeight: "150px", borderRadius: "8px" }}
                        />
                    <div className="text-muted mt-1">
                        <small>Current media</small>
                    </div>
                    </div>
                </div> 

                <div className="text-right mt-3">            
                    <Button variant="outline-primary" onClick={addBanner}>Save</Button>
                </div>
                          
            </div>

            </Form>      

          </Card.Body>
        </Card>
      ))}

      {/* <Button variant="outline-primary" onClick={addBanner}>+ Add Banner</Button> */}
    </>
  );
};
export default BannerSection;