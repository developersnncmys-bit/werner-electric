const text =
  "Every operator input has to feel right and read right for millions of cycles, across every shift. That's the standard Werner builds to.";

export default function Quote() {
  const words = text.split(" ");

  return (
    <section className="quote" id="testimonial">
      <div className="quote__portrait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/testimonial.png" alt="Werner Electric — engineering ethos" />
      </div>
      <div className="quote__inner">
        <blockquote className="quote__text">
          &ldquo;
          {words.map((w, i) => (
            <span className="quote__word" key={i}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
          &rdquo;
        </blockquote>
        <p className="quote__attr">Werner Electric &mdash; engineering ethos</p>
        <a href="#story" className="quote__link">
          Read the case study
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 10 L10 2 M4 2 H10 V8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
