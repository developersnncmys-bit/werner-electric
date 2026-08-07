export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <video
          className="hero__img"
          src="/videos/hero.mp4"
          poster="/images/hero.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero__vignette" />
      </div>

      <div className="hero__stage">
        <div className="hero__center">
          <div className="hero__wordmark">
            <p className="hero__eyebrow">Werner Electric</p>
            <h1 className="hero__title">
              One switch.<br />
              A million shifts<span className="hero__title-dot">.</span>
            </h1>
          </div>

          <div className="hero__statement" aria-hidden="true">
            <p className="hero__statement-eyebrow">What Werner makes</p>
            <p className="hero__statement-body">
              Pushbuttons, switches, pilot lights.<br />
              Six series. Panel ready. Plant tested.<br />
              Built by hand for a million clean cycles.
            </p>
          </div>
        </div>

        <div className="hero__side">
          <div className="hero__side-1">
            <p className="hero__sub">
              Every switch soldered, tuned and tested by hand.
            </p>
            <p className="hero__cue">Scroll to learn more.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
