import Image from "next/image";

export default function Testimonial({ data }) {
  if (!data) {
    return null;
  }

  return (
    <section className="testimonial-section">
      <div className="container">

        {data.title && (
          <h2>{data.title}</h2>
        )}

        {data.image && (
          <Image
            src={data.image}
            alt={data.name || "Testimonial"}
            width={120}
            height={120}
            loading="lazy"
          />
        )}

        <blockquote>
          {data.description}
        </blockquote>

        {data.name && (
          <h3>{data.name}</h3>
        )}

        {data.designation && (
          <span>{data.designation}</span>
        )}

      </div>
    </section>
  );
}