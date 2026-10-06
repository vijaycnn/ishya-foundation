import ProjectsPage from "@/views/ProjectsPage";
import { getAllProgram } from "@/lib/api";

export default async function Page() {
  const pageData = await getAllProgram();
    
  if (!pageData) {
      return (
          <main>
              <p>Page content is unavailable.</p>
          </main>
      );
  }
  return <ProjectsPage pageData={pageData} />;
}
