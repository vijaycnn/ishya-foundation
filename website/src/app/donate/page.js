import Donate from "@/views/Donate";
import { getDonatePage } from "@/lib/api";

export default async function Page() {
  const pageData = await getDonatePage();

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <Donate pageData={pageData} />;
}
