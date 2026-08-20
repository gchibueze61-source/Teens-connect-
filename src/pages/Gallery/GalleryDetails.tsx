import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./GalleryDetails.css";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  gallery_images: GalleryImage[];
};

const GalleryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("gallery_items")
        .select(`
          id,
          title,
          description,
          category,
          gallery_images (
            id,
            image_url,
            sort_order
          )
        `)
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Gallery details error:", error);
        setItem(null);
      } else {
        const formatted = {
          ...data,
          gallery_images: (data.gallery_images || []).sort(
            (a: GalleryImage, b: GalleryImage) =>
              a.sort_order - b.sort_order
          ),
        };

        setItem(formatted);
      }

      setLoading(false);
    };

    loadGallery();
  }, [id]);

  if (loading) {
    return (
      <main className="gallery-details">
        <div className="gallery-details-loading">
          Loading photos...
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="gallery-details">

        <div className="gallery-details-empty">

          <h2>
            Gallery not found
          </h2>

          <button
            onClick={() => navigate("/gallery")}
          >
            Back to Gallery
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="gallery-details">

      <section className="gallery-details-header">

        <button
          className="gallery-details-back"
          onClick={() => navigate("/gallery")}
        >
          ← Back to Gallery
        </button>

        <span>
          {item.category || "Gallery"}
        </span>

        <h1>
          {item.title}
        </h1>

        {item.description && (
          <p>
            {item.description}
          </p>
        )}

      </section>


      <section className="gallery-details-grid">

        {item.gallery_images.map((image) => (

          <div
            className="gallery-details-image"
            key={image.id}
          >

            <img
              src={image.image_url}
              alt={item.title}
              loading="lazy"
            />

          </div>

        ))}

      </section>

    </main>
  );
};

export default GalleryDetails;