import "./Events.css";

const events = [
  {
    id: 1,
    title: "6th Anniversary Celebration",
    date: "September 20, 2026",
    location: "Abuja, Nigeria",
    description:
      "Join us as Teens Connect Africa celebrates six years of transforming lives.",
    status: "Featured",
  },
  {
    id: 2,
    title: "Monthly Teens Meeting",
    date: "Every Third Sunday",
    location: "Women center, Zuba, Abuja",
    description:
      "A monthly gathering filled with mentorship, networking and life-changing discussions.",
    status: "Recurring",
  },
];

export default function Events() {
  return (
    <section className="events" id="events">
      <div className="container">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <p>
            Stay connected with our latest programs, meetings and celebrations.
          </p>
        </div>
<section className="events" id="events"></section>
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <span className="event-status">{event.status}</span>

              <h3>{event.title}</h3>

              <p>{event.description}</p>

              <div className="event-info">
                <span>{event.date}</span>
                <span>{event.location}</span>
              </div>

              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}