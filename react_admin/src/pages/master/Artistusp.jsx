import {Badge,Row,Col,Button,Table, Modal, Form,Alert, FloatingLabel} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BiPencil, BiTrash } from "react-icons/bi";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

function Artistusp() {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [items, setItems] = useState(null);
  const slidePageNumber = 'artistusp';

  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploadMediaFile, setUploadMediaFile] = useState(null);
  
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    let offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffset(offset);
  };

  const getSlideFiles = async () => {
    setIsLoading(true);
    
    const body = { params: { offset: offset, perPage: perPage } };
    // console.log('body>>> ', body);
    await axiosInstance.get(`/slideFile/list/${slidePageNumber}`, body)
			.then((response) => {
        // console.log('>>> ', response.data);
				setIsLoading(false)
				if (response.data.status === "success") {
					setPageCount(Math.ceil(response.data?.totalRecords / perPage))
					setItems(response.data?.data)
					setTotalRecords(response.data?.totalRecords)	
				}
			}).catch((error) => {
        // console.log('>>> ', error.status, error);
        if(error.status === 403){
          handleLogout();
        }
        setIsLoading(false)
        });
  };

  const changeStatus = async(index, currentStatus, slideId)=>{
    setIsLoading(true);
    
    const body = { slideId, status: currentStatus == 1 ? 0 : 1 };
    // console.log('body>>> ', body);
    await axiosInstance.post(`/slideFile/changeStatus`, body)
			.then((response) => {
        // console.log('>>> ', response.data);
				setIsLoading(false)
				if (response.data.status === "success") {
          items[index].status = currentStatus == 1 ? 0 : 1;
				}
			}).catch((error) => {
        console.log('>>> ', error.status, error);
        if(error.status === 403){
          // alert('Session Timeout');
          handleLogout();
        }
        setIsLoading(false);
      });
    setIsLoading(false);  
  }

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };
  
  useEffect(() => {
    if (!isLoading) {
      getSlideFiles();
    }
  }, [offset, perPage]);

  const [formData, setFormData] = useState({
    fileUrl: "",
    filePath: "",
  });
  const openAdd = () => {
    setMode("add"); setError(""); setSuccessMsg("");  setPreviewUrl("");
    setFormData({ type: "image", title: "", fileUrl: "", filePath : "" });
    setUploadMediaFile(null);
    setShow(true);
  };
  const [previewUrl, setPreviewUrl] = useState("");
  const openEdit = (item) => {
    setMode("edit"); setError(""); setSuccessMsg("");
    setEditId(item.id);
    setFormData({
      fileUrl: item.fileUrl,
      filePath : item.filePath,
    });
    setPreviewUrl(item.filePath);
    setUploadMediaFile(null);
    setFileError("");
    setShow(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmit(true);
    // console.log("formData >>", formData);
    try {
      let hasError = validation(formData);
      if (!hasError) {
        //Now, process with data
        setIsLoading(true);
        if (mode === "add") {
          await formProcess();
        } else {
          if (uploadMediaFile) {
            await formProcess(); // upload new & update
          } else {
            await updateMedia(editId, formData.fileUrl); // keep old
          }
        }
        setIsLoading(false);  setShow(false);
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
    getSlideFiles();
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
    console.log("s3 url >>", uploadUrl, " ::::", fileUrl);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": uploadMediaFile.type },
      body: uploadMediaFile,
    });
    console.log("uploadRes", uploadRes);
    // const uploadRes = { status : 200 }
    if (uploadRes.status == 200) {
      if(mode == 'add'){
        await addMedia(fileUrl.trim());
      }else{
        await updateMedia(editId, fileUrl.trim());
      }
    }
  };

  const addMedia = async (fileUrl)=>{
    let body = {
      slideNumber: slidePageNumber.trim(),
      fileUrl: fileUrl,
    };
    // console.log("data >>", data);
    await axiosInstance
      .post(`/slideFile/create`, body)
      .then((response) => {
        // console.log('response >>> ', response.data);
        if (response.data.status === "success") {
          setFormData({
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

  const updateMedia = async (mediaId, fileUrl)=>{
    let body = {
      slideId: mediaId,
      slideNumber: slidePageNumber.trim(),
      fileUrl: fileUrl,
    };
    // console.log("data >>", data);
    await axiosInstance
      .post(`/slideFile/update`, body)
      .then((response) => {
        // console.log('response >>> ', response.data);
        if (response.data.status === "success") {
          setFormData({
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
        if ( !uploadMediaFile || uploadMediaFile == null) {
          setError("Media file is required");
          hasError = true;
        }
        if(uploadMediaFile){
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
        }
        return hasError;
    };

  const [showPreview, setShowPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
    
  const showItems = () => {
    return isLoading == false ? (
      <>
        <Table responsive className="table v-align-middle table-striped medium">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>File</th>
              <th>Status</th>
              <th width="120" className="col-fixed">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-muted">
            {items.map((item, $index) => {
              return (
                <>
                  <tr key={item.id}>
                    <td>{$index +offset +1}</td>
                    <td>      
                      {
                          (item.fileUrl) ?
                          <>
                              <div
                                style={{ width: 100, height: 100, background: "#000", borderRadius: "6px", position: "relative", cursor: "pointer",
                                }}
                                onClick={() => {
                                  setPreviewMedia(item);
                                  setShowPreview(true);
                                }}
                              >
                                <video
                                  src={item.filePath} muted preload="metadata" onMouseEnter={(e) => e.target.play()}
  onMouseLeave={(e) => e.target.pause()} width={100} height={100} style={{ objectFit: "cover", borderRadius: "6px" }}
                                />
                                <span
                                  style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                                    background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: "50%", padding: "6px 10px", fontSize: "14px",
                                  }}
                                >
                                  ▶
                                </span>
                              </div>
                          </> : "NA"
                      }
                    </td>
                    {/* <td>{moment(item.createdAt).format('DD-MM-YYYY')}</td> */}
                    <td>
                      {item.status == 1 ? <Badge bg="success" >Active</Badge> : <Badge bg="secondary" >In-active</Badge> } 
                    </td>
                    <td className="col-fixed">
                        <Link title="Edit" onClick={ ()=>openEdit(item)} className="btn btn-icon">
                            <BiPencil />
                        </Link>
                        &nbsp;
                        <Link title={item.status == 1 ? 'In-Active' : 'Active'} onClick={()=>changeStatus($index, item.status, item.id)}  className="btn btn-icon">
                            <BiTrash />
                        </Link>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </>
    ) : (
      <LoadingSpinner />
    );
  };
  return (
    <>
      <h1 className="h4 mb-4 font-secondary fw-medium">ArtistUsp Background</h1>
      <div className="table-view bg-white rounded-4 p-4">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Total Records :{" "}
            <span className="text-dark fw-bold">{totalRecords ? totalRecords : 0}</span>
          </div>
          <div>
            {
                (!items || items.length == 0) ?
                <>
                <Link onClick={ ()=>openAdd()} className="btn btn-primary btn-sm">
                    <span className="nav-link-text">Add-Media</span>
                </Link>
                </> : ''
            }              
          </div>
        </div>
        {
          (items && items.length > 0) ? showItems()
          : <>
          <div className="d-flex text-muted justify-content-center p-5 w-100 align-items-center flex-column">
            <i className="fa fa-database fa-3x mb-3"></i>
            <p>Sorry, no record found!</p>
          </div>
          </>
        }        
      </div>
        <Modal id="frm" name="frm" size="" show={show} centered onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === "add" ? "Add Media" : "Edit Media"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Form.Group > */}
                <Form>
                {error && <Alert variant="danger">⚠️{error}</Alert>}
                {successMsg && <Alert variant="success">{successMsg}</Alert>}
                    {mode === "edit" && previewUrl && (
                      <div className="mb-3 text-center">
                        <video src={previewUrl} controls style={{ maxHeight: "150px", borderRadius: "8px" }} />
                        
                        <div className="text-muted mt-1">
                          <small>Current media</small>
                        </div>
                      </div>
                    )}
                    <Form.Group className="mb-12">
                      <Form.Label className="fw-medium">
                        <small>(Max. FileSize {MAX_VIDEO_SIZE_LBL})</small>
                        <span className="text-danger">*</span>
                      </Form.Label>
                      {fileError && (
                        <p className="mt-2 text-sm text-red-600 text-danger"><small>⚠️ {fileError}</small></p>
                      )}
                      <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    
                    </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}  disabled={isSubmit}>
                    <span className="nav-link-text">{mode === "add" ? "Save" : "Update"}</span>
                </Button>                
            </Modal.Footer>            
        </Modal>

        <Modal id="preview" name="preview" show={showPreview} onHide={() => setShowPreview(false)} centered size="lg" >
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-center">
              <video src={previewMedia?.filePath} controls autoPlay style={{ width: "100%", borderRadius: "8px" }} />
          </Modal.Body>
        </Modal>

      {items ? (
        items.length > 0 ? (
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={
              "pagination justify-content-center flex-wrap mt-3"
            }
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        ) : null
      ) : null}
    </>
  );
}

export default Artistusp;
