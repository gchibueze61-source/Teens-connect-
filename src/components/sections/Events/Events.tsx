import { useEffect, useState } from "react";
import "./Events.css";

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: string;
  countdownDate?: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const events: EventItem[] = [
  {
    id: 1,
    title: "6th Anniversary Celebration",
    date: "September 20, 2026",
    location: "Abuja, Nigeria",
    description:
      "Join us as Teens Connect Africa celebrates six years of transforming lives.",
    status: "Featured",
    countdownDate: "2026-09-20T00:00:00",
  },
  {
    id: 2,
    title: "Monthly Teens Meeting",
    date: "Every Third Sunday",
    location: "Women Center, Zuba, Abuja",
    description:
      "A monthly gathering filled with mentorship, networking and life-changing discussions.",
    status: "Recurring",
  },
];

function getCountdown(targetDate: string): Countdown {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function CountdownTimer({
  targetDate,
}: {
  targetDate: string;
}) {
  const [countdown, setCountdown] = useState<Countdown>(
    getCountdown(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="event-countdown">
      <p className="countdown-title">
        Countdown
      </p>

      <div className="countdown-grid">
        <div className="countdown-box">
          <strong>{countdown.days}</strong>
          <span>Days</span>
        </div>

        <div className="countdown-box">
          <strong>{countdown.hours}</strong>
          <span>Hours</span>
        </div>

        <div className="countdown-box">
          <strong>{countdown.minutes}</strong>
          <span>Minutes</span>
        </div>

        <div className="countdown-box">
          <strong>{countdown.seconds}</strong>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <section className="events" id="events">
      <div className="container">

        <div className="section-header">
          <h2>Upcoming Events</h2>

          <p>
            Stay connected with our latest programs,
            meetings and celebrations.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>

              <span className="event-status">
                {event.status}
              </span>

              <h3>{event.title}</h3>

              <p>{event.description}</p>

              <div className="event-info">
                <span>{event.date}</span>
                <span>{event.location}</span>
              </div>

              {event.countdownDate && (
                <CountdownTimer
                  targetDate={event.countdownDate}
                />
              )}

              <button type="button">
                View Details
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}