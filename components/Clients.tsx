const clients = [
  { name: "ABB", file: "abb-logo.png" },
  { name: "ACE", file: "ace-logo.jpg" },
  { name: "BGR Energy", file: "bgr-logo.png" },
  { name: "Bharat", file: "bharat-logo.png" },
  { name: "Bharat Fritz Werner", file: "bharatfritz-logo.jpg" },
  { name: "BHEL", file: "bhel-logo.png" },
  { name: "CPCL", file: "cpcl-logo.png" },
  { name: "DAFFPL", file: "daffpl-logo.jfif" },
  { name: "Engineers India (EIL)", file: "eil-logo.jpg" },
  { name: "Emerson", file: "emerson-logo.jpg" },
  { name: "FACT", file: "fact-logo.jfif" },
  { name: "Farabi Petrochemicals", file: "farabi-logo.png" },
  { name: "GAIL", file: "gail-logo.png" },
  { name: "Haldia Petrochemicals", file: "haldia-logo.jfif" },
  { name: "Honeywell", file: "honeywell-logo.png" },
  { name: "HURL", file: "hurl-logo.jpeg" },
  { name: "Indian Oil", file: "indianoil-logo.png" },
  { name: "JSW", file: "jsw-logo.jpg" },
  { name: "KNPC", file: "knpc-logo.jfif" },
  { name: "KOC", file: "koc-logo.png" },
  { name: "KRIBHCO", file: "kribhco-logo.jfif" },
  { name: "LMW", file: "lmw-logo.png" },
  { name: "Lokesh Machines", file: "lokesh-logo.jfif" },
  { name: "MAFFFL", file: "mafffl-logo.png" },
  { name: "Maruti Suzuki", file: "maruti-logo.png" },
  { name: "NPCIL", file: "npcil-logo.jpg" },
  { name: "NTPC", file: "ntpc-logo.png" },
  { name: "ONGC", file: "ongc-logo.webp" },
  { name: "ORPIC", file: "orpic-logo.webp" },
  { name: "Schneider Electric", file: "schneider-logo.png" },
  { name: "Siemens", file: "siemens-logo.jpg" },
  { name: "SOCAR", file: "socar-logo.jpg" },
  { name: "TANGEDCO", file: "tangedco-logo.jpg" },
  { name: "Toyota", file: "toyota-logo.jpg" },
  { name: "Yamaha", file: "yamaha-logo.jpg" },
  { name: "Yokogawa", file: "yokogawa-logo.png" },
];

/* Split into 3 rows for alternating-direction marquee */
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const rows = chunk(clients, Math.ceil(clients.length / 3));

export default function Clients() {
  return (
    <section className="clients" id="clients">
      <div className="clients__inner">
        <div className="clients__head">
          <p className="clients__label">
            <span className="clients__label-mark" aria-hidden="true" />
            Clients
          </p>
          <h2 className="clients__heading">
            Trusted by industry leaders across India, Turkey and beyond &mdash; from panel
            builders to full-scale plant integrators.
          </h2>
        </div>
      </div>

      <div className="clients__marquee" aria-label="Partner logos">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className={`clients__row ${rowIdx % 2 === 1 ? "clients__row--reverse" : ""}`}
          >
            {/* Duplicate the row so the loop appears seamless */}
            {[...row, ...row].map((c, i) => (
              <div className="client-chip" key={`${rowIdx}-${c.file}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/partner-logos/partner-logo/${c.file}`}
                  alt={c.name}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
