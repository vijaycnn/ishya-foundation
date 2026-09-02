import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

/**
 * Brand color palette
 */
const COLORS = [
  "#000000",
  "#ffffff",
  "#1A1A1A",
  "#666666",
  "#E30613", // brand red
  "#0D47A1", // brand blue
  "#2E7D32", // brand green
  "#F9A825", // brand yellow
  "#6A1B9A", // purple
  "#00838F", // teal
];

/**
 * Quill toolbar & formats
 */
const modules = {
  clipboard: {
    matchVisual: false,
  },
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ color: COLORS }, { background: COLORS }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "align",
  "link",
];

/**
 * Utility: check empty editor
 */
export const isQuillEmpty = (html) =>
  !html || html === "<p><br></p>" || html === "<p></p>";

/**
 * Reusable Rich Text Editor
 */
const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Enter content...",
  error = "",
  height = 200,
}) => {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: height }}
      />

      {error && <div className="text-danger mt-1">{error}</div>}
    </div>
  );
};

export default RichTextEditor;
