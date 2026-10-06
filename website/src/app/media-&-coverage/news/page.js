import AllNews from "@/views/AllNews";
import { getNews } from "@/lib/api";

export default async function Page() {
  const pageData = await getNews();

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <AllNews pageData={pageData} />;
}
