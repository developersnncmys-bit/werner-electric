const values = [
  {
    num: "01",
    title: "Trust",
    body: "We communicate openly with our customers and do what it takes to keep them happy.",
  },
  {
    num: "02",
    title: "Growth",
    body: "We're obsessed with our customer's success and take pride in their achievements.",
  },
  {
    num: "03",
    title: "Innovation",
    body: "We pursue ideas that could change our company, our country and maybe even the world.",
  },
  {
    num: "04",
    title: "Equality",
    body: "We respect and value employees from every background, and we thrive as a result.",
  },
];

export default function Values() {
  return (
    <section className="values" id="values">
      <div className="values__head" data-reveal>
        <p className="values__label">Four principles</p>
        <h2 className="values__heading">What we build the company on.</h2>
      </div>

      <div className="values__grid">
        {values.map((v) => (
          <article className="value" key={v.num} data-reveal>
            <p className="value__num">{v.num}</p>
            <h3 className="value__title">{v.title}</h3>
            <p className="value__body">{v.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
