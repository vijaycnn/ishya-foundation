import "./globals.css";
import Providers from "@/Components/Providers";
import Navbar from "@/Components/Navbar";
import Footer from '@/Components/Footer';
import { getMenu } from "@/lib/api";

export const metadata = {
  title: "Ishya Foundation",
  description:
    "Ishya Foundation empowers underprivileged children and women through education, skills, and community programs.",
  icons: {
    icon: "/IshyaLogo.png",
    apple: "/IshyaLogo.png",
  },
};

export default async function RootLayout({ children }) {
  const result = await getMenu();
  const menu = result?.data?.menu;
  const contact = result?.data?.contact;
  const footerContext = result?.data?.footerContext;

  // console.log('menu result', result)
  // console.log('menu ', menu)
  // console.log('footer ', footerContext)

  const header = { contactNumber : contact.contactNumber }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Navbar homeData={header} menu={menu} />

        <Providers>{children}</Providers>
           
        <Footer contactData={contact} footer={footerContext} />
      </body>
    </html>
  );
}
