export default function FinalCTA() {
  return (
    <section className="final" id="contact">
      <div className="final__inner">
        <div className="final__left">
          <h2 className="final__title">
            Spec a Werner switch. Every input, every shift, for the next ten
            years.
          </h2>
          <p className="final__body">
            <strong>Trusted by ONGC, Siemens, BHEL, Yokogawa, Maruti Suzuki</strong>{" "}
            and 30+ industry leaders across India, Turkey and the wider EMEA
            market. Samples in 3&ndash;4 days.
          </p>
          <a href="mailto:info@wernerelektrik.com" className="final__cta">
            Get in touch
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="final__video" aria-label="Power plant control room">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="final__video-media"
            src="https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?cs=srgb&w=1920&fm=jpg"
            alt="Power plant control room with banks of analog panels and dials"
            loading="lazy"
          />
          <div className="final__video-overlay" aria-hidden="true" />
          <span className="final__video-tag">
            Engineered in <strong>India</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
