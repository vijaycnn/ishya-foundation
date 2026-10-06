"use client";

import media from "@/lib/media";
import "../Styles/AboutUsIntro.css";
// import overlap1 from "../Images/AboutOverlap1.png"
// import overlap2 from "../Images/AboutOverlap2.png"


export default function OverlappingImageSection( {aboutInfo} ) {


  let remarks = aboutInfo?.remarks
    .replace(/<(.|\n)*?>/g, "") // remove html tags
    .replace(/&nbsp;/g, " ")
    .trim();

  return (
    <div className="container">
      <div className="image-container">
        {/* Main Image */}
        
        {aboutInfo?.fileViewUrl1 && (
          <>
              <img
                src={media(aboutInfo.fileViewUrl1)}
                alt="Main"
                className="main-image"
                loading="lazy"
              />
          </>
        )}
        {aboutInfo.fileUrlTxt1 && (
            <>
              <div className="points-tile">{aboutInfo.fileUrlTxt1}</div>
            </>
        )}
        
        {aboutInfo?.fileViewUrl2 && (
          <>
              <img
                src={media(aboutInfo.fileViewUrl2)}
                alt="Overlay"
                className="overlay-image"
                loading="lazy"
              />
          </>
        )}
        {aboutInfo.fileUrlTxt2 && (
            <>
              <div className="points-tile">{aboutInfo.fileUrlTxt2}</div>
            </>
        )}

        {/* <img
          src={media(overlap1)}
          alt="Main"
          className="main-image"
          loading="lazy"
        />
        <img
          src={media(overlap2)}
          alt="Overlay"
          className="overlay-image"
          loading="lazy"
        /> */}
      </div>
      <div className="text-container">
        {
          (aboutInfo?.title) &&
          <h2>{aboutInfo?.title} </h2>
        }
        {aboutInfo?.remarks && remarks.length > 0 ? (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: aboutInfo?.remarks || "" }}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
