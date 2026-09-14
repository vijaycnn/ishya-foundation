import "./globals.css";
import Providers from "@/Components/Providers";

export const metadata = {
  title: "Ishya Foundation",
  description:
    "Ishya Foundation empowers underprivileged children and women through education, skills, and community programs.",
  icons: {
    icon: "/IshyaLogo.png",
    apple: "/IshyaLogo.png",
  },
};

export default function RootLayout({ children }) {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
