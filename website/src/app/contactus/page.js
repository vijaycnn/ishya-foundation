import ContactUs from "@/views/ContactUs";
import { getContactPage } from "@/lib/api";



export default async function Page() {
  const contactData = await getContactPage();
  console.log('contact data', contactData);
  
    if (!contactData) {
      return (
        <main>
          <p>Home page content is unavailable.</p>
        </main>
      );
    }

  return <ContactUs data={contactData} />;
}
