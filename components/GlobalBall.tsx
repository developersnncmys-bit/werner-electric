/**
 * GlobalBall — ONE persistent DOM element used for BOTH the reframe
 * pushbutton scene and the cycle marker/clock. Lives at document root
 * (position: fixed) so it can survive across sections without being
 * torn down and remounted (which is what caused the two separate red
 * balls to feel like a jump-cut before this refactor).
 *
 * Renders the union of the two previous SVGs:
 *   - all three cap gradients (red / green / amber) so color flips work
 *   - the metal bezel + inner bevel
 *   - the solid + gradient cap circles (targeted by
 *     .global-ball-cap-solid / .global-ball-cap-gradient for color flips)
 *   - the two highlight ellipses
 *   - the WERNER text mark
 * The bezel + highlight + mark keep their existing reframe__btn-*
 * class names so the Animations.tsx opacity selectors still work.
 */
export default function GlobalBall() {
  return (
    <div className="global-ball" aria-hidden="true">
      <div className="global-ball-orb">
        <svg
          className="reframe__button-svg"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Reframe-era red cap gradient. Kept id "cap-red" so any
                external reference still resolves. */}
            <radialGradient id="cap-red" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#ff8b78" />
              <stop offset="10%" stopColor="#e0402c" />
              <stop offset="55%" stopColor="#c8291a" />
              <stop offset="100%" stopColor="#8a1810" />
            </radialGradient>
            {/* Cycle-era gradients — used by the color-flip CSS. */}
            <radialGradient id="marker-cap-red" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#ff8b78" />
              <stop offset="10%" stopColor="#e0402c" />
              <stop offset="55%" stopColor="#c8291a" />
              <stop offset="100%" stopColor="#8a1810" />
            </radialGradient>
            <radialGradient id="marker-cap-green" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#8ce7ac" />
              <stop offset="10%" stopColor="#2fb56a" />
              <stop offset="55%" stopColor="#1e8a4e" />
              <stop offset="100%" stopColor="#0f5a30" />
            </radialGradient>
            <radialGradient id="marker-cap-amber" cx="34%" cy="26%" r="62%">
              <stop offset="0%" stopColor="#ffd47a" />
              <stop offset="10%" stopColor="#f5a623" />
              <stop offset="55%" stopColor="#c8790a" />
              <stop offset="100%" stopColor="#7a4a08" />
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

          {/* Solid red base — always visible. Becomes the wash.
              global-ball-cap-solid → color-flip target. */}
          <circle
            className="global-ball-cap-solid"
            cx="100"
            cy="100"
            r="82"
            fill="#c8291a"
          />

          {/* Gradient overlay — always visible.
              global-ball-cap-gradient → color-flip target. */}
          <circle
            className="global-ball-cap-gradient"
            cx="100"
            cy="100"
            r="82"
            fill="url(#cap-red)"
            opacity="0.85"
          />

          {/* Highlight — fades in during CONTRACT phase for 3D look */}
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
      <span className="global-ball-time" data-current-time="06:00">
        06:00
      </span>
    </div>
  );
}
