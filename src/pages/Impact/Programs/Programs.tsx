import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
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

const STORAGE_BUCKET = "program-images";

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

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string>("");

  const loadPrograms = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("PROGRAMS ERROR:", error);
      setError(error.message);
      setPrograms([]);
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
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setError("");

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const uploadProgramImage = async (
    file: File,
    programId: string
  ) => {
    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath =
      `${programId}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } =
      await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const deleteStorageImage = async (
    imageUrlToDelete: string | null
  ) => {
    if (!imageUrlToDelete) {
      return;
    }

    try {
      const marker =
        `/storage/v1/object/public/${STORAGE_BUCKET}/`;

      const index =
        imageUrlToDelete.indexOf(marker);

      if (index === -1) {
        return;
      }

      const filePath =
        imageUrlToDelete.substring(
          index + marker.length
        );

      if (!filePath) {
        return;
      }

      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);
    } catch (storageError) {
      console.warn(
        "Could not delete old program image:",
        storageError
      );
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Program title is required.");
      return;
    }

    if (!category.trim()) {
      setError("Program category is required.");
      return;
    }

    if (!description.trim()) {
      setError("Program description is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const now =
        new Date().toISOString();

      let programId = editingId;
      let finalImageUrl = imageUrl || null;

      /*
       * CREATE
       */
      if (!editingId) {
        const { data, error: insertError } =
          await supabase
            .from("programs")
            .insert({
              title: title.trim(),
              description: description.trim(),
              category: category.trim(),
              image_url: null,
              status,
              created_at: now,
              updated_at: now,
            })
            .select()
            .single();

        if (insertError) {
          throw insertError;
        }

        programId = data.id;
      }

      /*
       * UPLOAD NEW IMAGE
       */
      if (selectedImage && programId) {
        const uploadedImageUrl =
          await uploadProgramImage(
            selectedImage,
            programId
          );

        finalImageUrl =
          uploadedImageUrl;
      }

      /*
       * UPDATE
       */
      if (editingId) {
        const { error: updateError } =
          await supabase
            .from("programs")
            .update({
              title: title.trim(),
              description: description.trim(),
              category: category.trim(),
              image_url: finalImageUrl,
              status,
              updated_at: now,
            })
            .eq("id", editingId);

        if (updateError) {
          throw updateError;
        }

        /*
         * Delete old image only after
         * the new image has successfully
         * been uploaded and saved.
         */
        if (
          selectedImage &&
          imageUrl &&
          finalImageUrl !== imageUrl
        ) {
          await deleteStorageImage(
            imageUrl
          );
        }
      } else {
        /*
         * Save uploaded image URL
         * for a newly created program.
         */
        if (programId) {
          const { error: imageUpdateError } =
            await supabase
              .from("programs")
              .update({
                image_url: finalImageUrl,
                updated_at: now,
              })
              .eq("id", programId);

          if (imageUpdateError) {
            throw imageUpdateError;
          }
        }
      }

      resetForm();
      setShowForm(false);

      await loadPrograms();
    } catch (submitError: any) {
      console.error(
        "PROGRAM SAVE ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Something went wrong while saving the program."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingId(program.id);

    setTitle(program.title);
    setDescription(
      program.description || ""
    );
    setCategory(
      program.category || ""
    );
    setImageUrl(
      program.image_url || ""
    );
    setStatus(
      program.status || "draft"
    );

    setSelectedImage(null);
    setImagePreview(
      program.image_url || ""
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    program: Program
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${program.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("programs")
          .delete()
          .eq("id", program.id);

      if (deleteError) {
        throw deleteError;
      }

      await deleteStorageImage(
        program.image_url
      );

      await loadPrograms();
    } catch (deleteError: any) {
      console.error(
        "PROGRAM DELETE ERROR:",
        deleteError
      );

      setError(
        deleteError?.message ||
          "Unable to delete the program."
      );
    }
  };

  const handleTogglePublish = async (
    program: Program
  ) => {
    setError("");

    const newStatus =
      program.status === "published"
        ? "draft"
        : "published";

    const { error: updateError } =
      await supabase
        .from("programs")
        .update({
          status: newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", program.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadPrograms();
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setImageUrl("");
  };

  return (
    <main className="programs-page">

      {/* HEADER */}

      <div className="programs-header">

        <div>

          <button
            className="back-dashboard-button"
            type="button"
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
          type="button"
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
                  setTitle(
                    event.target.value
                  )
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
                  setCategory(
                    event.target.value
                  )
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
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the program..."
                rows={5}
                required
              />

            </div>

            {/* PROGRAM IMAGE */}

            <div className="form-field">

              <label htmlFor="programImage">
                Program Flier / Image
              </label>

              <input
                id="programImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />

              <small className="image-help-text">
                Upload a JPG, PNG or WebP image.
                Maximum size: 5MB.
              </small>

              {imagePreview && (
                <div className="program-image-preview">

                  <img
                    src={imagePreview}
                    alt="Program preview"
                  />

                  <button
                    type="button"
                    className="remove-program-image-button"
                    onClick={
                      handleRemoveSelectedImage
                    }
                  >
                    Remove Image
                  </button>

                </div>
              )}

            </div>

            <div className="form-field">

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

                {program.image_url ? (

                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="program-image"
                  />

                ) : (

                  <div className="program-image-placeholder">
                    No image
                  </div>

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
                      type="button"
                      className="edit-program-button"
                      onClick={() =>
                        handleEdit(program)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
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
                      type="button"
                      className="delete-program-button"
                      onClick={() =>
                        handleDelete(program)
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