import Newsletter from "@/views/Newsletter";
import { getNewsLetters } from "@/lib/api";

export default async function Page() {
  const pageData = await getNewsLetters();

  if (!pageData) {
    return (
      <main>
        <p>page content is unavailable.</p>
      </main>
    );
  }
  return <Newsletter pageData={pageData} />;
}
