const values = [
  {
    title: "Trust",
    body: "We communicate openly with our customers and do what it takes to keep them happy.",
    keyword: "Openly",
  },
  {
    title: "Growth",
    body: "We’re obsessed with our customer’s success and take pride in their achievements.",
    keyword: "Obsessed",
  },
  {
    title: "Innovation",
    body: "We pursue ideas that could change our company, our country and maybe even the world.",
    keyword: "Pursue",
  },
  {
    title: "Equality",
    body: "We respect and value employees from every background, and we thrive as a result.",
    keyword: "Respect",
  },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__sticky">
          <h2 className="about__heading">
            About <em>Werner</em>
          </h2>
          <p className="about__body">
            Werner Products boasts clean and crispy design, bulletproof product consistency and
            intuitive builds. All our products were created by top industry leaders in mechanical
            design and with extensive feedback of user experience. Improve your customer
            satisfaction and enhance your product quality and profitability using Werner.
          </p>
          <p className="about__footnote">
            Werner is built on four core values that inspire us to work together every day toward
            improving the world.
          </p>
        </div>

        <div className="about__cards-wrap">
          <div className="about__cards">
            <article className="about-card about-card--intro">
              <span className="about-card__quotemark" aria-hidden="true">“</span>
              <p className="about-card__quote">
                Innovation and simplicity <em>make us happy.</em>
              </p>
              <p className="about-card__quote-attr">Werner &mdash; product philosophy</p>
            </article>

            {values.map((v, i) => (
              <article className="about-card about-card--value" key={v.title}>
                <div className="about-card__num">
                  <span>0{i + 1}</span>
                  <span className="about-card__num-total">/ 04</span>
                </div>
                <h3 className="about-card__title">{v.title}</h3>
                <p className="about-card__body">{v.body}</p>
                <span className="about-card__arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M4 14 L14 4 M6 4 H14 V12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
