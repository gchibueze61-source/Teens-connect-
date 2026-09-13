import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./EventsPage.css";

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getEventDateTime(event: EventItem): Date {
  const dateString = event.event_time
    ? `${event.event_date}T${event.event_time}`
    : `${event.event_date}T00:00:00`;

  return new Date(dateString);
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function formatTime(time: string | null) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCountdown(targetDate: Date): Countdown {
  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),
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
  targetDate: Date;
}) {
  const [countdown, setCountdown] = useState(
    getCountdown(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="events-page-countdown">
      <p>Event starts in</p>

      <div className="events-page-countdown-grid">
        <div>
          <strong>{countdown.days}</strong>
          <span>Days</span>
        </div>

        <div>
          <strong>{countdown.hours}</strong>
          <span>Hours</span>
        </div>

        <div>
          <strong>{countdown.minutes}</strong>
          <span>Minutes</span>
        </div>

        <div>
          <strong>{countdown.seconds}</strong>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          event_date,
          event_time,
          location,
          description,
          status,
          featured,
          homepage
        `)
        .eq("status", "published")
        .order("event_date", {
          ascending: true,
        });

      if (error) {
        console.error("EVENTS PAGE ERROR:", error);
        setError(error.message);
        setEvents([]);
      } else {
        setEvents((data || []) as EventItem[]);
      }

      setLoading(false);
    };

    loadEvents();
  }, []);

  const now = Date.now();

  const upcomingEvents = events
    .filter(
      (event) =>
        getEventDateTime(event).getTime() > now
    )
    .sort(
      (a, b) =>
        getEventDateTime(a).getTime() -
        getEventDateTime(b).getTime()
    );

  const pastEvents = events
    .filter(
      (event) =>
        getEventDateTime(event).getTime() <= now
    )
    .sort(
      (a, b) =>
        getEventDateTime(b).getTime() -
        getEventDateTime(a).getTime()
    );

  const closestEvent = upcomingEvents[0] || null;

  return (
    <main className="events-page">
      <section className="events-page-hero">
        <div className="container">
          <span className="events-page-eyebrow">
            TEENS CONNECT AFRICA
          </span>

          <h1>Upcoming Events</h1>

          <p>
            Discover our upcoming meetings, programs,
            celebrations, and opportunities to connect
            with other young people.
          </p>
        </div>
      </section>

      <section className="events-page-content">
        <div className="container">

          {loading && (
            <div className="events-page-state">
              <div className="events-page-loader"></div>
              <p>Loading events...</p>
            </div>
          )}

          {!loading && error && (
            <div className="events-page-state error">
              <h2>Unable to load events</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {closestEvent && (
                <section className="next-event-section">
                  <div className="next-event-header">
                    <div>
                      <span>UP NEXT</span>
                      <h2>{closestEvent.title}</h2>
                    </div>

                    {closestEvent.featured && (
                      <span className="featured-badge">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="next-event-layout">
                    <div className="next-event-information">

                      <p className="next-event-description">
                        {closestEvent.description ||
                          "Join us for this upcoming Teens Connect Africa event."}
                      </p>

                      <div className="next-event-meta">

                        <div>
                          <small>DATE</small>
                          <strong>
                            {formatDate(
                              closestEvent.event_date
                            )}
                          </strong>
                        </div>

                        {closestEvent.event_time && (
                          <div>
                            <small>TIME</small>
                            <strong>
                              {formatTime(
                                closestEvent.event_time
                              )}
                            </strong>
                          </div>
                        )}

                        {closestEvent.location && (
                          <div>
                            <small>LOCATION</small>
                            <strong>
                              {closestEvent.location}
                            </strong>
                          </div>
                        )}

                      </div>

                      <button
                        type="button"
                        className="primary-event-button"
                        onClick={() =>
                          navigate(
                            `/events/${closestEvent.id}`
                          )
                        }
                      >
                        View Event Details
                        <span>→</span>
                      </button>
                    </div>

                    <CountdownTimer
                      targetDate={getEventDateTime(
                        closestEvent
                      )}
                    />
                  </div>
                </section>
              )}

              <section className="events-list-section">
                <div className="events-list-heading">
                  <div>
                    <span>EVENT CALENDAR</span>
                    <h2>All Upcoming Events</h2>
                  </div>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="no-events">
                    <h3>No upcoming events</h3>
                    <p>
                      Check back soon for new Teens Connect
                      Africa events.
                    </p>
                  </div>
                ) : (
                  <div className="events-page-grid">
                    {upcomingEvents.map((event) => (
                      <article
                        className="events-page-card"
                        key={event.id}
                        onClick={() =>
                          navigate(`/events/${event.id}`)
                        }
                      >
                        <div className="event-card-top">
                          <span className="event-card-status">
                            {event.featured
                              ? "Featured"
                              : "Upcoming"}
                          </span>

                          <span className="event-card-arrow">
                            →
                          </span>
                        </div>

                        <h3>{event.title}</h3>

                        <p>
                          {event.description ||
                            "Join us for this upcoming event."}
                        </p>

                        <div className="event-page-meta">
                          <span>
                            {formatDate(
                              event.event_date
                            )}
                          </span>

                          {event.location && (
                            <span>
                              {event.location}
                            </span>
                          )}

                          {event.event_time && (
                            <span>
                              {formatTime(
                                event.event_time
                              )}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {pastEvents.length > 0 && (
                <section className="past-events-section">
                  <div className="events-list-heading">
                    <div>
                      <span>OUR HISTORY</span>
                      <h2>Past Events</h2>
                    </div>
                  </div>

                  <div className="events-page-grid past">
                    {pastEvents.map((event) => (
                      <article
                        className="events-page-card past-card"
                        key={event.id}
                        onClick={() =>
                          navigate(`/events/${event.id}`)
                        }
                      >
                        <div className="event-card-top">
                          <span className="event-card-status">
                            Past Event
                          </span>

                          <span className="event-card-arrow">
                            →
                          </span>
                        </div>

                        <h3>{event.title}</h3>

                        <p>
                          {event.description ||
                            "Teens Connect Africa event."}
                        </p>

                        <div className="event-page-meta">
                          <span>
                            {formatDate(
                              event.event_date
                            )}
                          </span>

                          {event.location && (
                            <span>
                              {event.location}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}