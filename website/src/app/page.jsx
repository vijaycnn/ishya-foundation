import { getHomePage } from "@/lib/api/home";

import Navbar from '../Components/Navbar';
import Banner from "@/Components/home/Banner";
import About from "@/Components/home/About";
// import Testimonial from "@/Components/home/Testimonial";

export default async function HomePage() {
  const homeData = await getHomePage();


    if (!homeData) {
        return (
            <main>
                <p>Home page content is unavailable.</p>
            </main>
        );
    }
  return (
    <main>
      <div>
      <Navbar/>
      <Banner data={homeData.PageBanners?.[0]} />

      <About data={homeData.PageAbouts?.[0]} />

      {/* <Testimonial data={homeData.testimonial} /> */}
      </div>
    </main>
  );
}