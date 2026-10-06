import {
  Alert,
  Form,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useState, useEffect, useRef, } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosInstance from "../../helper/constants/axiosInstance";
import { decode as base64_decode } from "base-64";
import { isQuillEmpty } from "../../helper/validation";

const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const MAX_NEEDS = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;


const allowedTypes = [
  "image/svg+xml",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/bmp",
  "image/tiff",
  "image/gif",
  "image/webp",
];

const emptyNeed = () => ({
  id: null,
  title: "",
  remarks: "",
  file: null,
  fileUrl: "",
  fileViewUrl: "",
  fileError: "",
});

const emptyForm = {
  programTypeId: null,
  name: "",
  shortDesc: "",
  title: "",
  remarks: "",

  fileUrl: "",
  fileViewUrl: "",

  impactHeading: "",
  impactTitle: "",
  impactFile: null,
  impactFileUrl: "",
  impactFileViewUrl: "",
  impactDescription: "",

  joinTitle: "",
  joinFile: null,
  joinFileUrl: "",
  joinFileViewUrl: "",
  joinDescription: "",
};

function EditProgram() {
  const navigate = useNavigate();
  const params = useParams();

  const [programId, setProgramId] = useState(null);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [fileError, setFileError] = useState("");

  const [uploadMediaFile, setUploadMediaFile] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [programNeeds, setProgramNeeds] = useState([]);
  const messageRef = useRef(null);

  const focusMessage = () => {
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.focus();

        messageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  useEffect(() => {
    try {
      const decoded = base64_decode(params.id);
      const id = parseInt(decoded.split("+")[1]);

      if (!id || id <= 0) {
        setError("Invalid Program ID.");
        return;
      }

      setProgramId(id);
    } catch (err) {
      console.error("Invalid program ID:", err);
      setError("Invalid Program ID.");
    }
  }, [params.id]);
  const [typeList, setTypeList] = useState([]);
  const getTypeList = async () => {
    await axiosInstance.get(`/program/typeList`)
      .then((response) => {
        // console.log(">>> ", response.data);
        setLoading(false);
        if (response.data.status === "success") {
          setTypeList(response?.data?.data);
        }
      })
      .catch((error) => {
        // console.log(">>> ", error.status, error);
        if (error.status === 403) {
          // alert('Session Timeout');
          handleLogout();
        }
      });
  };

  useEffect(() => {
    if (typeList.length == 0) {
      getTypeList();
    }
  }, []);
  // Get Program Detail
  useEffect(() => {
    if (programId) {
      getProgramDetail();
    }
  }, [programId]);

  const getProgramDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/program/getById/${programId}`);
      console.log('response ', response.data.data);
      if (response.data.status === "success") {
        const program = response.data.data;

        setFormData({

          programTypeId: program?.programTypeId || null,
          name: program?.name || "",
          shortDesc: program?.shortDesc || "",
          title: program?.title || "",
          remarks: program?.remarks || "",

          fileUrl: program?.fileUrl || "",
          fileViewUrl: program?.fileViewUrl || "",

          impactHeading: program?.impactHeading || "",
          impactTitle: program?.impactTitle || "",
          impactFile: null,
          impactFileUrl: program?.impactFileUrl || "",
          impactFileViewUrl: program?.impactFileViewUrl || "",
          impactDescription: program?.impactDescription || "",

          joinTitle: program?.joinTitle || "",
          joinFile: null,
          joinFileUrl: program?.joinFileUrl || "",
          joinFileViewUrl: program?.joinFileViewUrl || "",
          joinDescription: program?.joinDescription || "",
        });

        const needs = Array.isArray(program?.ProgramNeeds) ? program.ProgramNeeds : [];

        setProgramNeeds(
          needs.map((need) => ({
            id: need.id || null,
            title: need.title || "",
            remarks: need.remarks || "",
            file: null,
            fileUrl: need.fileUrl || "",
            fileViewUrl: need.fileViewUrl || "",
            fileError: "",
          }))
        );
      } else {
        setError(response.data.message || "Unable to load Program.");
        focusMessage();
      }
    } catch (err) {
      console.error("Get Program Detail Error:",err);

      if (
        err?.response?.status === 403 ||
        err?.status === 403
      ) {
        handleLogout();
        return;
      }

      setError(
        err?.response?.data?.message || err.message || "Unable to load Program.");
      focusMessage();
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Generic Input Change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // File Validation
  // --------------------------------------------------

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    if (!allowedTypes.includes(file.type)) {
      return (
        "Only JPEG, PNG, JPG, TIFF, GIF, WEBP, " +
        "SVG and BMP files are allowed."
      );
    }

    if (file.size > MAX_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE_MB} MB.`;
    }

    return "";
  };

  // --------------------------------------------------
  // Main Program Image
  // --------------------------------------------------

  const handleMainFileChange = (e) => {
    const file = e.target.files?.[0];

    setFileError("");

    if (!file) {
      setUploadMediaFile(null);
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setFileError(validationError);
      focusMessage();
      setUploadMediaFile(null);
      return;
    }

    setUploadMediaFile(file);
  };

  const handleImpactFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      focusMessage();
      return;
    }

    setFormData((prev) => ({
      ...prev,
      impactFile: file,
    }));

    setError("");
  };

  const handleJoinFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      focusMessage();
      return;
    }

    setFormData((prev) => ({
      ...prev,
      joinFile: file,
    }));

    setError("");
  };

  const addProgramNeed = () => {
    if (programNeeds.length >= MAX_NEEDS) {
      setError(
        `Maximum ${MAX_NEEDS} Program Needs can be added.`
      );
      return;
    }

    setProgramNeeds((prev) => [
      ...prev,
      emptyNeed(),
    ]);

    setError("");
  };

  const removeProgramNeed = (index) => {
    setProgramNeeds((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleNeedChange = (
    index,
    field,
    value
  ) => {
    setProgramNeeds((prev) =>
      prev.map((need, i) =>
        i === index
          ? {
              ...need,
              [field]: value,
            }
          : need
      )
    );
  };

  const handleNeedFileChange = (index,file) => {
    if (!file) {
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setProgramNeeds((prev) =>
        prev.map((need, i) =>
          i === index
            ? {
                ...need,
                fileError: validationError,
                file: null,
              }
            : need
        )
      );
      focusMessage();
      return;
    }

    setProgramNeeds((prev) =>
      prev.map((need, i) =>
        i === index
          ? {
              ...need,
              file,
              fileError: "",
            }
          : need
      )
    );
  };

  // --------------------------------------------------
  // S3 Upload URL
  // --------------------------------------------------

  const getUploadUrl = async (file) => {
    const response = await fetch(
      `${baseURL}/enquiry/generateUrl`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to generate upload URL."
      );
    }

    return response.json();
  };

  // --------------------------------------------------
  // Upload File
  // --------------------------------------------------

  const uploadFile = async (file) => {
    if (!file) { return ""; }

    const { uploadUrl,fileUrl,} = await getUploadUrl(file);
    const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type, },
        body: file,
      }
    );

    if (!uploadRes.ok) {
      throw new Error( `Unable to upload file: ${file.name}` );
    }

    return fileUrl;
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validation = () => {
    setError("");

    if (!formData.programTypeId || formData.programTypeId == null) {
      setError("Program Type is required.");
      return true;
    }
    if (!formData.name.trim()) {
      setError("Program name is required.");
      return true;
    }

    if (!formData.title.trim()) {
      setError("Program title is required.");
      return true;
    }

    if (!formData.shortDesc.trim()) {
      setError(
        "Short Description is required."
      );
      return true;
    }

    // Existing image is valid if no replacement
    if (!uploadMediaFile && !formData.fileUrl ) {
      setError("Program image is required.");
      return true;
    }

    // Validate Program Needs
    for (let i = 0; i < programNeeds.length; i++) {
      const need = programNeeds[i];

      console.log('need ...', need);

      // New need must have image.
      // Existing need can use existing image.
      if (!need.file && !need.fileUrl) {
        setError(`Program Need ${i + 1}: Image is required.`);
        return true;
      }

      if (isQuillEmpty(need.remarks)) {
        setError(`Program Need ${i + 1}: Remarks is required.`);
        console.log(' ...atka');
        return true;
      }
    }
    return false;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");
    setIsSubmit(true);

    try {
      if (validation()) {
        setIsSubmit(false); focusMessage();
        return;
      }

      setLoading(true);

      // ----------------------------------------------
      // Main Program Image
      // ----------------------------------------------

      let fileUrl = formData.fileUrl;

      if (uploadMediaFile) {
        fileUrl = await uploadFile(uploadMediaFile);
      }

      // ----------------------------------------------
      // Impact Image
      // ----------------------------------------------

      let impactFileUrl = formData.impactFileUrl;

      if (formData.impactFile) {
        impactFileUrl = await uploadFile(formData.impactFile);
      }

      // ----------------------------------------------
      // Join Image
      // ----------------------------------------------

      let joinFileUrl = formData.joinFileUrl;

      if (formData.joinFile) {
        joinFileUrl = await uploadFile(formData.joinFile);
      }

      // ----------------------------------------------
      // Program Needs
      // ----------------------------------------------

      const processedNeeds = [];

      for (const need of programNeeds) {
        let needFileUrl = need.fileUrl;

        if (need.file) {
          needFileUrl = await uploadFile(need.file);
        }

        processedNeeds.push({
          id: need.id || null,
          title: need.title.trim() || "",
          fileUrl: needFileUrl,
          remarks: need.remarks || "",
        });
      }

      // ----------------------------------------------
      // Final Request Body
      // ----------------------------------------------

      const body = {
        id: programId,
        programTypeId: formData.programTypeId,
        name: formData.name.trim(),
        shortDesc: formData.shortDesc,
        title: formData.title.trim(),
        remarks: formData.remarks,
        fileUrl,

        impactHeading:formData.impactHeading,
        impactTitle:formData.impactTitle,
        impactFileUrl,
        impactDescription:formData.impactDescription,

        joinTitle:formData.joinTitle,
        joinFileUrl,
        joinDescription:formData.joinDescription,

        programNeeds:processedNeeds,
      };

      console.log("Update Program body:",body);

      // ----------------------------------------------
      // Update Program
      // ----------------------------------------------

      const response = await axiosInstance.post(`/program/update`,body);

      console.log("Update Program response:",response);

      if (response.data.status ==="success") {
        setSuccessMsg(response.data.message ||"Program updated successfully.");
        focusMessage();
        setTimeout(() => {
          navigate(
            `${adminAlias}/programs`
          );
        }, 2000);
      } else {
        setError(response.data.message || "Unable to update Program." );
      }
    } catch (err) {
      console.error("Update Program Error:",err);
      
      if (
        err?.response?.status === 403 ||
        err?.status === 403
      ) {
        handleLogout();
        return;
      }

      setError(err?.response?.data?.message ||err.message ||"Something went wrong. Please try again.");
      focusMessage();
    } finally {
      setLoading(false);
      setIsSubmit(false);
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = () => {
    sessionStorage.removeItem(
      "isAuthenticated"
    );

    localStorage.removeItem(
      "auth-token"
    );

    localStorage.clear();

    navigate(adminAlias);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      {loading && (
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0 font-secondary fw-medium">
          Edit Program
        </h1>

        <div>
          <Link
            to={`${adminAlias}/programs`}
            className="btn btn-primary btn-sm"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="table-view bg-white rounded-4 p-4">
        <div
          ref={messageRef}
          tabIndex="-1"
          style={{
            scrollMarginTop: "20px",
          }}
        >
          {error && (
            <Alert variant="danger">
              ⚠️ {error}
            </Alert>
          )}

          {successMsg && (
            <Alert variant="success">
              {successMsg}
            </Alert>
          )}
        </div>

        <Form onSubmit={handleSubmit}>

          {/* ==========================================
              PROGRAM INFORMATION
          ========================================== */}

          <h5 className="mb-4">
            Program Information
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Type<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="programTypeId"
                  onChange={handleChange}
                  value={formData.programTypeId}
                >
                  <option value="">Select Type</option>
                  {typeList.map((data) => {
                    return (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Name
                  <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter Program Name"
                  onChange={handleChange}
                  maxLength={255}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Page Title
                  <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  placeholder="Enter Program Title"
                  onChange={handleChange}
                  maxLength={255}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Short Description
                  <span className="text-danger">
                    *
                  </span>
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  name="shortDesc"
                  value={formData.shortDesc}
                  placeholder="Enter short description"
                  onChange={handleChange}
                  maxLength={500}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Remarks
                </Form.Label>

                <ReactQuill
                  theme="snow"
                  value={
                    formData.remarks
                  }
                  onChange={(content) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        remarks:
                          content,
                      })
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Program Image
                  <small className="ms-1">
                    (Max.{" "}
                    {
                      MAX_FILE_SIZE_MB
                    }{" "}
                    MB)
                  </small>

                  <span className="text-danger">
                    *
                  </span>
                </Form.Label>

                {formData.fileViewUrl && (
                  <div className="mb-2">
                    <img
                      src={
                        formData.fileViewUrl
                      }
                      alt="Program Image"
                      style={{ maxWidth:"220px",maxHeight:"140px",objectFit:"contain",}}
                    />
                  </div>
                )}

                {fileError && (
                  <p className="mt-2 text-danger">
                    ⚠️ {fileError}
                  </p>
                )}

                <Form.Control
                  type="file"
                  accept={allowedTypes.join(
                    ","
                  )}
                  onChange={
                    handleMainFileChange
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ==========================================
              IMPACT SECTION
          ========================================== */}

          <hr className="my-4" />

          <h5 className="mb-4">
            Impact Section
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Impact Heading
                </Form.Label>

                <Form.Control
                  type="text"
                  name="impactHeading"
                  value={
                    formData.impactHeading
                  }
                  placeholder="Enter Impact Heading"
                  onChange={handleChange} maxLength={255}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Impact Title
                </Form.Label>

                <Form.Control
                  type="text"
                  name="impactTitle"
                  value={
                    formData.impactTitle
                  }
                  placeholder="Enter Impact Title"
                  onChange={handleChange} maxLength={255}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Impact Image
                </Form.Label>

                {formData.impactFileViewUrl && (
                  <div className="mb-2">
                    <img src={formData.impactFileViewUrl }
                      alt="Impact Image"
                      style={{ maxWidth:"220px",maxHeight:"140px",objectFit:"contain",}}
                    />
                  </div>
                )}

                <Form.Control
                  type="file"
                  accept={allowedTypes.join(",")}
                  onChange={handleImpactFileChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Impact Description
                </Form.Label>

                <ReactQuill
                  theme="snow"
                  value={
                    formData.impactDescription
                  }
                  onChange={(content) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        impactDescription:
                          content,
                      })
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ==========================================
              JOIN SECTION
          ========================================== */}

          <hr className="my-4" />

          <h5 className="mb-4">
            Join Section
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Join Title
                </Form.Label>

                <Form.Control
                  type="text"
                  name="joinTitle"
                  value={
                    formData.joinTitle
                  }
                  placeholder="Enter Join Title"
                  onChange={handleChange}  maxLength={255}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Join Image
                </Form.Label>

                {formData.joinFileViewUrl && (
                  <div className="mb-2">
                    <img
                      src={
                        formData.joinFileViewUrl
                      }
                      alt="Join Image"
                      style={{ maxWidth:"220px",maxHeight:"140px",objectFit:"contain",}}
                    />
                  </div>
                )}

                <Form.Control
                  type="file"
                  accept={allowedTypes.join(",")}
                  onChange={handleJoinFileChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Join Description
                </Form.Label>

                <ReactQuill
                  theme="snow"
                  value={
                    formData.joinDescription
                  }
                  onChange={(content) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        joinDescription:
                          content,
                      })
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ==========================================
              PROGRAM NEEDS
          ========================================== */}

          <hr className="my-4" />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1">
                Program Needs
              </h5>

              <small className="text-muted">
                You can add maximum{" "}
                {MAX_NEEDS} Program Needs.
              </small>
            </div>

            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              disabled={
                programNeeds.length >=
                MAX_NEEDS
              }
              onClick={
                addProgramNeed
              }
            >
              + Add
            </Button>
          </div>

          {programNeeds.length ===
            0 && (
            <Alert variant="light">
              No Program Need
              added. Click{" "}
              <strong>+ Add</strong>{" "}
              to add one.
            </Alert>
          )}

          {programNeeds.map(
            (need, index) => (
              <Card
                key={
                  need.id ||
                  `new-${index}`
                }
                className="mb-4 border"
              >
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>
                    Program Need{" "}
                    {index + 1}
                  </strong>

                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() =>
                      removeProgramNeed(
                        index
                      )
                    }
                  >
                    Remove
                  </Button>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Title
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={
                            need.title
                          }
                          placeholder="Enter Need Title"
                          maxLength={
                            200
                          }
                          onChange={(
                            e
                          ) =>
                            handleNeedChange(
                              index,
                              "title",
                              e.target
                                .value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Image
                          <span className="text-danger">
                            *
                          </span>
                        </Form.Label>

                        {need.fileViewUrl && (
                          <div className="mb-2">
                            <img src={ need.fileViewUrl}
                              alt={ need.title || "Program Need" }
                              style={{ maxWidth:"180px",maxHeight:"110px",objectFit:"contain",}}
                            />
                          </div>
                        )}

                        <Form.Control
                          type="file"
                          accept={allowedTypes.join(",")}
                          onChange={(
                            e
                          ) =>
                            handleNeedFileChange(
                              index,
                              e
                                .target
                                .files?.[0]
                            )
                          }
                        />

                        {need.fileError && (
                          <small className="text-danger">
                            ⚠️{" "}
                            {
                              need.fileError
                            }
                          </small>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          Remarks
                          <span className="text-danger">
                            *
                          </span>
                        </Form.Label>

                        <ReactQuill
                          theme="snow"
                          value={
                            need.remarks
                          }
                          onChange={(
                            content
                          ) =>
                            handleNeedChange(
                              index,
                              "remarks",
                              content
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )
          )}

          {/* ==========================================
              SUBMIT
          ========================================== */}

          <hr className="my-4" />

          <div className="text-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmit}
              className="pill"
              size="lg"
            >
              {isSubmit
                ? "Updating..."
                : "Update"}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default EditProgram;