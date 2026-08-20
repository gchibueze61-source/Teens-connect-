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
  image_url: string | null;
  created_at: string;
};

function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

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

  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  /*
   * Supabase Storage bucket used for event fliers.
   *
   * If your bucket has a different name, change it here.
   */
  const EVENT_FLIER_BUCKET = "event-fliers";

  /*
   * Database column used to store the public image URL.
   *
   * If your column has a different name, change image_url
   * everywhere in this file.
   */

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", {
        ascending: true,
      });

    if (error) {
      console.error("EVENTS LOAD ERROR:", error);
      setError(error.message);
      setEvents([]);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /*
   * Reset form
   */
  const resetForm = () => {
    setEditingEventId(null);

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

    setImageUrl("");
    setSelectedImage(null);
    setImagePreview("");

    setError("");
    setSuccess("");
  };

  /*
   * Open the add-event form
   */
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  /*
   * Close the form
   */
  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  /*
   * Convert database date/time into datetime-local format.
   */
  const formatDateTimeForInput = (
    date: string,
    time?: string | null
  ) => {
    if (!date) return "";

    const safeTime = time || "00:00";

    return `${date}T${safeTime.substring(0, 5)}`;
  };

  /*
   * Open an existing event for editing.
   */
  const handleEdit = (event: EventItem) => {
    setEditingEventId(event.id);

    setTitle(event.title);
    setDescription(event.description || "");
    setEventDate(
      formatDateTimeForInput(
        event.event_date,
        null
      )
    );

    setLocation(event.location || "");

    setStatus(event.status);
    setFeatured(event.featured);
    setHomepage(event.homepage);
    setCountdownEnabled(
      event.countdown_enabled
    );

    setRegistrationUrl(
      event.registration_url || ""
    );

    setLivestreamUrl(
      event.livestream_url || ""
    );

    setImageUrl(event.image_url || "");

    setSelectedImage(null);

    setImagePreview(
      event.image_url || ""
    );

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Handle image selection.
   */
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    /*
     * Basic file validation
     */
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG or WebP image."
      );

      event.target.value = "";
      return;
    }

    /*
     * Keep image uploads reasonably sized.
     */
    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "The image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
   * Upload event flier to Supabase Storage.
   */
  const uploadEventFlier = async (
    file: File
  ) => {
    setUploadingImage(true);
    setError("");

    const fileExtension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExtension}`;

    const filePath =
      `events/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from(EVENT_FLIER_BUCKET)
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          }
        );

    if (uploadError) {
      setUploadingImage(false);

      console.error(
        "EVENT FLIER UPLOAD ERROR:",
        uploadError
      );

      throw new Error(
        uploadError.message
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(EVENT_FLIER_BUCKET)
      .getPublicUrl(filePath);

    setUploadingImage(false);

    return publicUrlData.publicUrl;
  };

  /*
   * Save event.
   *
   * This handles BOTH:
   *
   * 1. Creating a new event
   * 2. Editing an existing event
   */
  const handleSaveEvent = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!title.trim()) {
        throw new Error(
          "Event title is required."
        );
      }

      if (!eventDate) {
        throw new Error(
          "Event date and time are required."
        );
      }

      if (!description.trim()) {
        throw new Error(
          "Event description is required."
        );
      }

      /*
       * datetime-local returns:
       *
       * YYYY-MM-DDTHH:mm
       *
       * We split it into:
       *
       * event_date
       * event_time
       */
      const [
        selectedDate,
        selectedTime,
      ] = eventDate.split("T");

      /*
       * Upload new image if one was selected.
       */
      let finalImageUrl =
        imageUrl || null;

      if (selectedImage) {
        finalImageUrl =
          await uploadEventFlier(
            selectedImage
          );
      }

      const eventData = {
        title: title.trim(),

        description:
          description.trim(),

        event_date:
          selectedDate,

        event_time:
          selectedTime || null,

        location:
          location.trim() || null,

        status,

        featured,

        homepage,

        countdown_enabled:
          countdownEnabled,

        registration_url:
          registrationUrl.trim() || null,

        livestream_url:
          livestreamUrl.trim() || null,

        image_url:
          finalImageUrl,
      };

      /*
       * EDIT EXISTING EVENT
       */
      if (editingEventId) {
        const {
          error: updateError,
        } = await supabase
          .from("events")
          .update(eventData)
          .eq(
            "id",
            editingEventId
          );

        if (updateError) {
          throw new Error(
            updateError.message
          );
        }

        setSuccess(
          "Event updated successfully."
        );
      }

      /*
       * ADD NEW EVENT
       */
      else {
        const {
          error: insertError,
        } = await supabase
          .from("events")
          .insert(
            eventData
          );

        if (insertError) {
          throw new Error(
            insertError.message
          );
        }

        setSuccess(
          "Event created successfully."
        );
      }

      resetForm();

      await loadEvents();

      /*
       * Keep form closed after save.
       */
      setShowForm(false);
    } catch (err) {
      console.error(
        "EVENT SAVE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the event."
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  /*
   * Delete event
   */
  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const {
      error: deleteError,
    } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "EVENT DELETE ERROR:",
        deleteError
      );

      setError(
        deleteError.message
      );

      return;
    }

    setSuccess(
      "Event deleted successfully."
    );

    await loadEvents();
  };

  return (
    <main className="admin-events-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="admin-events-header">

        <div>

          <span className="admin-events-badge">
            TCA ADMIN
          </span>

          <h1>Events</h1>

          <p>
            Create and manage Teens Connect
            Africa events.
          </p>

        </div>

        <button
          className="admin-events-add-button"
          type="button"
          onClick={() => {
            if (showForm) {
              closeForm();
            } else {
              openAddForm();
            }
          }}
        >
          {showForm
            ? "Close Form"
            : "+ Add Event"}
        </button>

      </header>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {success && (
        <div className="admin-events-success">
          {success}
        </div>
      )}


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="admin-events-error">
          {error}
        </div>
      )}


      {/* =========================
          EVENT FORM
      ========================= */}

      {showForm && (

        <section className="admin-events-form-card">

          <div className="admin-events-form-header">

            <div>

              <h2>
                {editingEventId
                  ? "Edit Event"
                  : "Add New Event"}
              </h2>

              <p>
                {editingEventId
                  ? "Update the event information below."
                  : "Create an event that can later appear on the public TCA website."}
              </p>

            </div>

            <button
              type="button"
              className="admin-events-close-button"
              onClick={closeForm}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              handleSaveEvent
            }
          >

            <div className="admin-events-form-grid">


              {/* EVENT TITLE */}

              <div className="admin-events-field">

                <label htmlFor="title">
                  Event Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 6th Anniversary Celebration"
                  required
                />

              </div>


              {/* DATE */}

              <div className="admin-events-field">

                <label htmlFor="eventDate">
                  Event Date & Time
                </label>

                <input
                  id="eventDate"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(event) =>
                    setEventDate(
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* LOCATION */}

              <div className="admin-events-field">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Abuja, Nigeria"
                />

              </div>


              {/* STATUS */}

              <div className="admin-events-field">

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
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


              {/* DESCRIPTION */}

              <div className="admin-events-field full">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe the event..."
                  rows={5}
                  required
                />

              </div>


              {/* REGISTRATION */}

              <div className="admin-events-field">

                <label htmlFor="registrationUrl">
                  Registration URL
                </label>

                <input
                  id="registrationUrl"
                  type="url"
                  value={registrationUrl}
                  onChange={(event) =>
                    setRegistrationUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                />

              </div>


              {/* LIVESTREAM */}

              <div className="admin-events-field">

                <label htmlFor="livestreamUrl">
                  YouTube / Live URL
                </label>

                <input
                  id="livestreamUrl"
                  type="url"
                  value={livestreamUrl}
                  onChange={(event) =>
                    setLivestreamUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://youtube.com/..."
                />

              </div>


              {/* =========================
                  EVENT FLIER
              ========================= */}

              <div className="admin-events-field full">

                <label htmlFor="eventFlier">
                  Event Flier
                </label>

                <input
                  id="eventFlier"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={
                    handleImageChange
                  }
                />

                <small>
                  JPG, PNG or WebP. Maximum
                  5MB.
                </small>


                {/* IMAGE PREVIEW */}

                {imagePreview && (

                  <div
                    className="admin-event-image-preview"
                    style={{
                      marginTop: "15px",
                    }}
                  >

                    <img
                      src={imagePreview}
                      alt="Event flier preview"
                      style={{
                        maxWidth: "300px",
                        width: "100%",
                        borderRadius: "10px",
                        display: "block",
                      }}
                    />

                  </div>

                )}

              </div>

            </div>


            {/* =========================
                OPTIONS
            ========================= */}

            <div className="admin-events-options">

              <label>

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(
                      event.target.checked
                    )
                  }
                />

                Featured event

              </label>


              <label>

                <input
                  type="checkbox"
                  checked={homepage}
                  onChange={(event) =>
                    setHomepage(
                      event.target.checked
                    )
                  }
                />

                Show on homepage

              </label>


              <label>

                <input
                  type="checkbox"
                  checked={
                    countdownEnabled
                  }
                  onChange={(event) =>
                    setCountdownEnabled(
                      event.target.checked
                    )
                  }
                />

                Enable countdown

              </label>

            </div>


            {/* =========================
                FORM ACTIONS
            ========================= */}

            <div className="admin-events-form-actions">

              <button
                type="button"
                className="admin-events-cancel-button"
                onClick={closeForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-events-save-button"
                disabled={
                  saving ||
                  uploadingImage
                }
              >

                {uploadingImage
                  ? "Uploading Flier..."
                  : saving
                  ? "Saving..."
                  : editingEventId
                  ? "Save Changes"
                  : "Save Event"}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* =========================
          EVENTS LIST
      ========================= */}

      <section className="admin-events-list">

        <div className="admin-events-list-header">

          <h2>
            All Events
          </h2>

          <p>
            {events.length} event
            {events.length !== 1
              ? "s"
              : ""}
          </p>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="admin-events-loading">
            Loading events...
          </div>

        ) : events.length === 0 ? (

          /* EMPTY */

          <div className="admin-events-empty">

            <h3>
              No events yet
            </h3>

            <p>
              Click "Add Event" to
              create your first event.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="admin-events-table-wrapper">

            <table className="admin-events-table">

              <thead>

                <tr>

                  <th>
                    Event
                  </th>

                  <th>
                    Flier
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Homepage
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {events.map(
                  (event) => (

                    <tr
                      key={event.id}
                    >

                      {/* EVENT */}

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


                      {/* FLIER */}

                      <td>

                        {event.image_url ? (

                          <img
                            src={
                              event.image_url
                            }
                            alt={
                              event.title
                            }
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "8px",
                            }}
                          />

                        ) : (

                          <span>
                            No flier
                          </span>

                        )}

                      </td>


                      {/* DATE */}

                      <td>

                        {new Date(
                          event.event_date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            year:
                              "numeric",
                            month:
                              "long",
                            day:
                              "numeric",
                          }
                        )}

                      </td>


                      {/* LOCATION */}

                      <td>

                        {event.location ||
                          "-"}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-event-status ${event.status}`}
                        >
                          {
                            event.status
                          }
                        </span>

                      </td>


                      {/* HOMEPAGE */}

                      <td>

                        {event.homepage
                          ? "Yes"
                          : "No"}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-event-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                event
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              handleDelete(
                                event.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default Events;