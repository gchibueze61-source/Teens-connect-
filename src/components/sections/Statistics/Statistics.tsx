import "./Statistics.css";

const stats = [
  {
    number: "500+",
    label: "Teenagers Reached",
  },
  {
    number: "1",
    label: "African Country",
  },
  {
    number: "70+",
    label: "Mentors",
  },
  {
    number: "120+",
    label: "Programs",
  },
];

export default function Statistics() {
  return (
    <section className="statistics">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <h2>{stat.number}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}