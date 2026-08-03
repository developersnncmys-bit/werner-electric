import type { ReactNode } from "react";

type Scene = {
  id: string;
  cost: string;
  title: string;
  body: ReactNode;
  answer: ReactNode;
  mediaClass: string;
  visual: ReactNode;
};

const scenes: Scene[] = [
  {
    id: "dawn",
    cost: "The first 15 minutes of every shift — gone.",
    title: "Operators arrive blind to the night.",
    body: (
      <>
        Cluttered HMIs and hidden faults burn the first fifteen minutes of every shift. Operators
        end up chasing screens instead of running machines.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>1&ndash;5 layer signal towers</strong> and panel pilot lights show
        the state of the operation from across the yard &mdash; before a single keyboard is touched.
      </>
    ),
    mediaClass: "scene__media--06",
    visual: (
      <img
        className="scene-img"
        src="https://images.pexels.com/photos/697279/pexels-photo-697279.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Illuminated industrial plant at dawn, visible from across the yard"
        loading="lazy"
      />
    ),
  },
  {
    id: "focus",
    cost: "One failed button = a failed safety audit.",
    title: "The button that decides your compliance.",
    body: (
      <>
        A cracked actuator, a mushy contact, a failed e-stop &mdash; any one invalidates the whole
        sign-off. Cheap switches don&rsquo;t just break; they cost you the audit.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>vandal-proof, full-metal-body pushbuttons</strong> and selector
        switches are engineered for a million cycles. The audit passes. The button still feels
        right in year ten.
      </>
    ),
    mediaClass: "scene__media--09",
    visual: (
      <img
        className="scene-img"
        src="https://images.pexels.com/photos/12265853/pexels-photo-12265853.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Close-up of an industrial metal-body push button"
        loading="lazy"
      />
    ),
  },
  {
    id: "noon",
    cost: "Seconds of missed alarm = hours of downtime.",
    title: "The alarm that fires while operators scroll.",
    body: (
      <>
        Faults buried five screens deep cost seconds &mdash; and in a live operation, seconds cost
        shutdowns. Operators can&rsquo;t react to what they can&rsquo;t see.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>up-to-200-window annunciators</strong> with built-in{" "}
        <strong>15-sequence logic</strong> surface every deviation the instant it happens. Nothing
        waits its turn. Nothing gets missed.
      </>
    ),
    mediaClass: "scene__media--13",
    visual: (
      <img
        className="scene-img"
        src="https://images.pexels.com/photos/5532222/pexels-photo-5532222.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Illuminated annunciator-style control panel with rows of indicator windows"
        loading="lazy"
      />
    ),
  },
  {
    id: "dusk",
    cost: "One inconsistent pendant = a load in the air.",
    title: "Shift change with a live crane.",
    body: (
      <>
        One team hands off a live crane. The incoming operator&rsquo;s pendant feels different,
        keys respond differently &mdash; and now there&rsquo;s a load in the air and a conversation
        on the floor.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>remote pendants with up to 12 keys</strong>, single or dual-speed,
        keep tactile response identical shift after shift. Handovers happen mid-motion, not
        mid-argument.
      </>
    ),
    mediaClass: "scene__media--18",
    visual: (
      <img
        className="scene-img"
        src="https://images.pexels.com/photos/11454241/pexels-photo-11454241.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Crane operator at work — shift handover on a live load"
        loading="lazy"
      />
    ),
  },
  {
    id: "night",
    cost: "Every retrofit = a two-shift outage.",
    title: "The night crew can’t afford a rewire.",
    body: (
      <>
        Legacy hardwired panels resist change. Every reconfigure becomes an outage the operation
        can&rsquo;t spare &mdash; least of all at 2am with a skeleton crew on the floor.
      </>
    ),
    answer: (
      <>
        Werner&rsquo;s <strong>mosaic control-room panels</strong> (polycarbonate and metal grids)
        plus hardwired framework consoles let crews reconfigure without downtime &mdash; even at
        night.
      </>
    ),
    mediaClass: "scene__media--23",
    visual: (
      <img
        className="scene-img"
        src="https://images.pexels.com/photos/32845695/pexels-photo-32845695.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Technicians operating machinery in a modern control room at night"
        loading="lazy"
      />
    ),
  },
];

export default function Cycle() {
  return (
    <section className="cycle" id="story">
      <div className="cycle__intro">
      <div className="cycle__intro-inner">
        <h2 className="cycle__heading">
          Five moments that decide your <em>operation&rsquo;s day</em>
        </h2>
        <div className="cycle__aside">
          <p className="cycle__lede">
            Every operation has these five moments. Get them right and the shift flows. Get them wrong
            and you&rsquo;re paying &mdash; in downtime, in audits, in operator trust. This is
            where Werner shows up.
          </p>
          <a href="#products" className="cycle__cta">
            See the fix
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 11 L11 3 M5 3 H11 V9"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      </div>

      {scenes.map((s, i) => (
        <article className="scene" key={s.id}>
          <div className={`scene__media ${s.mediaClass}`}>{s.visual}</div>
          <div className="scene__text">
            <p className="scene__index">
              <span>0{i + 1}</span> &nbsp;&mdash;&nbsp; {s.cost}
            </p>
            <h3 className="scene__title">{s.title}</h3>
            <p className="scene__body">{s.body}</p>
            <p className="scene__answer">
              <span className="scene__answer-label">Werner&rsquo;s fix &rarr;</span>
              {s.answer}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
