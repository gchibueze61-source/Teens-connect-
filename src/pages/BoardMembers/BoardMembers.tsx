
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./BoardMembers.css";

type MemberStatus = "pending" | "active" | "inactive" | "suspended";

interface BoardMember {
  id: string;
  full_name: string;
  position: string;
  profile_image_url: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  public_profile: boolean;
  status: MemberStatus;
  created_at: string;
}

interface BoardMemberForm {
  full_name: string;
  position: string;
  short_bio: string;
  linkedin_url: string;
  website_url: string;
  status: MemberStatus;
  public_profile: boolean;
}

const emptyForm: BoardMemberForm = {
  full_name: "",
  position: "Board Member",
  short_bio: "",
  linkedin_url: "",
  website_url: "",
  status: "active",
  public_profile: true,
};

const BUCKET = "board-member-photos";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BoardMembers: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<BoardMemberForm>(emptyForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl("");
    setSelectedImage(null);
  };

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("board_members")
        .select(
          "id, full_name, position, profile_image_url, short_bio, linkedin_url, website_url, public_profile, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;
      setMembers((data ?? []) as BoardMember[]);
    } catch (err) {
      console.error("LOAD BOARD MEMBERS ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load board members."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [loadMembers]);

  const updateField = <K extends keyof BoardMemberForm>(
    field: K,
    value: BoardMemberForm[K]
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const openAddForm = () => {
    clearPreview();
    setEditingId(null);
    setForm(emptyForm);
    setExistingImageUrl(null);
    setRemoveImage(false);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (member: BoardMember) => {
    clearPreview();
    setEditingId(member.id);
    setForm({
      full_name: member.full_name ?? "",
      position: member.position ?? "Board Member",
      short_bio: member.short_bio ?? "",
      linkedin_url: member.linkedin_url ?? "",
      website_url: member.website_url ?? "",
      status: member.status,
      public_profile: member.public_profile,
    });
    setExistingImageUrl(member.profile_image_url);
    setRemoveImage(false);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    clearPreview();
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setExistingImageUrl(null);
    setRemoveImage(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const localPreview = URL.createObjectURL(file);
    previewUrlRef.current = localPreview;

    setSelectedImage(file);
    setPreviewUrl(localPreview);
    setRemoveImage(false);
    setError("");
  };

  const uploadImage = async (file: File) => {
    const extension = file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : "webp";

    const filePath = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = form.full_name.trim();
    const position = form.position.trim();

    if (!fullName || !position) {
      setError("Full name and position are required.");
      return;
    }

    setSaving(true);
    let uploadedImagePath: string | null = null;

    try {
      let imageUrl = removeImage ? null : existingImageUrl;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        uploadedImagePath = imageUrl;
      }

      const payload = {
        full_name: fullName,
        position,
        profile_image_url: imageUrl,
        short_bio: form.short_bio.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        website_url: form.website_url.trim() || null,
        status: form.status,
        public_profile: form.status === "active" && form.public_profile,
        updated_at: new Date().toISOString(),
      };

      const result = editingId
        ? await supabase
            .from("board_members")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("board_members").insert(payload);

      if (result.error) throw result.error;

      // Remove the previous uploaded image only after the record is saved.
      if (
        editingId &&
        existingImageUrl &&
        (selectedImage || removeImage)
      ) {
        const marker = `/object/public/${BUCKET}/`;
        const markerIndex = existingImageUrl.indexOf(marker);

        if (markerIndex !== -1) {
          const oldPath = decodeURIComponent(
            existingImageUrl.slice(markerIndex + marker.length).split("?")[0]
          );

          const { error: removalError } = await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);

          if (removalError) {
            console.warn("Old image could not be removed:", removalError);
          }
        }
      }

      setSuccess(
        editingId
          ? "Board member updated successfully."
          : "Board member added successfully."
      );

      closeForm();
      await loadMembers();
    } catch (err) {
      console.error("SAVE BOARD MEMBER ERROR:", err);

      // Avoid leaving a newly uploaded image behind if saving the record fails.
      if (uploadedImagePath) {
        const marker = `/object/public/${BUCKET}/`;
        const markerIndex = uploadedImagePath.indexOf(marker);

        if (markerIndex !== -1) {
          const path = decodeURIComponent(
            uploadedImagePath.slice(markerIndex + marker.length).split("?")[0]
          );

          await supabase.storage.from(BUCKET).remove([path]);
        }
      }

      setError(
        err instanceof Error ? err.message : "Unable to save board member."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (member: BoardMember) => {
    if (!window.confirm(`Delete ${member.full_name} from the board directory?`)) {
      return;
    }

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("board_members")
      .delete()
      .eq("id", member.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    // Clean up the image if it belongs to our storage bucket.
    if (member.profile_image_url) {
      const marker = `/object/public/${BUCKET}/`;
      const markerIndex = member.profile_image_url.indexOf(marker);

      if (markerIndex !== -1) {
        const path = decodeURIComponent(
          member.profile_image_url.slice(markerIndex + marker.length).split("?")[0]
        );

        const { error: imageError } = await supabase.storage
          .from(BUCKET)
          .remove([path]);

        if (imageError) {
          console.warn("Member deleted, but image cleanup failed:", imageError);
        }
      }
    }

    setMembers((previous) => previous.filter((item) => item.id !== member.id));
    setSuccess(`${member.full_name} was deleted.`);
  };

  const filteredMembers = members.filter((member) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      member.full_name.toLowerCase().includes(query) ||
      member.position.toLowerCase().includes(query)
    );
  });

  const publicCount = members.filter(
    (member) => member.status === "active" && member.public_profile
  ).length;

  const displayedImage = previewUrl || (!removeImage ? existingImageUrl : null);

  return (
    <main className="board-admin-page">
      <header className="board-admin-header">
        <div>
          <button
            type="button"
            className="board-admin-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
          <span className="board-admin-eyebrow">TCA ADMIN</span>
          <h1>Board Members</h1>
          <p>Manage board member details and public profiles.</p>
        </div>

        <button
          type="button"
          className="board-admin-primary"
          onClick={openAddForm}
        >
          + Add Board Member
        </button>
      </header>

      {error && <div className="board-admin-alert error">{error}</div>}
      {success && <div className="board-admin-alert success">{success}</div>}

      <section className="board-admin-summary">
        <div className="board-admin-summary-card">
          <span>Total Board Members</span>
          <strong>{members.length}</strong>
        </div>
        <div className="board-admin-summary-card">
          <span>Public Profiles</span>
          <strong>{publicCount}</strong>
        </div>
      </section>

      {showForm && (
        <section className="board-admin-form-card">
          <div className="board-admin-form-heading">
            <div>
              <h2>{editingId ? "Edit Board Member" : "Add Board Member"}</h2>
              <p>Select a photo from your device, then complete the profile.</p>
            </div>
            <button
              type="button"
              className="board-admin-close"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="board-admin-form-grid">
              <label>
                Full name *
                <input
                  value={form.full_name}
                  onChange={(event) => updateField("full_name", event.target.value)}
                  required
                />
              </label>

              <label>
                Position *
                <input
                  value={form.position}
                  onChange={(event) => updateField("position", event.target.value)}
                  required
                />
              </label>

              <div className="board-admin-field-wide">
                <label htmlFor="board-member-photo">Profile photo</label>
                <input
                  ref={fileInputRef}
                  id="board-member-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <small>JPEG, PNG or WebP. Maximum file size: 5 MB.</small>

                {displayedImage && (
                  <div style={{ marginTop: "12px" }}>
                    <img
                      src={displayedImage}
                      alt="Board member preview"
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                    <div>
                      <button
                        type="button"
                        className="board-admin-secondary"
                        onClick={() => {
                          clearPreview();
                          setRemoveImage(true);
                        }}
                        disabled={saving}
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                )}

                {removeImage && !previewUrl && (
                  <p>The current photo will be removed when you save.</p>
                )}
              </div>

              <label className="board-admin-field-wide">
                Short biography
                <textarea
                  value={form.short_bio}
                  onChange={(event) => updateField("short_bio", event.target.value)}
                  rows={4}
                />
              </label>

              <label>
                LinkedIn URL
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(event) => updateField("linkedin_url", event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label>
                Website URL
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(event) => updateField("website_url", event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as MemberStatus)
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>

              <label className="board-admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.public_profile}
                  onChange={(event) =>
                    updateField("public_profile", event.target.checked)
                  }
                  disabled={form.status !== "active"}
                />
                Show on public website
              </label>
            </div>

            <div className="board-admin-form-actions">
              <button
                type="submit"
                className="board-admin-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Board Member"}
              </button>
              <button
                type="button"
                className="board-admin-secondary"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="board-admin-list-section">
        <div className="board-admin-list-heading">
          <div>
            <h2>Board Directory</h2>
            <p>{filteredMembers.length} record(s)</p>
          </div>
          <input
            className="board-admin-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or position"
            aria-label="Search board members"
          />
        </div>

        {loading ? (
          <div className="board-admin-empty">Loading board members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="board-admin-empty">
            <h3>No board members found</h3>
            <p>{search ? "Try another search." : "Add a board member to get started."}</p>
          </div>
        ) : (
          <div className="board-admin-table-wrap">
            <table className="board-admin-table">
              <thead>
                <tr>
                  <th>Board Member</th>
                  <th>Status</th>
                  <th>Public Profile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="board-admin-person">
                        {member.profile_image_url ? (
                          <img
                            src={member.profile_image_url}
                            alt=""
                            className="board-admin-avatar"
                          />
                        ) : (
                          <div className="board-admin-avatar-placeholder">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{member.full_name}</strong>
                          <span>{member.position}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`board-admin-status ${member.status}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      {member.status === "active" && member.public_profile
                        ? "Visible"
                        : "Hidden"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="board-admin-edit"
                        onClick={() => openEditForm(member)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="board-admin-edit"
                        onClick={() => void deleteMember(member)}
                      >
                        Delete
                      </button>
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
};

export default BoardMembers;
