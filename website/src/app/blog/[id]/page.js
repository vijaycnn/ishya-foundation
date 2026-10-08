import BlogDetails from "@/views/BlogDetails";
import { getBlogDetails } from "@/lib/api";

export default async function Page({ params }) {
  const { id } = await params;
  const pageData = await getBlogDetails(id);

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <BlogDetails pageData={pageData} />;
}
