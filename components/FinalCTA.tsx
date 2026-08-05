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

        <div className="final__video" aria-label="Factory floor footage">
          <video
            className="final__video-media"
            src="https://videos.pexels.com/video-files/26569059/11965509_3840_2160_24fps.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
