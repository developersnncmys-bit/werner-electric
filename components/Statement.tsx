import Image from "next/image";

export default function Statement() {
  return (
    <section className="statement">
      <div className="statement__fill" aria-hidden="true" />
      <div className="statement__inner">
        <h2 className="statement__title">
          <span className="statement__word">From a pushbutton</span>{" "}
          <span className="statement__word">to a full control room.</span>
        </h2>

        <p className="statement__body">
          Werner Electric builds the human-facing layer of industrial control &mdash;
          pilot lights, vandal-proof metal switches, annunciators, remote pendants and hardwired
          mosaic panels. Every product engineered for a million cycles, refined by senior mechanical
          designers on real shop floors across India and Turkey.
        </p>

        <div className="statement__cta">
          <span className="statement__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M4 12h14M13 6l7 6-7 6"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <a href="#products" className="statement__pill">
            Explore products
          </a>
        </div>
      </div>
    </section>
  );
}
