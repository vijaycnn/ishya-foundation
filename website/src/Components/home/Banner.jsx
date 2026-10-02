import Image from "next/image";
import Link from "next/link";
import "../../Styles/Homepage.css";

export default function Banner({ data }) {
  // console.log("BANNER DATA >>>",  data.length, data);
  if (!data.id) {
    return null;
  }

  return (
    <section className="home-banner">
      <div className="hero-section" key={data.id}>
        <div className="hero-background">
          {data.type?.toLowerCase().includes("image") && data.fileViewUrl && (
            <Image
              src={data.fileViewUrl}
              alt="Ishya Foundation"
              width={1300}
              height={900}
              priority
            />
          )}
        </div>
        <div className="join-us-button">
          <Link href="/joinus">
            <button>Join Us</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
