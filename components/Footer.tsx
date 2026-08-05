"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__newsletter">
        <h3 className="footer__newsletter-h">
          Get the Werner catalog. Every series, every spec.
        </h3>
        <form
          className="footer__newsletter-form"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Newsletter signup"
        >
          <input
            type="email"
            className="footer__newsletter-input"
            placeholder="Work email"
            aria-label="Email"
            required
          />
          <button type="submit" className="footer__newsletter-btn">
            Send catalog
          </button>
        </form>
      </div>

      <div className="footer__top">
        <div className="footer__brand">
          <p className="footer__logo">
            WERNER<span>ELECTRIC</span>
          </p>
          <p className="footer__tag">
            Industrial control components &mdash; panel builders, OEMs, control rooms.
          </p>
        </div>

        <nav className="footer__cols" aria-label="Footer">
          <div className="footer__col">
            <p className="footer__h">Control Components</p>
            <a href="#products">Switches</a>
            <a href="#products">Vandal Proof</a>
            <a href="#products">Relays</a>
            <a href="#products">Remote Pendant</a>
            <a href="#products">Annunciators</a>
            <a href="#products">Signal Towers</a>
            <a href="#products">LED Panels</a>
            <a href="#products">Elevator</a>
          </div>
          <div className="footer__col">
            <p className="footer__h">Control Room Line</p>
            <a href="#products">Mosaic Panels</a>
            <a href="#products">Consoles</a>
            <a href="#products">Control Rooms</a>
          </div>
          <div className="footer__col">
            <p className="footer__h">Interface Products</p>
            <a href="#products">Terminals</a>
            <a href="#products">Relay I/F</a>
            <a href="#products">CNC I/F</a>
            <a href="#products">Connector I/F</a>
          </div>
          <div className="footer__col">
            <p className="footer__h">Other Products</p>
            <a href="#products">Power</a>
            <a href="#products">MCB</a>
            <a href="#products">Contactors</a>
            <a href="#products">DIN Rail</a>
            <a href="#products">Fan Detector</a>
            <a href="#products">Enclosures</a>
            <a href="#products">Pendant</a>
          </div>
          <div className="footer__col">
            <p className="footer__h">Company</p>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col footer__col--contact">
            <p className="footer__h">Contact</p>
            <p className="footer__contact-region">India</p>
            <a href="tel:+919538492009">+91 95384 92009</a>
            <p className="footer__contact-region">Turkey</p>
            <a href="tel:+905398292507">+90 539 829 25 07</a>

            <p className="footer__h footer__h--follow">Follow</p>
            <ul className="footer__social" aria-label="Social links">
              <li>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11.25H3V9.75zm7.5 0h3.83v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V21H19.1v-4.9c0-1.17-.02-2.68-1.64-2.68-1.64 0-1.89 1.28-1.89 2.6V21H11.6c0-3.75 0-7.5.02-11.25h-.12z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M23 12s0-3.6-.46-5.32a2.78 2.78 0 0 0-1.96-1.97C18.85 4.25 12 4.25 12 4.25s-6.85 0-8.58.46A2.78 2.78 0 0 0 1.46 6.68C1 8.4 1 12 1 12s0 3.6.46 5.32a2.78 2.78 0 0 0 1.96 1.97c1.73.46 8.58.46 8.58.46s6.85 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.97C23 15.6 23 12 23 12zM9.75 15.27V8.73L15.5 12l-5.75 3.27z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.93.26-1.56 1.6-1.56h1.7V3.3c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.8H7.5V13h2.7v8h3.3z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="X">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2H21.5l-7.53 8.61L23 22h-6.94l-5.44-6.9L4.4 22H1.14l8.06-9.22L1 2h7.13l4.92 6.28L18.244 2zm-2.44 18h1.9L7.32 4H5.28l10.524 16z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Pinterest">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2 .04-2.87.19-.77 1.22-4.91 1.22-4.91s-.31-.62-.31-1.54c0-1.44.84-2.52 1.88-2.52.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.05.53 1.9 1.56 1.9 1.87 0 3.31-1.97 3.31-4.82 0-2.52-1.81-4.28-4.4-4.28-3 0-4.76 2.25-4.76 4.57 0 .9.35 1.87.78 2.4a.31.31 0 0 1 .07.3c-.08.33-.26 1.05-.29 1.2-.05.19-.15.24-.35.14-1.3-.6-2.11-2.5-2.11-4.03 0-3.28 2.38-6.29 6.86-6.29 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.04-.55-2.38-1.2l-.65 2.47c-.23.9-.87 2.03-1.29 2.72.97.3 2 .46 3.07.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">Werner Electric &copy; 2026</p>
        <p className="footer__legal">
          All product names and specifications are property of their respective owners.
        </p>
        <p className="footer__dev">
          Developed by <a href="https://www.nakshatranamahacreations.com/" target="_blank" rel="noopener noreferrer">Nakshatra Namaha Creations</a>
        </p>
      </div>
    </footer>
  );
}
