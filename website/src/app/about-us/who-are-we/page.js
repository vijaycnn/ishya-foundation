import AboutUs from "@/views/AboutUs";
import { getAboutPage } from "@/lib/api";

export default async function Page() {
  const data = await getAboutPage();
  
  if (!data) {
    return (
      <main>
        <p>Home page content is unavailable.</p>
      </main>
    );
  }
  
  return <AboutUs aboutData={data} />;
}
