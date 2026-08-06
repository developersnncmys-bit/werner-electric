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

        {/* The red pushbutton is now rendered by <GlobalBall /> (mounted
            at page root). GSAP measures .reframe__slot (still present in
            the h2 above) each frame to position the single shared ball. */}

        <p className="reframe__eyebrow">Engineered for a million cycles.</p>
      </div>
    </section>
  );
}
