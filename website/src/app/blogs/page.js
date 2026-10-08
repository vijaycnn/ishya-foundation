import Blogs from "@/views/Blogs";
import { getBlogs } from "@/lib/api";

export default async function Page() {
  const pageData = await getBlogs();

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <Blogs pageData={pageData} />;
}

