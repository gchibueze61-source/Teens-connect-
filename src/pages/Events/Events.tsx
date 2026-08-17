import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./Events.css";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
  countdown_enabled: boolean;
  registration_url: string | null;
  livestream_url: string | null;
  created_at: string;
};

function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [homepage, setHomepage] = useState(true);
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [livestreamUrl, setLivestreamUrl] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
    setStatus("draft");
    setFeatured(false);
    setHomepage(true);
    setCountdownEnabled(false);
    setRegistrationUrl("");
    setLivestreamUrl("");
  };

  const handleAddEvent = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        event_date: eventDate,
        location,
        status,
        featured,
        homepage,
        countdown_enabled: countdownEnabled,
        registration_url: registrationUrl || null,
        livestream_url: livestreamUrl || null,
      });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    resetForm();
    setShowForm(false);
    await loadEvents();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadEvents();
  };

  return (
    <main className="admin-events-page">
      <header className="admin-events-header">
        <div>
          <span className="admin-events-badge">
            TCA ADMIN
          </span>

          <h1>Events</h1>

          <p>
            Create and manage Teens Connect Africa events.
          </p>
        </div>

        <button
          className="admin-events-add-button"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Close Form" : "+ Add Event"}
        </button>
      </header>

      {error && (
        <div className="admin-events-error">
          {error}
        </div>
      )}

      {showForm && (
        <section className="admin-events-form-card">
          <div className="admin-events-form-header">
            <div>
              <h2>Add New Event</h2>

              <p>
                Create an event that can later appear on
                the public TCA website.
              </p>
            </div>

            <button
              type="button"
              className="admin-events-close-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAddEvent}>
            <div className="admin-events-form-grid">

              <div className="admin-events-field">
                <label htmlFor="title">
                  Event Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. 6th Anniversary Celebration"
                  required
                />
              </div>

              <div className="admin-events-field">
                <label htmlFor="eventDate">
                  Event Date & Time
                </label>

                <input
                  id="eventDate"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(event) =>
                    setEventDate(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-events-field">
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. Abuja, Nigeria"
                />
              </div>

              <div className="admin-events-field">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>
                </select>
              </div>

              <div className="admin-events-field full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the event..."
                  rows={5}
                  required
                />
              </div>

              <div className="admin-events-field">
                <label htmlFor="registrationUrl">
                  Registration URL
                </label>

                <input
                  id="registrationUrl"
                  type="url"
                  value={registrationUrl}
                  onChange={(event) =>
                    setRegistrationUrl(event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="admin-events-field">
                <label htmlFor="livestreamUrl">
                  YouTube / Live URL
                </label>

                <input
                  id="livestreamUrl"
                  type="url"
                  value={livestreamUrl}
                  onChange={(event) =>
                    setLivestreamUrl(event.target.value)
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>

            </div>

            <div className="admin-events-options">

              <label>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                />

                Featured event
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={homepage}
                  onChange={(event) =>
                    setHomepage(event.target.checked)
                  }
                />

                Show on homepage
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={countdownEnabled}
                  onChange={(event) =>
                    setCountdownEnabled(
                      event.target.checked
                    )
                  }
                />

                Enable countdown
              </label>

            </div>

            <div className="admin-events-form-actions">

              <button
                type="button"
                className="admin-events-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-events-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Event"}
              </button>

            </div>
          </form>
        </section>
      )}

      <section className="admin-events-list">

        <div className="admin-events-list-header">
          <h2>All Events</h2>

          <p>
            {events.length} event
            {events.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="admin-events-loading">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="admin-events-empty">
            <h3>No events yet</h3>

            <p>
              Click "Add Event" to create your first
              event.
            </p>
          </div>
        ) : (
          <div className="admin-events-table-wrapper">

            <table className="admin-events-table">

              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Homepage</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {events.map((event) => (

                  <tr key={event.id}>

                    <td>
                      <div className="admin-event-name">
                        <strong>
                          {event.title}
                        </strong>

                        <span>
                          {event.featured
                            ? "Featured"
                            : ""}
                        </span>
                      </div>
                    </td>

                    <td>
                      {new Date(
                        event.event_date
                      ).toLocaleString()}
                    </td>

                    <td>
                      {event.location || "-"}
                    </td>

                    <td>
                      <span
                        className={`admin-event-status ${
                          event.status
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td>
                      {event.homepage
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      <div className="admin-event-actions">

                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              "Edit functionality will be added next."
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            handleDelete(event.id)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>
    </main>
  );
}

export default Events;