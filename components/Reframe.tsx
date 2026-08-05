export default function Reframe() {
  return (
    <section className="reframe" id="story-intro">
      <div className="reframe__sticky">
        <div className="reframe__inner">
          <h2 className="reframe__title">
            Control{" "}
            {/* Invisible inline placeholder that reserves the gap in the
                headline — its position is measured by GSAP on mount to place
                the button exactly here. */}
            <span className="reframe__slot" aria-hidden="true" />{" "}
            that endures every shift.
          </h2>
          <p className="reframe__body">
            As the tactile layer between operator and machine, Werner&rsquo;s
            switches deliver identical response through every shift &mdash; and
            enhance operator trust and audit compliance from the first press to
            the millionth.
          </p>
        </div>

        {/* Button lives OUTSIDE the H2 so it's not affected when the H2 fades
            out during the wash phase. It's absolutely positioned; GSAP measures
            the slot above on mount and places the button over it. */}
        <div className="reframe__button" aria-hidden="true">
          <svg
            className="reframe__button-svg"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Tight gradient: small highlight, then solid Werner red across
                  most of the circle. When scaled up 50x, the viewport reads
                  as a clean red wash — not a giant pink ball. */}
              <radialGradient id="cap-red" cx="34%" cy="26%" r="62%">
                <stop offset="0%" stopColor="#ff8b78" />
                <stop offset="10%" stopColor="#e0402c" />
                <stop offset="55%" stopColor="#c8291a" />
                <stop offset="100%" stopColor="#8a1810" />
              </radialGradient>
              <radialGradient id="bezel-metal" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="55%" stopColor="#9a9a9a" />
                <stop offset="100%" stopColor="#3a3a3a" />
              </radialGradient>
              <linearGradient id="bezel-inner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>

            {/* Bezel — fades in during CONTRACT phase only */}
            <g className="reframe__btn-bezel">
              <circle cx="100" cy="100" r="98" fill="url(#bezel-metal)" />
              <circle cx="100" cy="100" r="86" fill="url(#bezel-inner)" />
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </g>

            {/* Solid red base — always visible. This is what becomes the wash. */}
            <circle cx="100" cy="100" r="82" fill="#c8291a" />

            {/* Gradient overlay — subtle shading, always visible */}
            <circle cx="100" cy="100" r="82" fill="url(#cap-red)" opacity="0.85" />

            {/* Highlight — fades in during CONTRACT phase for the 3D look */}
            <g className="reframe__btn-highlight">
              <ellipse cx="78" cy="66" rx="30" ry="16" fill="#ffffff" opacity="0.45" />
              <ellipse cx="88" cy="60" rx="14" ry="6" fill="#ffffff" opacity="0.6" />
            </g>

            {/* WERNER mark — fades in only in the final product state */}
            <text
              className="reframe__btn-mark"
              x="100"
              y="150"
              textAnchor="middle"
              fill="#4a0d05"
              fontSize="9"
              fontFamily="Switzer, sans-serif"
              fontWeight="700"
              letterSpacing="0.28em"
              opacity="0"
            >
              WERNER
            </text>
          </svg>
        </div>

        <p className="reframe__eyebrow">Engineered for a million cycles.</p>
      </div>
    </section>
  );
}
