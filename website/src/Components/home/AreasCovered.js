import Image from "next/image";
import media from "@/lib/media";
import "../../Styles/AreasCovered.css";

export default function AreasCoveredComponent({ data }) {
  // console.log("Map DATA >>>",  data.length, data);

  if (!data.id) {
    return null;
  }

  let remarks = data?.remarks
    .replace(/<(.|\n)*?>/g, "") // remove html tags
    .replace(/&nbsp;/g, " ")
    .trim();

  return (
    <div className="areas-covered-container">
      <div className="areas-covered">
        {/* Left Image Section (Indian map) */}
        <div className="map-section">
          <img
            src={media(data.fileViewUrl)} // Replace with actual image URL
            alt="Indian Map"
            className="india-map-image"
            loading="lazy"
          />
        </div>
        {/* Right Text Section */}
        <div className="text-section">
          <h2 className="heading">{data?.title}</h2>
          {/* <p className="description"> */}
          {data?.remarks && remarks.length > 0 ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: data?.remarks || "" }} />
            </>
          ) : (
            ""
          )}
          {/* </p> */}
          <div className="horizontal-bar">
            <p className="bar-text">{data?.subTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
