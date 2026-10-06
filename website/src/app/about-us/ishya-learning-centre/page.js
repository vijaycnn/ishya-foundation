import ILC from "@/views/ILC";
import { getLearningPage } from "@/lib/api";

export default async function Page() {
  const pageData = await getLearningPage();
  
  
    if (!pageData) {
        return (
            <main>
                <p>Page content is unavailable.</p>
            </main>
        );
    }

  return <ILC pageData={pageData} />;
}
