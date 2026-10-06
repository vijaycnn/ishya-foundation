import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import axiosInstance from "../helper/constants/axiosInstance";
import { isQuillEmpty } from "../helper/validation";

const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
const baseURL = import.meta.env.VITE_API_BASE_URL_BACKEND + "/api";

const MAX_ITEMS = 4;

const emptyItem = {
  id: 0,
  title: "",
  btnText: "",
  btnLink: "",
  fileUrl: "",
  fileViewUrl: "",
  file: null,
  remarks: "",
  orderNumber: 1,
};

const initialData = {
  items: [],
};

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_SIZE_LBL = "10 MB";

const ValueSection = ({ data, pageId, onChange }) => {

  console.log('values data ', pageId, data);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [previewUrls, setPreviewUrls] = useState({});

  const [deletedIds, setDeletedIds] = useState([]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("auth-token");
    localStorage.clear();

    navigate(adminAlias);
  };

  const sectionData = {
    ...initialData,
    ...(data || {}),
    items: Array.isArray(data?.items) ? data.items : [],
  };

  // --------------------------------------------------
  // Stable key for each item
  // --------------------------------------------------

  const getItemKey = (item, index) => {
    if (item?.id && Number(item.id) > 0) {
      return `id-${item.id}`;
    }

    if (item?._tempId) {
      return item._tempId;
    }

    return `new-${index}`;
  };

  // --------------------------------------------------
  // Update parent state
  // --------------------------------------------------

  const updateSection = (updatedData) => {
    onChange(updatedData);
  };

  // --------------------------------------------------
  // Item change
  // --------------------------------------------------

  const handleItemChange = (index, field, value) => {
    const items = [...sectionData.items];

    items[index] = {
      ...items[index],
      [field]: value,
    };

    updateSection({
      ...sectionData,
      items,
    });
  };

  // --------------------------------------------------
  // Add item
  // --------------------------------------------------

  const addItem = () => {
    if (sectionData.items.length >= MAX_ITEMS) {
      setError(`Maximum ${MAX_ITEMS} items are allowed.`);
      return;
    }

    setError("");

    const newItem = {
      ...emptyItem,

      // Important:
      // gives new item a stable identity
      _tempId: `new-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,

      orderNumber: sectionData.items.length + 1,
    };

    updateSection({
      ...sectionData,
      items: [...sectionData.items, newItem],
    });
  };

  // --------------------------------------------------
  // Remove item
  // --------------------------------------------------

  const removeItem = (index) => {
    const item = sectionData.items[index];

    // Existing DB record
    if (item?.id && Number(item.id) > 0) {
      setDeletedIds((prev) => {
        if (prev.includes(item.id)) {
          return prev;
        }

        return [...prev, item.id];
      });
    }

    // Remove local preview if exists
    const itemKey = getItemKey(item, index);

    setPreviewUrls((prev) => {
      const previewUrl = prev[itemKey];

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const updated = {
        ...prev,
      };

      delete updated[itemKey];

      return updated;
    });

    // Remove item and re-number
    const items = sectionData.items
      .filter((_, itemIndex) => itemIndex !== index)
      .map((item, itemIndex) => ({
        ...item,
        orderNumber: itemIndex + 1,
      }));

    updateSection({
      ...sectionData,
      items,
    });
  };

  // --------------------------------------------------
  // Move item
  // --------------------------------------------------

  const moveItem = (index, direction) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= sectionData.items.length) {
      return;
    }

    const items = [...sectionData.items];

    [items[index], items[newIndex]] = [items[newIndex], items[index]];

    const reorderedItems = items.map((item, itemIndex) => ({
      ...item,
      orderNumber: itemIndex + 1,
    }));

    updateSection({
      ...sectionData,
      items: reorderedItems,
    });
  };

  // --------------------------------------------------
  // Image selection
  // --------------------------------------------------

  const handleImageSelect = (event, index) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file.");

      event.target.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_IMAGE_SIZE) {
      setError(`Image size should not exceed ${MAX_IMAGE_SIZE_LBL}.`);

      event.target.value = "";
      return;
    }

    const item = sectionData.items[index];

    const itemKey = getItemKey(item, index);

    // Create browser preview
    const previewUrl = URL.createObjectURL(file);

    // Revoke previous local preview
    setPreviewUrls((prev) => {
      if (prev[itemKey]) {
        URL.revokeObjectURL(prev[itemKey]);
      }

      return {
        ...prev,
        [itemKey]: previewUrl,
      };
    });

    handleItemChange(index, "file", file);

    // Allow selecting same file again
    event.target.value = "";
  };

  // --------------------------------------------------
  // Generate S3 upload URL
  // --------------------------------------------------

  const getUploadUrl = async (file) => {
    const response = await fetch(`${baseURL}/enquiry/generateUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to generate upload URL.");
    }

    return response.json();
  };

  // --------------------------------------------------
  // Upload file to S3
  // --------------------------------------------------

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const { uploadUrl, fileUrl, key } = await getUploadUrl(file);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Unable to upload file: ${file.name}`);
    }

    return {
      fileUrl,
      key,
    };
  };

  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      if (!pageId) {
        throw new Error("Page ID is not available.");
      }

      if (sectionData.items.length === 0) {
        throw new Error("Please add at least one Feature subsection.");
      }

      // ------------------------------------------
      // Validate items
      // ------------------------------------------

      sectionData.items.forEach((item, index) => {
        const title = item.title?.trim();
        
        if (isQuillEmpty(item.remarks)) {
          throw new Error(`Please enter remarks for Section ${index + 1}.`);
        }
      });

      // ------------------------------------------
      // Upload new images
      // ------------------------------------------

      const items = [];
      for (const item of sectionData.items) {
        
        items.push({
          id: item.id || 0,
          remarks: isQuillEmpty(item.remarks) ? "" : item.remarks,
          orderNumber: item.orderNumber,
        });
      }

      // ------------------------------------------
      // Single DB API
      // ------------------------------------------

      const payload = {
        pageId,
        items,
        deletedIds,
      };

      const response = await axiosInstance.post("/page/value/save", payload);

      if (response.data?.status !== "success") {
        throw new Error(
          response.data?.message || "Unable to save Our Values section.",
        );
      }
      ////////////////////////////////////////////////////////////////////

      /////////////////////////////////////
      // ------------------------------------------
      // Update frontend state after Save
      // ------------------------------------------

      const savedItems = response.data?.data?.items || items;

      const currentItems = sectionData.items;

      // Preserve local preview URLs
      const updatedPreviewUrls = {};

      const finalItems = savedItems.map((savedItem, index) => {
        const currentItem = currentItems[index];

        const oldItemKey = getItemKey(currentItem, index);

        const newItemKey = getItemKey(savedItem, index);

        // if (savedItem.fileViewUrl) {
        //   // Backend has provided signed URL
        //   // so local preview is no longer required.
        // } else if (previewUrls[oldItemKey]) {
        //   updatedPreviewUrls[newItemKey] = previewUrls[oldItemKey];
        // } else if (currentItem?.fileViewUrl) {
        //   updatedPreviewUrls[newItemKey] = currentItem.fileViewUrl;
        // }

        return {
          ...savedItem,

          // File has already been uploaded
          file: null,
        };
      });

      // Update preview state
    //   setPreviewUrls((prev) => {
    //     const finalPreviewUrls = {
    //       ...prev,
    //       ...updatedPreviewUrls,
    //     };

    //     currentItems.forEach((currentItem, index) => {
    //       const oldItemKey = getItemKey(currentItem, index);

    //       const savedItem = savedItems[index];

    //       const newItemKey = getItemKey(savedItem, index);

    //       if (oldItemKey !== newItemKey) {
    //         delete finalPreviewUrls[oldItemKey];
    //       }
    //     });

    //     return finalPreviewUrls;
    //   });

      // Update parent
      updateSection({
        items: finalItems,
      });
      ///////////////////////////////////////

      setDeletedIds([]);

      setSuccess("Our Values saved successfully.");
    } catch (err) {
      console.error("Save Our Values error:", err);

      if (err?.response?.status === 403) {
        handleLogout();
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save Our Values section.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Cleanup local preview URLs
  // --------------------------------------------------

//   useEffect(() => {
//     return () => {
//       Object.values(previewUrls).forEach((url) => {
//         URL.revokeObjectURL(url);
//       });
//     };
//   }, []);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Card>
      <Card.Body>
        {/* Error */}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Success */}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0"></h6>

          <Button
            variant="primary"
            size="sm"
            onClick={addItem}
            disabled={sectionData.items.length >= MAX_ITEMS}
          >
            <span className="nav-link-text">+ Add Section</span>
          </Button>
        </div>

        {/* Empty */}

        {sectionData.items.length === 0 && (
          <Alert variant="info">No section added yet.</Alert>
        )}

        {/* Items */}

        {sectionData.items.map((item, index) => {
          const itemKey = getItemKey(item, index);

          /*
           * Priority:
           *
           * 1. New selected image
           * 2. Existing signed S3 URL
           */
          const previewUrl = previewUrls[itemKey] || item.fileViewUrl || "";

          return (
            <Card key={itemKey} className="mb-3">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Section {index + 1}</strong>

                  <div className="d-flex gap-1">
                    {/* Move Up */}

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                    >
                      ↑
                    </Button>

                    {/* Move Down */}

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={index === sectionData.items.length - 1}
                      onClick={() => moveItem(index, 1)}
                    >
                      ↓
                    </Button>

                    {/* Remove */}

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card.Header>

              <Card.Body>
                <Row>
                  {/* <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Title<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={item.title || ""}
                        onChange={(e) =>
                          handleItemChange(index, "title", e.target.value)
                        }
                        placeholder="Enter section title"
                      />
                    </Form.Group>
                  </Col> */}

                  {/* Remarks */}

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Context<span className="text-danger">*</span>
                      </Form.Label>

                      <ReactQuill
                        theme="snow"
                        value={item.remarks || ""}
                        onChange={(content) =>
                          handleItemChange(index, "remarks", content)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}

        {/* Counter */}

        {sectionData.items.length > 0 && (
          <div className="text-muted mt-2">
            {sectionData.items.length} / {MAX_ITEMS} sections added
          </div>
        )}

        {/* Save */}

        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="outline-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ValueSection;
