import ProjectDetail from "@/views/ProjectDetail";
import { getProgramPage } from "@/lib/api";

export default async function Page({ params }) {

  const { id } = await params;

  const pageData = await getProgramPage(id);

  if (!pageData) {
    return (
      <main>
        <p>Page content is unavailable.</p>
      </main>
    );
  }

  return <ProjectDetail pageData={pageData} />;
}