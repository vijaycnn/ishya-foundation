import Gallery from "@/views/Gallery";
import { getGalleries } from "@/lib/api";

export default async function Page() {
  const pageData = await getGalleries();

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <Gallery pageData={pageData} />;
}
