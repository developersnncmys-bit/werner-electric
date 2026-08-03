export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <video
          className="hero__img"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero__vignette" />
      </div>

      {/* ---------------- FRAME 1 ---------------- */}
      <div className="hero__stage">
        <div className="hero__brand">
          <p className="hero__eyebrow">Precision you can feel.</p>
          <h1 className="hero__title">Werner.</h1>
        </div>

        <div className="hero__side">
          <p className="hero__lede">
            Push buttons, switches, relays, signaling &mdash; engineered on real shop
            floors, built to feel right for a million cycles.
          </p>
          <p className="hero__scroll-cue">Scroll to explore.</p>
        </div>
      </div>

      {/* ---------------- FRAME 2 (centered, revealed on scroll) ---------------- */}
      <div className="hero__frame2" aria-hidden="true">
        <p className="hero__frame2-brand">WERNER ELECTRIC</p>
        <p className="hero__frame2-desc">
          Clean design. Bulletproof consistency. Intuitive builds.
          <br />
          Trusted across India and Turkey &mdash; from a single pilot light to a full
          control room.
        </p>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
      </div>
    </header>
  );
}
