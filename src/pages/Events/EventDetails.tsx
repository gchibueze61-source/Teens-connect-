import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./EventDetails.css";

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

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError("Event not found.");
        setLoading(false);
        return;
      }

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
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        console.error(
          "EVENT DETAILS ERROR:",
          error
        );

        setError(error.message);
        setEvent(null);
      } else if (!data) {
        setError("This event could not be found.");
        setEvent(null);
      } else {
        setEvent(data as EventItem);
      }

      setLoading(false);
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="event-details-page">
        <div className="event-details-state">
          <div className="event-details-loader"></div>
          <p>Loading event...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="event-details-page">
        <div className="event-details-state">
          <h1>Event Not Found</h1>
          <p>
            {error ||
              "The event you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="event-details-page">

      <section className="event-details-hero">
        <div className="container">

          <button
            type="button"
            className="event-back-button"
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </button>

          <div className="event-details-heading">

            {event.featured && (
              <span className="event-details-badge">
                Featured Event
              </span>
            )}

            <h1>{event.title}</h1>

            <p>
              Teens Connect Africa
            </p>
          </div>

        </div>
      </section>

      <section className="event-details-content">
        <div className="container">

          <div className="event-details-layout">

            <article className="event-details-main">

              <div className="event-details-section">
                <span className="event-details-label">
                  ABOUT THIS EVENT
                </span>

                <h2>Event Information</h2>

                <p>
                  {event.description ||
                    "Join Teens Connect Africa for this upcoming event."}
                </p>
              </div>

            </article>

            <aside className="event-details-sidebar">

              <div className="event-details-card">

                <h3>Event Details</h3>

                <div className="event-detail-row">
                  <span>Date</span>
                  <strong>
                    {formatDate(event.event_date)}
                  </strong>
                </div>

                {event.event_time && (
                  <div className="event-detail-row">
                    <span>Time</span>
                    <strong>
                      {formatTime(event.event_time)}
                    </strong>
                  </div>
                )}

                {event.location && (
                  <div className="event-detail-row">
                    <span>Location</span>
                    <strong>
                      {event.location}
                    </strong>
                  </div>
                )}

                <button
                  type="button"
                  className="event-details-join-button"
                  onClick={() => navigate("/register")}
                >
                  Join Our Community
                </button>

              </div>

            </aside>

          </div>

        </div>
      </section>
    </main>
  );
}