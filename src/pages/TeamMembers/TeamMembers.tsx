
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import "./TeamMembers.css";

type TeamMember = {
  id: string;
  full_name: string;
  position: string;
  profile_image_url: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  status: "active" | "inactive";
  public_profile: boolean;
  display_order: number;
  created_at: string;
};

type MemberForm = {
  full_name: string;
  position: string;
  short_bio: string;
  linkedin_url: string;
  website_url: string;
  status: "active" | "inactive";
  public_profile: boolean;
  display_order: number;
};

const BUCKET = "board-member-photos";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm: MemberForm = {
  full_name: "",
  position: "",
  short_bio: "",
  linkedin_url: "",
  website_url: "",
  status: "active",
  public_profile: false,
  display_order: 0,
};

export default function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setMembers([]);
    } else {
      setMembers((data ?? []) as TeamMember[]);
    }

    setLoading(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setCurrentPhoto("");
    setSelectedPhoto(null);
    setRemovePhoto(false);
    setError("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function editMember(member: TeamMember) {
    setEditingId(member.id);
    setForm({
      full_name: member.full_name,
      position: member.position,
      short_bio: member.short_bio ?? "",
      linkedin_url: member.linkedin_url ?? "",
      website_url: member.website_url ?? "",
      status: member.status,
      public_profile: member.public_profile,
      display_order: member.display_order,
    });
    setCurrentPhoto(member.profile_image_url ?? "");
    setSelectedPhoto(null);
    setRemovePhoto(false);
    setError("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField<K extends keyof MemberForm>(
    key: K,
    value: MemberForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handlePhotoChange(file?: File) {
    setError("");
    setMessage("");

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("The image must not exceed 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedPhoto(file);
    setRemovePhoto(false);
    setCurrentPhoto(URL.createObjectURL(file));
  }

  function getBucketPath(url: string): string | null {
    try {
      const parsed = new URL(url);
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const index = parsed.pathname.indexOf(marker);

      if (index === -1) return null;

      return decodeURIComponent(
        parsed.pathname.slice(index + marker.length),
      );
    } catch {
      return null;
    }
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.full_name.trim() || !form.position.trim()) {
      setError("Full name and position are required.");
      return;
    }

    setSaving(true);

    let uploadedPath: string | null = null;

    // Keep the actual stored photo URL separate from the preview URL.
    const oldPhotoUrl = editingId
      ? members.find((member) => member.id === editingId)
          ?.profile_image_url ?? null
      : null;

    let finalPhotoUrl = removePhoto ? null : oldPhotoUrl;

    try {
      if (selectedPhoto) {
        const extension =
          selectedPhoto.type === "image/png"
            ? "png"
            : selectedPhoto.type === "image/webp"
              ? "webp"
              : "jpg";

        uploadedPath = `team/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(uploadedPath, selectedPhoto, {
            contentType: selectedPhoto.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(uploadedPath);

        finalPhotoUrl = publicUrlData.publicUrl;
      } else if (!editingId) {
        finalPhotoUrl = null;
      }

      const payload = {
        full_name: form.full_name.trim(),
        position: form.position.trim(),
        short_bio: form.short_bio.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        website_url: form.website_url.trim() || null,
        status: form.status,
        public_profile: form.public_profile,
        display_order: Number(form.display_order) || 0,
        profile_image_url: finalPhotoUrl,
        updated_at: new Date().toISOString(),
      };

      const result = editingId
        ? await supabase
            .from("team_members")
            .update(payload)
            .eq("id", editingId)
            .select("id")
            .single()
        : await supabase
            .from("team_members")
            .insert(payload)
            .select("id")
            .single();

      if (result.error) throw result.error;

      // Remove the old stored photo only after the database save succeeds.
      if (
        editingId &&
        (selectedPhoto !== null || removePhoto) &&
        oldPhotoUrl
      ) {
        const oldPath = getBucketPath(oldPhotoUrl);

        if (oldPath) {
          const { error: oldPhotoError } = await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);

          if (oldPhotoError) {
            console.warn(
              "The profile was saved, but the old photo could not be removed:",
              oldPhotoError.message,
            );
          }
        }
      }

      setMessage(editingId ? "Team member updated." : "Team member added.");
      resetForm();
      await loadMembers();
    } catch (caught) {
      // Clean up a newly uploaded image if saving the record fails.
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.warn("Could not clean up uploaded photo:", cleanupError.message);
        }
      }

      setError(
        caught instanceof Error
          ? caught.message
          : "Could not save the team member.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(member: TeamMember) {
    if (
      !window.confirm(
        `Delete ${member.full_name}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("id", member.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    // Delete the stored photo after the database row has been removed.
    const imagePath = member.profile_image_url
      ? getBucketPath(member.profile_image_url)
      : null;

    if (imagePath) {
      const { error: imageError } = await supabase.storage
        .from(BUCKET)
        .remove([imagePath]);

      if (imageError) {
        console.warn("Could not remove team photo:", imageError.message);
      }
    }

    if (editingId === member.id) resetForm();

    setMessage("Team member deleted.");
    await loadMembers();
  }

  const filteredMembers = members.filter((member) =>
    `${member.full_name} ${member.position}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="team-admin-page">
      <header className="team-admin-header">
        <div>
          <p className="team-admin-eyebrow">TEENS CONNECT AFRICA</p>
          <h1>Team Members</h1>
          <p>Manage executive team profiles shown on the public website.</p>
        </div>

        <button
          type="button"
          className="team-admin-secondary"
          onClick={() => {
            resetForm();
            void loadMembers();
          }}
        >
          Refresh list
        </button>
      </header>

      {error && <div className="team-admin-alert error">{error}</div>}
      {message && <div className="team-admin-alert success">{message}</div>}

      <section className="team-admin-panel">
        <h2>{editingId ? "Edit team member" : "Add team member"}</h2>

        <form onSubmit={saveMember} className="team-admin-form">
          <label>
            Full name *
            <input
              value={form.full_name}
              onChange={(event) =>
                updateField("full_name", event.target.value)
              }
              required
              maxLength={150}
              placeholder="Enter full name"
            />
          </label>

          <label>
            Position or role *
            <input
              value={form.position}
              onChange={(event) =>
                updateField("position", event.target.value)
              }
              required
              maxLength={150}
              placeholder="e.g. Executive Director & Co-Founder"
            />
          </label>

          <label className="team-admin-full">
            Short biography
            <textarea
              value={form.short_bio}
              onChange={(event) =>
                updateField("short_bio", event.target.value)
              }
              rows={4}
              maxLength={1000}
              placeholder="Enter an approved biography"
            />
          </label>

          <div className="team-admin-full">
            <label htmlFor="team-member-photo">Profile photo</label>
            <input
              ref={fileInputRef}
              id="team-member-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                handlePhotoChange(event.target.files?.[0])
              }
            />
            <p className="team-admin-hint">
              Select a photo from your device. JPG, PNG, or WebP, maximum 5 MB.
            </p>

            {currentPhoto && (
              <div className="team-admin-photo-preview">
                <img src={currentPhoto} alt="Team member photo preview" />
                <button
                  type="button"
                  className="team-admin-secondary"
                  onClick={() => {
                    setCurrentPhoto("");
                    setSelectedPhoto(null);
                    setRemovePhoto(true);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>

          <label>
            LinkedIn URL
            <input
              type="url"
              value={form.linkedin_url}
              onChange={(event) =>
                updateField("linkedin_url", event.target.value)
              }
              placeholder="https://www.linkedin.com/in/..."
            />
          </label>

          <label>
            Website or portfolio URL
            <input
              type="url"
              value={form.website_url}
              onChange={(event) =>
                updateField("website_url", event.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <label>
            Display order
            <input
              type="number"
              min={0}
              value={form.display_order}
              onChange={(event) =>
                updateField("display_order", Number(event.target.value))
              }
            />
            <span className="team-admin-hint">
              Lower numbers appear first.
            </span>
          </label>

          <label>
            Profile status
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as MemberForm["status"],
                )
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="team-admin-checkbox team-admin-full">
            <input
              type="checkbox"
              checked={form.public_profile}
              onChange={(event) =>
                updateField("public_profile", event.target.checked)
              }
            />
            Publish this profile on the public website
          </label>

          <div className="team-admin-actions team-admin-full">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add team member"}
            </button>

            {editingId && (
              <button
                type="button"
                className="team-admin-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="team-admin-panel">
        <div className="team-admin-list-header">
          <div>
            <h2>Executive team directory</h2>
            <p>{members.length} total team member(s)</p>
          </div>

          <input
            className="team-admin-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search names or roles"
            aria-label="Search team members"
          />
        </div>

        {loading ? (
          <p>Loading team members...</p>
        ) : filteredMembers.length === 0 ? (
          <p>No team members found. Add your first member above.</p>
        ) : (
          <div className="team-admin-list">
            {filteredMembers.map((member) => (
              <article className="team-admin-member" key={member.id}>
                {member.profile_image_url ? (
                  <img
                    className="team-admin-avatar"
                    src={member.profile_image_url}
                    alt=""
                  />
                ) : (
                  <div className="team-admin-avatar team-admin-avatar-empty">
                    {member.full_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="team-admin-member-info">
                  <h3>{member.full_name}</h3>
                  <p>{member.position}</p>

                  <div className="team-admin-tags">
                    <span>{member.status}</span>
                    <span>
                      {member.public_profile ? "Published" : "Hidden"}
                    </span>
                    <span>Order: {member.display_order}</span>
                  </div>
                </div>

                <div className="team-admin-member-actions">
                  <button
                    type="button"
                    className="team-admin-secondary"
                    onClick={() => editMember(member)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="team-admin-danger"
                    onClick={() => void deleteMember(member)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
