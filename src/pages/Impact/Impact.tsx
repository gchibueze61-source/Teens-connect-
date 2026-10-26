import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Impact.css";

type ImpactStatistic = {
  id: string;
  statistic_key: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
  show_on_homepage: boolean;
  show_on_impact_page: boolean;
  is_published: boolean;
  sort_order: number;
};

const emptyStatistic = {
  statistic_key: "",
  label: "",
  value: 0,
  suffix: "",
  description: "",
  show_on_homepage: false,
  show_on_impact_page: true,
  is_published: true,
  sort_order: 0,
};

const Impact: React.FC = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<ImpactStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyStatistic });

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("impact_statistics")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      setMessage("Could not load statistics: " + error.message);
    } else {
      setStatistics((data ?? []) as ImpactStatistic[]);
      setMessage("");
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadStatistics(); }, [loadStatistics]);

  function startEdit(stat: ImpactStatistic) {
    setEditingId(stat.id);
    setForm({
      statistic_key: stat.statistic_key,
      label: stat.label,
      value: Number(stat.value),
      suffix: stat.suffix ?? "",
      description: stat.description ?? "",
      show_on_homepage: stat.show_on_homepage,
      show_on_impact_page: stat.show_on_impact_page,
      is_published: stat.is_published,
      sort_order: stat.sort_order ?? 0,
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyStatistic });
    setMessage("");
  }

  async function saveStatistic(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      statistic_key: form.statistic_key.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
      label: form.label.trim(),
      description: form.description.trim(),
      value: Number(form.value),
      sort_order: Number(form.sort_order),
      updated_at: new Date().toISOString(),
    };
    const result = editingId
      ? await supabase.from("impact_statistics").update(payload).eq("id", editingId)
      : await supabase.from("impact_statistics").insert(payload);
    if (result.error) {
      setMessage("Save failed: " + result.error.message);
    } else {
      setMessage("Statistic saved successfully.");
      resetForm();
      await loadStatistics();
    }
    setSaving(false);
  }

  async function togglePublished(stat: ImpactStatistic) {
    const { error } = await supabase
      .from("impact_statistics")
      .update({ is_published: !stat.is_published, updated_at: new Date().toISOString() })
      .eq("id", stat.id);
    setMessage(error ? "Update failed: " + error.message : "Publication status updated.");
    if (!error) await loadStatistics();
  }

  async function deleteStatistic(stat: ImpactStatistic) {
    if (!window.confirm(`Delete “${stat.label}”? This cannot be undone.`)) return;
    const { error } = await supabase.from("impact_statistics").delete().eq("id", stat.id);
    setMessage(error ? "Delete failed: " + error.message : "Statistic deleted.");
    if (!error) await loadStatistics();
  }

  return (
    <main className="impact-page">
      <header className="impact-header">
        <div>
          <span className="impact-badge">TCA ADMIN</span>
          <h1>Impact Management</h1>
          <p>Manage programs, gallery content and the live impact statistics shown on the public website.</p>
        </div>
        <button className="impact-back-button" type="button" onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</button>
      </header>

      <section className="impact-grid">
        <article className="impact-card">
          <span className="impact-number">01</span><h2>Programs</h2>
          <p>Add, edit and manage TCA programs and initiatives.</p>
          <button type="button" onClick={() => navigate("/admin/programs")}>Manage Programs</button>
        </article>
        <article className="impact-card">
          <span className="impact-number">02</span><h2>Gallery</h2>
          <p>Manage images and visual records of TCA activities.</p>
          <button type="button" onClick={() => navigate("/admin/gallery")}>Manage Gallery</button>
        </article>
      </section>

      <section className="impact-statistics-manager">
        <div className="impact-statistics-heading">
          <div><span className="impact-number">03</span><h2>Public Impact Statistics</h2>
            <p>Changes here are shared by the homepage and the Impact page.</p></div>
          <button type="button" className="impact-refresh-button" onClick={() => void loadStatistics()}>Refresh</button>
        </div>

        {message && <p className={message.includes("failed") || message.includes("Could not") ? "impact-message error" : "impact-message"} role="status">{message}</p>}

        <form className="impact-stat-form" onSubmit={saveStatistic}>
          <h3>{editingId ? "Edit statistic" : "Add a statistic"}</h3>
          <div className="impact-form-grid">
            <label>Unique key<input required pattern="[A-Za-z0-9_]+" value={form.statistic_key} onChange={e => setForm({ ...form, statistic_key: e.target.value })} placeholder="e.g. teens_reached" disabled={!!editingId} /></label>
            <label>Label<input required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Teens reached directly" /></label>
            <label>Number/value<input required type="number" min="0" step="any" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} /></label>
            <label>Suffix<input value={form.suffix} onChange={e => setForm({ ...form, suffix: e.target.value })} placeholder="e.g. +" /></label>
            <label>Sort order<input type="number" step="1" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></label>
            <label className="impact-description-field">Description<input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short explanation shown on the Impact page" /></label>
          </div>
          <div className="impact-checkbox-row">
            <label><input type="checkbox" checked={form.show_on_homepage} onChange={e => setForm({ ...form, show_on_homepage: e.target.checked })} /> Show on homepage</label>
            <label><input type="checkbox" checked={form.show_on_impact_page} onChange={e => setForm({ ...form, show_on_impact_page: e.target.checked })} /> Show on Impact page</label>
            <label><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published publicly</label>
          </div>
          <div className="impact-form-actions">
            <button type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Save changes" : "Add statistic"}</button>
            {editingId && <button type="button" className="impact-cancel-button" onClick={resetForm}>Cancel edit</button>}
          </div>
        </form>

        <div className="impact-statistics-list">
          <h3>Current statistics ({statistics.length})</h3>
          {loading ? <p>Loading statistics…</p> : statistics.length === 0 ? <p>No statistics found. Check your Supabase access policies.</p> : statistics.map(stat => (
            <article className="impact-stat-row" key={stat.id}>
              <div className="impact-stat-row-main"><strong>{stat.label}</strong><span>{Number(stat.value).toLocaleString()}{stat.suffix} · Key: {stat.statistic_key}</span><small>{stat.description}</small>
                <div className="impact-stat-tags"><span>{stat.show_on_homepage ? "Homepage" : "Not on homepage"}</span><span>{stat.show_on_impact_page ? "Impact page" : "Not on Impact page"}</span><span>{stat.is_published ? "Published" : "Draft"}</span></div>
              </div>
              <div className="impact-stat-row-actions">
                <button type="button" onClick={() => startEdit(stat)}>Edit</button>
                <button type="button" className="impact-cancel-button" onClick={() => void togglePublished(stat)}>{stat.is_published ? "Unpublish" : "Publish"}</button>
                <button type="button" className="impact-delete-button" onClick={() => void deleteStatistic(stat)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Impact;
