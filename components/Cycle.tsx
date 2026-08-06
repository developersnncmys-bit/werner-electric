import type { ReactNode } from "react";

type PilotState = "dawn" | "amber" | "red" | "green" | "moon";

type Shift = {
  id: string;
  time: string;
  hueClass: string;
  pilot: PilotState;
  cost: string;
  title: string;
  body: ReactNode;
  answer: ReactNode;
  image: string;
};

const shifts: Shift[] = [
  {
    id: "shift-06",
    time: "06:00",
    hueClass: "shift--dawn",
    pilot: "dawn",
    image: "https://images.pexels.com/photos/35072831/pexels-photo-35072831.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "The first 15 minutes of every shift — gone.",
    title: "Shift start. First press of the day.",
    body: (
      <>
        Operators arrive to dead panels and cluttered HMIs, burning the first
        fifteen minutes chasing screens instead of running machines.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>Series&nbsp;40 illuminated pushbuttons</strong>{" "}
        and 1&ndash;5 layer signal towers show the state of the operation from
        across the yard &mdash; before a single keyboard is touched.
      </>
    ),
  },
  {
    id: "shift-12",
    time: "12:00",
    hueClass: "shift--noon",
    pilot: "green",
    image: "https://images.pexels.com/photos/2353937/pexels-photo-2353937.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "One failed button = a failed safety audit.",
    title: "The button that decides your audit.",
    body: (
      <>
        A cracked actuator, a mushy contact, a failed e-stop &mdash; any one
        invalidates the whole sign-off. Cheap switches don&rsquo;t just break;
        they cost you the audit.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s{" "}
        <strong>
          Series&nbsp;41 gold-plated contacts, certified for Seismic&nbsp;zone&nbsp;3
        </strong>
        , pass the audit on the first try. The button still feels right in year
        ten.
      </>
    ),
  },
  {
    id: "shift-18",
    time: "18:00",
    hueClass: "shift--evening",
    pilot: "amber",
    image: "https://images.pexels.com/photos/29224569/pexels-photo-29224569.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "One inconsistent pendant = a load in the air.",
    title: "Shift change with a live crane.",
    body: (
      <>
        One team hands off a live crane. The incoming operator&rsquo;s pendant
        feels different, keys respond differently &mdash; and now there&rsquo;s
        a load in the air and a conversation on the floor.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>remote pendants with up to 12 keys</strong>,
        single or dual-speed, keep tactile response identical shift after shift.
        Handovers happen mid-motion, not mid-argument.
      </>
    ),
  },
  {
    id: "shift-22",
    time: "22:00",
    hueClass: "shift--night",
    pilot: "red",
    image: "https://images.pexels.com/photos/11783119/pexels-photo-11783119.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "Seconds of missed alarm = hours of downtime.",
    title: "The night crew reads the panel from across the yard.",
    body: (
      <>
        Faults buried five screens deep cost seconds &mdash; and at 2am, seconds
        cost shutdowns. Operators can&rsquo;t react to what they can&rsquo;t
        see.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>Series&nbsp;32 Jumbo Dome pilot lights</strong>{" "}
        (ø66 mm lens) and 200-window annunciators surface every deviation the
        instant it happens. Nothing waits its turn.
      </>
    ),
  },
  {
    id: "shift-02",
    time: "02:00",
    hueClass: "shift--deep",
    pilot: "moon",
    image: "https://images.pexels.com/photos/3582392/pexels-photo-3582392.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cost: "The 100,000th press has to feel like the first.",
    title: "From first start to final stop.",
    body: (
      <>
        Werner stays within reach through every stage of the operation.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s{" "}
        <strong>
          Series&nbsp;45 unibody pushbuttons &mdash; 100,000&nbsp;operations
          guaranteed
        </strong>
        , plus mosaic control-room panels that reconfigure without downtime. The
        last press of the day feels like the first press of the shift.
      </>
    ),
  },
];

