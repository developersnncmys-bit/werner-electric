"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <a href="#top" className="nav__logo" aria-label="Werner Electric home" onClick={close}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nav__logo-img" src="/logo.png" alt="Werner Electric" />
      </a>

      <ul className="nav__menu" role="menubar">
        <li className="nav__item nav__item--has-menu" role="none">
          <a href="#products" role="menuitem" aria-haspopup="true">
            Products
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="nav__mega" role="menu">
            <div className="nav__mega-col">
              <p className="nav__mega-h">Control Components</p>
              <a href="#products">Switches &amp; Pilot Lights</a>
              <a href="#products">Vandal Proof Switches</a>
              <a href="#products">Relays &amp; Sockets</a>
              <a href="#products">Remote Control Pendent</a>
              <a href="#products">Annunciation Windows</a>
              <a href="#products">Signal Tower / Signal Light</a>
              <a href="#products">LED Panel Lights</a>
              <a href="#products">Elevator Control Station</a>
            </div>
            <div className="nav__mega-col">
              <p className="nav__mega-h">Control Room Line</p>
              <a href="#products">Mosaic Panels &amp; Accessories</a>
              <a href="#products">Operator Workstations &amp; Consoles</a>
              <a href="#products">Hardwired Main Control Room Panels</a>
            </div>
            <div className="nav__mega-col">
              <p className="nav__mega-h">Interface Products</p>
              <a href="#products">Terminal Blocks</a>
              <a href="#products">Relay Interface Modules</a>
              <a href="#products">CNC Interface Modules</a>
              <a href="#products">Connector Interface Modules</a>
            </div>
            <div className="nav__mega-col">
              <p className="nav__mega-h">Power &amp; Protection</p>
              <a href="#products">Power Supplies</a>
              <a href="#products">Miniature Circuit Breaker</a>
              <a href="#products">Contactors</a>
              <a href="#products">Din Rail</a>
              <a href="#products">Fan Failure Detector (FFD)</a>
              <a href="#products">Terminal Enclosures</a>
              <a href="#products">Pendent Control Station</a>
            </div>
          </div>
        </li>
        <li className="nav__item" role="none">
          <a href="#story" role="menuitem">Projects</a>
        </li>
        <li className="nav__item nav__item--has-menu" role="none">
          <a href="#contact" role="menuitem" aria-haspopup="true">
            Contact
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="nav__submenu" role="menu">
            <a href="#contact" role="menuitem">India — Head Office</a>
            <a href="#contact" role="menuitem">Turkey — Regional Partner</a>
          </div>
        </li>
      </ul>

      <div className="nav__end">
        <form
          className="nav__search"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <svg
            className="nav__search-icon"
            viewBox="0 0 20 20"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path
              d="M13.5 13.5 L17 17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="nav__search-input"
            aria-label="Search products"
          />
        </form>

        <a href="#contact" className="nav__cta" onClick={close}>
          Get in touch
        </a>
      </div>

      <button
        type="button"
        className="nav__burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span />
        <span />
      </button>

      <div className="nav__panel" hidden={!open}>
        <ul>
          <li>
            <p className="nav__panel-h">Products</p>
            <a href="#products" onClick={close}>Control Components</a>
            <a href="#products" onClick={close}>Control Room Line</a>
            <a href="#products" onClick={close}>Interface Products</a>
            <a href="#products" onClick={close}>Power &amp; Protection</a>
          </li>
          <li><a className="nav__panel-link" href="#story" onClick={close}>Projects</a></li>
          <li>
            <p className="nav__panel-h">Contact</p>
            <a href="#contact" onClick={close}>India — Head Office</a>
            <a href="#contact" onClick={close}>Turkey — Regional Partner</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
