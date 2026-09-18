import React, { useEffect, useState } from "react";
import { Card, Button, Accordion, Spinner } from "react-bootstrap";

const AboutSection = ({ data, onChange }) => {

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

      <div className="row">

        <div className="col-md-6 mb-3">
          <label>Title</label>
          <input
            className="form-control"
            value={data.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Sub Title</label>
          <input
            className="form-control"
            value={data.subtitle}
            onChange={(e) =>
              updateField("subtitle", e.target.value)
            }
          />
        </div>

      </div>

      <div className="row">

        <div className="col-md-6 mb-3">
          <label>Image 1</label>

          {/* ImageUploader */}
        </div>

        <div className="col-md-6 mb-3">
          <label>Image 2</label>

          {/* ImageUploader */}
        </div>

      </div>

      <hr />

      <h6>Our Mission</h6>

      <input
        className="form-control mb-2"
        value={data.mission?.title || ""}
        onChange={(e) =>
          updateNested(
            "mission",
            "title",
            e.target.value
          )
        }
      />

      <textarea
        className="form-control mb-3"
        value={data.mission?.description || ""}
        onChange={(e) =>
          updateNested(
            "mission",
            "description",
            e.target.value
          )
        }
      />

      <h6>Our Vision</h6>

      <input
        className="form-control mb-2"
        value={data.vision?.title || ""}
        onChange={(e) =>
          updateNested(
            "vision",
            "title",
            e.target.value
          )
        }
      />

      <textarea
        className="form-control"
        value={data.vision?.description || ""}
        onChange={(e) =>
          updateNested(
            "vision",
            "description",
            e.target.value
          )
        }
      />

    </div>
  );
};
export default AboutSection;