function Pilot({ state }: { state: PilotState }) {
  const colors: Record<PilotState, string> = {
    dawn: "#f5a623",
    amber: "#f5a623",
    green: "#2fb56a",
    red: "#e0402c",
    moon: "#4a8fff",
  };
  const c = colors[state];
  return (
    <svg
      className="shift__pilot"
      viewBox="0 0 46 46"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`pilot-${state}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor={c} />
          <stop offset="100%" stopColor={c} stopOpacity="0.6" />
        </radialGradient>
        <filter id={`glow-${state}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Bezel */}
      <circle cx="23" cy="23" r="21" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      {/* Lens */}
      {state === "moon" ? (
        <>
          <circle cx="23" cy="23" r="15" fill="#0a1220" />
          <path
            d="M 26 10 A 13 13 0 1 0 26 36 A 10 10 0 1 1 26 10 Z"
            fill={c}
            opacity="0.85"
            filter={`url(#glow-${state})`}
          />
        </>
      ) : state === "dawn" ? (
        <>
          <circle cx="23" cy="23" r="15" fill={`url(#pilot-${state})`} opacity="0.55" />
          <path
            d="M 8 26 A 15 15 0 0 1 38 26 L 38 32 L 8 32 Z"
            fill={`url(#pilot-${state})`}
            filter={`url(#glow-${state})`}
          />
        </>
      ) : (
        <circle
          cx="23"
          cy="23"
          r="15"
          fill={`url(#pilot-${state})`}
          filter={`url(#glow-${state})`}
        />
      )}
    </svg>
  );
}

export default function Cycle() {
  return (
    <section className="cycle" id="story">
      <div className="cycle__intro">
        {/* Persistent scroll marker — ball descends into the cycle and
            parks in the viewport; the time label next to it updates as
            each shift scrolls through, so the ball acts as the running
            "clock" for the current shift. */}
        <div className="cycle__marker" aria-hidden="true">
          <div className="cycle__marker-orb">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              <defs>
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
                <radialGradient id="marker-bezel-metal" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#e8e8e8" />
                  <stop offset="55%" stopColor="#9a9a9a" />
                  <stop offset="100%" stopColor="#3a3a3a" />
                </radialGradient>
                <linearGradient id="marker-bezel-inner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a4a4a" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
              </defs>
              {/* Bezel */}
              <circle cx="100" cy="100" r="98" fill="url(#marker-bezel-metal)" />
              <circle cx="100" cy="100" r="86" fill="url(#marker-bezel-inner)" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.4" />
              {/* Cap — solid + gradient overlay. Color flips via .cycle__marker--green */}
              <circle className="marker-cap-solid" cx="100" cy="100" r="82" fill="#c8291a" />
              <circle className="marker-cap-gradient" cx="100" cy="100" r="82" fill="url(#marker-cap-red)" opacity="0.85" />
              {/* Highlight */}
              <ellipse cx="78" cy="66" rx="30" ry="16" fill="#ffffff" opacity="0.45" />
              <ellipse cx="88" cy="60" rx="14" ry="6" fill="#ffffff" opacity="0.6" />
              {/* WERNER mark */}
              <text
                x="100"
                y="150"
                textAnchor="middle"
                fill="#4a0d05"
                fontSize="9"
                fontFamily="Switzer, sans-serif"
                fontWeight="700"
                letterSpacing="0.28em"
              >
                WERNER
              </text>
            </svg>
          </div>
          <span className="cycle__marker-time" data-current-time="06:00">
            06:00
          </span>
        </div>

        <div className="cycle__intro-row">
          <div className="cycle__aside">
            <p className="cycle__lede">
              One switch. Five shift moments. Every operator input reads right
              &mdash; from the first coffee to the 2am handover.
            </p>
          </div>
          <h2 className="cycle__heading">Your shift day with Werner.</h2>
        </div>
      </div>

      {shifts.map((s) => (
        <article className={`shift ${s.hueClass}`} key={s.id}>
          <div className="shift__grid">
            <div className="shift__media">
              <img
                src={s.image}
                alt={`${s.time} shift`}
                className="shift__media-img"
              />
            </div>
            <div className="shift__text">
              {/* <p className="shift__cost">{s.cost}</p> */}
              {/* <div className="shift__meta">
                <Pilot state={s.pilot} />
                <span className="shift__time">{s.time}</span>
              </div> */}
              <h3 className="shift__title">{s.title}</h3>
              <p className="shift__body">{s.body}</p>
              {/* <p className="shift__answer">
                <span className="shift__answer-label">Werner&rsquo;s fix &rarr;</span>
                {s.answer}
              </p> */}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
