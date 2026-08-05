import SwitchShowcase from "./SwitchShowcase";

const cards = [
  {
    num: "01",
    title: "Vandal-proof.",
    body: "400 Series metal-body pushbuttons and E-stops — SS, copper and brass construction. Life of 100,000+ operations guaranteed.",
    series: "Series 400",
  },
  {
    num: "02",
    title: "Illuminated or not.",
    body: "Series 41 with LED, incandescent or non-illuminated variants. 1NO+1NC up to 5NO+5NC contact stacks. Center-dot or outline illumination.",
    series: "Series 41",
  },
  {
    num: "03",
    title: "IP65 sealed front.",
    body: "Series 45 unibody — IP20 back, IP65 front. Only 32 mm depth behind the panel. Protected against low-voltage glowing.",
    series: "Series 45",
  },
  {
    num: "04",
    title: "Seismic-zone 3 certified.",
    body: "Series 41 with gold-plated contacts, tested and certified for seismic zone 3. The audit passes on the first try.",
    series: "Series 41",
  },
];

export default function FeatureGrid() {
  return (
    <section className="features" id="products">
      <div className="features__hero">
        {/* .werner-cinematic-section is the ONLY element pinned by ScrollTrigger.
            All new-implementation styles are scoped under this class in globals.css. */}
        <div className="features__hero-inner werner-cinematic-section">
          <p className="features__eyebrow">The catalog</p>
          <h2 className="features__title">
            Ten series. <span className="features__title-soft">One standard.</span>
          </h2>

          <div className="werner-cinematic-canvas" aria-hidden="true">
            <SwitchShowcase />
          </div>

          <div className="features__caption">
            <p className="features__caption-eyebrow">Series 41</p>
            <ul className="features__caption-list">
              <li>22 mm mount</li>
              <li>Up to 5NO + 5NC</li>
              <li>Seismic Zone 3 certified</li>
            </ul>
          </div>

          <div className="werner-cinematic-rear-text" aria-hidden="true">
            <p className="werner-cinematic-rear-text__eyebrow">Engineered</p>
            <h3 className="werner-cinematic-rear-text__title">From the inside out.</h3>
            <p className="werner-cinematic-rear-text__body">
              Silver-alloy contacts. Copper busbars. Precision-machined shaft.
              Every internal component visible &mdash; every tolerance controlled.
            </p>
          </div>
        </div>
      </div>

      <div className="features__grid">
        {cards.map((c) => (
          <article className="feature-card" key={c.num}>
            <p className="feature-card__num">{c.num}</p>
            <h3 className="feature-card__title">{c.title}</h3>
            <p className="feature-card__body">{c.body}</p>
            <p className="feature-card__series">{c.series}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
