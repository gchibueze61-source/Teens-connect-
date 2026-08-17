import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Programs.css";

type Program = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function Programs() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("draft");

  const loadPrograms = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPrograms(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setImageUrl("");
    setStatus("draft");
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    const programData = {
      title,
      description,
      category,
      image_url: imageUrl || null,
      status,
      updated_at: new Date().toISOString(),
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("programs")
        .update(programData)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("programs")
        .insert({
          ...programData,
          created_at: new Date().toISOString(),
        });
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    resetForm();
    setShowForm(false);

    await loadPrograms();
  };

  const handleEdit = (program: Program) => {
    setEditingId(program.id);
    setTitle(program.title);
    setDescription(program.description || "");
    setCategory(program.category || "");
    setImageUrl(program.image_url || "");
    setStatus(program.status);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadPrograms();
  };

  const handleTogglePublish = async (
    program: Program
  ) => {
    setError("");

    const newStatus =
      program.status === "published"
        ? "draft"
        : "published";

    const { error } = await supabase
      .from("programs")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", program.id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadPrograms();
  };

  return (
    <main className="programs-page">

      {/* HEADER */}

      <div className="programs-header">

        <div>
          <button
            className="back-dashboard-button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <span className="programs-badge">
            TCA ADMIN
          </span>

          <h1>Programs</h1>

          <p>
            Create and manage Teens Connect Africa
            programs.
          </p>
        </div>

        <button
          className="add-program-button"
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "Close Form"
            : "+ Add Program"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="programs-error">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <section className="program-form-card">

          <h2>
            {editingId
              ? "Edit Program"
              : "Add New Program"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-field">

              <label htmlFor="title">
                Program Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Future Leaders Program"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="e.g. Leadership"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the program..."
                rows={5}
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="imageUrl">
                Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https://example.com/image.jpg"
              />

            </div>

            <div className="form-field">

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

            <div className="form-actions">

              <button
                type="submit"
                className="save-program-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Program"
                  : "Save Program"}
              </button>

              <button
                type="button"
                className="cancel-program-button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>
      )}

      {/* PROGRAM LIST */}

      <section className="programs-list">

        <div className="section-heading">

          <h2>All Programs</h2>

          <span>
            {programs.length} program
            {programs.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {loading ? (

          <div className="programs-loading">
            Loading programs...
          </div>

        ) : programs.length === 0 ? (

          <div className="programs-empty">

            <h3>No programs yet</h3>

            <p>
              Click "Add Program" to create
              your first program.
            </p>

          </div>

        ) : (

          <div className="programs-grid">

            {programs.map((program) => (

              <article
                className="program-card"
                key={program.id}
              >

                {program.image_url && (
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="program-image"
                  />
                )}

                <div className="program-card-content">

                  <div className="program-card-top">

                    <span className="program-category">
                      {program.category ||
                        "General"}
                    </span>

                    <span
                      className={`program-status ${
                        program.status ===
                        "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {program.status}
                    </span>

                  </div>

                  <h3>
                    {program.title}
                  </h3>

                  <p>
                    {program.description ||
                      "No description available."}
                  </p>

                  <div className="program-card-actions">

                    <button
                      className="edit-program-button"
                      onClick={() =>
                        handleEdit(program)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="publish-program-button"
                      onClick={() =>
                        handleTogglePublish(
                          program
                        )
                      }
                    >
                      {program.status ===
                      "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      className="delete-program-button"
                      onClick={() =>
                        handleDelete(program.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Programs;