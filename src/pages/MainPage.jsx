import { useEffect } from "react";
import { animate, stagger } from "animejs";

export default function MainPage() {
  useEffect(() => {
    animate({
      targets: ".card",
      translateY: [30, 0],
      opacity: [0, 1],
      delay: stagger(200),
      easing: "easeOutExpo",
    });
  }, []);

  return (
    <section className="main-page">
      <h1>Welcome to Temple Information System</h1>
      <p>Explore temples, festivals, and services</p>

      <div className="main-cards">
        <div className="card">Temple Details</div>
        <div className="card">Festivals</div>
        <div className="card">Darshan Timings</div>
        <div className="card">Donations</div>
      </div>
    </section>
  );
}
