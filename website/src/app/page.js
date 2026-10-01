
import media from "@/lib/media";
import { getHomePage } from "@/lib/api";

import Footer from '../Components/Footer';
import Banner from "@/Components/home/Banner";
import About from "@/Components/home/About";
import AreasCoveredComponent from "@/Components/home/AreasCovered";
import Testimonials from "@/Components/home/Testimonials";
import Projects from "@/Components/home/Projects";
import Partners from "@/Components/home/Partners";
import ZigZagSection from "@/Components/home/ZigZagSection";
import FeatureSection from "@/Components/home/FeatureSection";

export default async function HomePage() {
  const homeData = await getHomePage();


    if (!homeData) {
        return (
            <main>
                <p>Home page content is unavailable.</p>
            </main>
        );
    }
    const pageVideoUrl = homeData.PageVideos?.[0].fileViewUrl;
    const pageMediaType = homeData.PageVideos?.[0].type;

  return (
    <main>
      <div>
      <Banner data={homeData.PageBanners?.[0]} />

      <About data={homeData.PageAbouts?.[0]} />
      <AreasCoveredComponent data={homeData.PageMaps?.[0]} />
      <Projects  homeData={homeData} data={homeData.projects} />
      <Testimonials  homeData={homeData} data={homeData.testimonials} />
      {
        (pageVideoUrl && pageMediaType.includes("image")) && 
        <>
        <div className="gif-section">
          <img
            src={media(pageVideoUrl)} // Display the GIF
            alt="Hero GIF"
            className="hero-gif"
          />
        </div>
        </>
      }
      {
        (pageVideoUrl && pageMediaType.includes("video")) && 
        <>
        <div className="gif-section">
          <video
              src={media(pageVideoUrl)}
              style={{
                  maxHeight: "500px",
                  maxWidth: "100%",
                  borderRadius: "8px"
              }}
          />
        </div>
        </>
      }

      <Partners data={homeData.partners} />
      
      <ZigZagSection  homeData={homeData} data={homeData.PageZigZags}/>

      <FeatureSection data={homeData.PageFeatures}/>
      
      </div>   
    </main>
    
  );
}