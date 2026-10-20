
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Impact.css";

const Impact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="impact-page">
      <header className="impact-header">
        <div>
          <span className="impact-badge">TCA ADMIN</span>
          <h1>Impact Management</h1>
          <p>
            Manage the programs and gallery content that showcase
            Teens Connect Africa's work and impact.
          </p>
        </div>

        <button
          className="impact-back-button"
          type="button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="impact-grid">
        <article className="impact-card">
          <span className="impact-number">01</span>
          <h2>Programs</h2>
          <p>Add, edit and manage TCA programs and initiatives.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/programs")}
          >
            Manage Programs
          </button>
        </article>

        <article className="impact-card">
          <span className="impact-number">02</span>
          <h2>Gallery</h2>
          <p>Manage images and visual records of TCA activities.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/gallery")}
          >
            Manage Gallery
          </button>
        </article>
      </section>
    </main>
  );
};

export default Impact;
