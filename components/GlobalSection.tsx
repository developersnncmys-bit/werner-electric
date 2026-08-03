export default function GlobalSection() {
  return (
    <section className="global" id="contact">
      <div className="global__inner">
        <div className="global__left" data-reveal>
          <p className="global__label">Reach us</p>
          <h2 className="global__heading">
            Two continents.
            <br />
            One catalog.
          </h2>
          <p className="global__body">
            <strong>Mysore, India &mdash; regional partner in Turkey.</strong> Talk to us about
            specifications, custom mosaic panels, distribution or bulk orders across the wider EMEA
            market.
          </p>
          <div className="global__cta">
            <a href="https://wa.me/919538492009" className="btn btn--light">
              WhatsApp us
            </a>
            <a href="mailto:info@wernerelektrik.com" className="global__link">
              Send an enquiry &rarr;
            </a>
          </div>
        </div>

        <div className="global__right" data-reveal>
          <article className="office">
            <header className="office__head">
              <svg
                className="office__flag"
                viewBox="0 0 30 20"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="6.667" y="0" fill="#ff9933" />
                <rect width="30" height="6.667" y="6.667" fill="#ffffff" />
                <rect width="30" height="6.667" y="13.333" fill="#138808" />
                <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.35" />
                <circle cx="15" cy="10" r="0.4" fill="#000080" />
                <g stroke="#000080" strokeWidth="0.18">
                  <line x1="15" y1="7.8" x2="15" y2="12.2" />
                  <line x1="12.8" y1="10" x2="17.2" y2="10" />
                  <line x1="13.44" y1="8.44" x2="16.56" y2="11.56" />
                  <line x1="16.56" y1="8.44" x2="13.44" y2="11.56" />
                  <line x1="13.96" y1="8.15" x2="16.04" y2="11.85" />
                  <line x1="16.04" y1="8.15" x2="13.96" y2="11.85" />
                  <line x1="12.85" y1="9.15" x2="17.15" y2="10.85" />
                  <line x1="12.85" y1="10.85" x2="17.15" y2="9.15" />
                </g>
              </svg>
              <p className="office__country">India &mdash; Head Office</p>
            </header>
            <p className="office__addr">
              Werner Electric Private Limited, #278/C, Hebbal Industrial Area, Mysore 570018, India
            </p>
            <dl className="office__meta">
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+919538492009">+91 95384 92009</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:info@wernerelektrik.com">info@wernerelektrik.com</a>
                </dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>Mon &ndash; Sat, 09:30 &ndash; 18:00 IST</dd>
              </div>
            </dl>
          </article>

          <article className="office">
            <header className="office__head">
              <svg
                className="office__flag"
                viewBox="0 0 30 20"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="20" fill="#e30a17" />
                <circle cx="11.5" cy="10" r="4" fill="#ffffff" />
                <circle cx="12.7" cy="10" r="3.2" fill="#e30a17" />
                <polygon
                  fill="#ffffff"
                  points="17.5,10 15.6,10.62 16.78,9 15.6,7.38 17.5,8 19.4,7.38 18.22,9 19.4,10.62"
                />
              </svg>
              <p className="office__country">Turkey &mdash; Regional Partner</p>
            </header>
            <p className="office__addr">
              Regional partner serving the wider EMEA market.
            </p>
            <dl className="office__meta">
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+905398292507">+90 539 829 25 07</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:info@wernerelektrik.com">info@wernerelektrik.com</a>
                </dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>Mon &ndash; Fri, 09:00 &ndash; 18:00 TRT</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
