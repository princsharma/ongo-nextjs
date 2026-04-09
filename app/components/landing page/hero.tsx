"use client"
export default function Hero() {
  
  const cards = [
  {
    title: "Weight Loss",
    defaultImg: "assets/fat-women1.webp",
    hoverImg: "assets/slim-girl 1.webp",
  },
  {
    title: "Peptides & Longevity",
    defaultImg: "assets/noglow-women.webp",
    hoverImg: "assets/glow-women.webp",
  },
  {
    title: "Men’s Health",
    defaultImg: "assets/fat-men.webp",
    hoverImg: "assets/slim-men.webp",
  },
  {
    title: "Women’s Health",
    defaultImg: "assets/unhappy-women.webp",
    hoverImg: "assets/happy-women.webp",
  },
];
  return (
    <section className="hero" id="home">
      <div className="bg_big_text">
        <h6>
        OngoWeightLoss
        </h6>
      </div>
      <div className="hero-top">Join 500,000+ patients</div>

      <h1>
        Healthcare, <br />
        <span>redefined</span> for real life.
      </h1>

      <p>
        We provide medical care online—simple, direct, and led by licensed
        providers. No waiting rooms. No unnecessary steps. Just care that works.
      </p>

     <div className="card-wrapper">
  {cards.map((card, index) => (
   <div
  className="card"
  key={index}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    e.currentTarget.style.setProperty("--x", `${x}px`);
    e.currentTarget.style.setProperty("--y", `${y}px`);
  }}
>
  <div className="top_bar_card">
       <h3>
        {card.title} <span>→</span>
      </h3>
  </div>
      <div className="card-image">
        <img
          src={card.defaultImg}
          alt={card.title}
          className="img-default"
        />
        <img
          src={card.hoverImg}
          alt={card.title}
          className="img-hover"
        />
      </div>

     
    </div>
  ))}
</div>
    </section>
  );
}