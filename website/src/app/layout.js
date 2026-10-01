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
  const menu = await getMenu();
  const header = { contactNumber : '+919871005650' }

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
        <Navbar homeData={header} menu={menu?.data} />

        <Providers>{children}</Providers>
           
        <Footer/>
      </body>
    </html>
  );
}
