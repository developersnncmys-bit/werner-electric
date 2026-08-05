"use client";

import { useState } from "react";

type Row = {
  label: string;
  series: string;
  specs: [string, string][];
};

const rows: Row[] = [
  {
    label: "Series 32 &mdash; Jumbo Dome pilot lights",
    series: "Ø22 mm",
    specs: [
      ["Lens diameter", "Ø66 mm"],
      ["Mounting", "Ø22 mm hole"],
      ["Illumination", "LED, high brightness"],
      ["Application", "Visible from across the yard"],
    ],
  },
  {
    label: "Series 40 &mdash; Illuminated pushbuttons",
    series: "16 mm",
    specs: [
      ["Mounting", "16 mm"],
      ["IP rating", "IP40 / IP65"],
      ["Contacts", "SPDT / DPDT, gold-plated"],
      ["Variants", "Illuminated E-stop available"],
    ],
  },
  {
    label: "Series 41 &mdash; Compact multi-contact",
    series: "16 mm",
    specs: [
      ["Mounting", "16 mm"],
      ["IP rating", "IP40 / IP65"],
      ["Contacts", "1NO+1NC up to 5NO+5NC"],
      ["Certification", "Seismic zone 3"],
    ],
  },
  {
    label: "Series 43 &mdash; Rotary switches",
    series: "6&ndash;63 A",
    specs: [
      ["IP rating", "IP55"],
      ["Current", "6 A to 63 A"],
      ["Voltage", "440 VAC / 240 VDC"],
      ["Positions", "Multiple, cam-configurable"],
    ],
  },
  {
    label: "Series 45 &mdash; Unibody pushbutton",
    series: "22 mm",
    specs: [
      ["Mounting", "22 mm"],
      ["IP rating", "IP20 back / IP65 front"],
      ["Depth", "Only 32 mm behind panel"],
      ["Contacts", "Up to 9 stacks"],
    ],
  },
  {
    label: "Series 400 &mdash; Vandal-proof",
    series: "Metal body",
    specs: [
      ["Body", "SS, copper, brass"],
      ["Life", "100,000+ operations"],
      ["Action", "Momentary / maintained"],
      ["Illumination", "Center dot / outline"],
    ],
  },
];

export default function TechDetails() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="tech" id="tech">
      <div className="tech__inner">
        <div className="tech__left">
          <h2 className="tech__title">Technical details.</h2>
          <p className="tech__body">
            Every Werner series is designed on real shop floors, tested to IEC,
            and shipped with a full datasheet. Ten families, one standard of
            build.
          </p>
          <a href="#contact" className="tech__download">
            Download full catalog
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 2 V10 M4 7 L7 10 L10 7 M2 12 H12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="tech__right">
          <div className="tech__accordion" role="list">
            {rows.map((r, i) => {
              const open = openIdx === i;
              return (
                <div
                  className="tech-row"
                  key={r.label}
                  data-open={open ? "true" : "false"}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tech-row__head"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span
                      className="tech-row__label"
                      dangerouslySetInnerHTML={{ __html: r.label }}
                    />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "16px" }}>
                      <span
                        className="tech-row__series"
                        dangerouslySetInnerHTML={{ __html: r.series }}
                      />
                      <span className="tech-row__plus" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="tech-row__body">
                    <dl className="tech-row__body-inner">
                      {r.specs.map(([dt, dd]) => (
                        <div key={dt} style={{ display: "contents" }}>
                          <dt>{dt}</dt>
                          <dd>{dd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
