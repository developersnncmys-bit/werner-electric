export default function Trial() {
  return (
    <section className="trial" id="trial">
      <div className="trial__inner">
        <div className="trial__left">
          <h2 className="trial__title">A million-cycle guarantee.</h2>
        </div>

        <div className="trial__right">
          <h3 className="trial__h">Spec a Werner switch.</h3>
          <p className="trial__body">
            Samples ship in 3&ndash;4 days. Full datasheets on request. Custom
            mosaic panels quoted in 48 hours. No obligation, no minimum order to
            evaluate.
          </p>

          <dl className="trial__table">
            <div className="trial__row">
              <dt>Operations guaranteed</dt>
              <dd>100,000+</dd>
            </div>
            <div className="trial__row">
              <dt>Sample lead time</dt>
              <dd>3 to 4 days</dd>
            </div>
            <div className="trial__row">
              <dt>Minimum order</dt>
              <dd>None to evaluate</dd>
            </div>
          </dl>

          <div className="trial__cta-row">
            <a href="#contact" className="tech__download">
              Get in touch
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
