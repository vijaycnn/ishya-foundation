import PartnershipsPage from "@/views/PartnershipsPage";
import { getPartnershipPage } from "@/lib/api";

export default async function Page() {
  const data = await getPartnershipPage();
  console.log('partnership data', data);
  
    if (!data) {
      return (
        <main>
          <p>Page content is unavailable.</p>
        </main>
      );
    }
  return <PartnershipsPage data={data} />;
}
