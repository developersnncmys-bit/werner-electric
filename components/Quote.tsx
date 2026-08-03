const text =
  "“Every operator input has to feel right and read right for millions of cycles, across every shift. That’s the standard Werner builds to.”";

export default function Quote() {
  const words = text.split(" ");

  return (
    <section className="quote">
      <div className="quote__inner">
        <blockquote className="quote__text">
          {words.map((w, i) => (
            <span className="quote__word" key={i}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </blockquote>
        <p className="quote__author">Werner Electric &mdash; engineering ethos</p>
      </div>
    </section>
  );
}
