import type { ReactNode } from "react";

type Family = {
  eyebrow: string;
  title: string;
  heroClass: string;
  visual: ReactNode;
  items: string[];
};

const families: Family[] = [
  {
    eyebrow: "01 — Control Components",
    title: "Switches, buttons and the tactile layer.",
    heroClass: "family__hero--components",
    visual: (
      <img
        className="ecosystem-img"
        src="https://images.pexels.com/photos/21046774/pexels-photo-21046774.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Close-up of an industrial control panel with buttons and switches"
        loading="lazy"
      />
    ),
    items: [
      "Switches & Pilot Lights",
      "Vandal Proof Switches",
      "Relays & Sockets",
      "Remote Control Pendant",
      "Annunciation Windows",
      "Signal Tower / Signal Light",
      "LED Panel Lights",
      "Elevator Control Station",
    ],
  },
  {
    eyebrow: "02 — Control Room Line",
    title: "Mosaic panels & operator consoles.",
    heroClass: "family__hero--room",
    visual: (
      <img
        className="ecosystem-img"
        src="https://images.pexels.com/photos/32845700/pexels-photo-32845700.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Engineer at a control room monitoring multiple screens"
        loading="lazy"
      />
    ),
    items: [
      "Mosaic Panels & Accessories — polycarbonate and metal grids",
      "Operator Workstations & Consoles — ergonomic mounting",
      "Hardwired Main Control Room Panels — free-standing framework",
    ],
  },
  {
    eyebrow: "03 — Interface Products",
    title: "The layer between logic and machine.",
    heroClass: "family__hero--interface",
    visual: (
      <img
        className="ecosystem-img"
        src="https://images.pexels.com/photos/8442025/pexels-photo-8442025.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Grid of labeled industrial terminal blocks and connectors"
        loading="lazy"
      />
    ),
    items: [
      "Terminal Blocks — Asian & European design",
      "Relay Interface Modules",
      "CNC Interface Modules",
      "Connector Interface Modules",
    ],
  },
  {
    eyebrow: "04 — Power & Protection",
    title: "The essentials that keep a panel alive.",
    heroClass: "family__hero--other",
    visual: (
      <img
        className="ecosystem-img"
        src="https://images.pexels.com/photos/38171184/pexels-photo-38171184.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Close-up of electrical circuit breakers in a distribution panel"
        loading="lazy"
      />
    ),
    items: [
      "Power Supplies — 15W to 1200W",
      "Miniature Circuit Breaker (MCB)",
      "Contactors",
      "DIN Rail components",
      "Fan Failure Detector (FFD) — 68-01 Series",
      "Terminal Enclosures",
      "Pendant Control Station",
    ],
  },
];

export default function Ecosystem() {
  return (
    <section className="ecosystem" id="products">
      <div className="ecosystem__head-pin">
        <div className="ecosystem__head" data-reveal>
          <p className="ecosystem__label">The catalog</p>
          <h2 className="ecosystem__heading">Four families. One standard.</h2>
          <p className="ecosystem__body">
            From the smallest pilot light to a complete main control room — clean, crispy
            design and intuitive builds, so you can improve customer satisfaction and
            enhance product quality.
          </p>
        </div>
      </div>

      <div className="ecosystem__split">
        <div className="ecosystem__list-col">
          {families.map((f, i) => (
            <article className="family" key={f.eyebrow} data-family-index={i}>
              <p className="family__eyebrow">{f.eyebrow}</p>
              <h3 className="family__title">{f.title}</h3>
              <ul className="family__list">
                {f.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="ecosystem__visual-col">
          <div className="ecosystem__visual-stage">
            {families.map((f, i) => (
              <div
                key={f.eyebrow}
                className={`ecosystem__visual ${f.heroClass}${i === 0 ? " is-active" : ""}`}
                data-visual-index={i}
              >
                {f.visual}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
