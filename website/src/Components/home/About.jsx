import Image from "next/image";
import media from "@/lib/media";

export default function About({ data }) {
      // console.log("About DATA >>>",  data.length, data);

  if (!data.id) {
    return null;
  }

  let remarks = data?.remarks
    .replace(/<(.|\n)*?>/g, '') // remove html tags
    .replace(/&nbsp;/g, ' ')
    .trim();
  
  let tagDescription1 = data?.tagDescription1
    .replace(/<(.|\n)*?>/g, '') // remove html tags
    .replace(/&nbsp;/g, ' ')
    .trim();
  
  let tagDescription2 = data?.tagDescription2
    .replace(/<(.|\n)*?>/g, '') // remove html tags
    .replace(/&nbsp;/g, ' ')
    .trim();    

  return (
    // <section className="about-section">
      <div className="custom-component-container">
        <div className="custom-component">
          {/* Left Section */}
          <div className="left-section">
            {
              (data.title) &&
            <h4 className="small-heading">{data.title ?? ""}</h4>
            }
            {
              (data.title2) &&
              <h1 className="big-heading">{data.title2 ?? ""}</h1>
            }
            {
              (data.title3) &&
              <h1 className="big-heading2">{data.title3 ?? ""}</h1>
            }
            <div className="description-mission">
            {              
              (data?.remarks && remarks.length > 0) ?
              <>
              <div dangerouslySetInnerHTML={{ __html: data?.remarks || "" }} />
              </>: ''
            }
            </div>
            <div className="tiles">
              {
                (data.tagTitle1) &&
                <>
                <div className="tile">
                  <h3>{data.tagTitle1}</h3>
                  {              
                    (data?.tagDescription1 && tagDescription1.length > 0) ?
                    <>
                    <div dangerouslySetInnerHTML={{ __html: data?.tagDescription1 || "" }} />
                    </>: ''
                  }
                </div>
                </>
              }
              {
                (data.tagTitle2) &&
                <>
                  <div className="tile">
                    <h3>{data.tagTitle2}</h3>
                    {              
                      (data?.tagDescription2 && tagDescription2.length > 0) ?
                      <>
                      <div dangerouslySetInnerHTML={{ __html: data?.tagDescription2 || "" }} />
                      </>: ''
                    }
                  </div>  
                </>
              }              
            </div>
          </div>
  
          {/* Right Section */}
          <div className="right-section">
            {
              (data?.fileViewUrl1) &&
              <>
              <div className="image-container-mission">
                <img
                  src={media(data.fileViewUrl1)}
                  alt="Placeholder"
                  className="square-image"
                  loading="lazy"
                />
              </div>
              </>
            }
            {
              (data.fileUrlTxt1) &&
              <>
                <div className="points-tile">
                      {data.fileUrlTxt1}
                </div>
              </>
            }
            {
              (data?.fileViewUrl2) &&
              <>
              <div className="image-container-mission">
                <img
                  src={media(data.fileViewUrl2)}
                  alt="Placeholder"
                  className="square-image"
                  loading="lazy"
                />
              </div>
              </>
            }
            {
              (data.fileUrlTxt2) &&
              <>
                <div className="points-tile">
                      {data.fileUrlTxt2}
                </div>
              </>
            }
          </div>
        </div>
      </div>

    // </section>
  );
}