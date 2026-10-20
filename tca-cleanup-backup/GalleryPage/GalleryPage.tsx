import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./GalleryPage.css";

type GalleryImage = {
  id: string;
  gallery_item_id: string;
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

const GalleryPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select(`
          id,
          title,
          description,
          category,
          gallery_images (
            id,
            gallery_item_id,
            image_url,
            sort_order
          )
        `)
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Gallery error:", error);
        setItems([]);
      } else {
        const formatted = (data || []).map((item) => ({
          ...item,
          gallery_images: (item.gallery_images || []).sort(
            (a: GalleryImage, b: GalleryImage) =>
              a.sort_order - b.sort_order
          ),
        }));

        setItems(formatted);
      }

      setLoading(false);
    };

    loadGallery();
  }, []);

  if (loading) {
    return (
      <main className="gallery-page">
        <div className="gallery-page-loading">
          Loading gallery...
        </div>
      </main>
    );
  }

  return (
    <main className="gallery-page">

      <section className="gallery-page-header">

        <button
          type="button"
          className="gallery-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to website
        </button>

        <span className="gallery-page-badge">
          TEENS CONNECT AFRICA
        </span>

        <h1>
          Our Gallery
        </h1>

        <p>
          Explore moments, activities, events and
          memories from our community.
        </p>

      </section>


      {items.length === 0 ? (

        <div className="gallery-page-empty">

          <h2>
            No gallery items yet
          </h2>

          <p>
            Check back soon for new photos.
          </p>

        </div>

      ) : (

        <section className="gallery-page-grid">

          {items.map((item) => (

            <article
              className="gallery-page-card"
              key={item.id}
              onClick={() =>
                navigate(`/gallery/${item.id}`)
              }
            >

              <div className="gallery-page-images">

                {item.gallery_images
                  .slice(0, 6)
                  .map((image) => (

                    <div
                      className="gallery-page-image"
                      key={image.id}
                    >

                      <img
                        src={image.image_url}
                        alt={item.title}
                        loading="lazy"
                      />

                    </div>

                  ))}

              </div>

              <div className="gallery-page-card-content">

                <span>
                  {item.category || "Gallery"}
                </span>

                <h2>
                  {item.title}
                </h2>

                {item.description && (
                  <p>
                    {item.description}
                  </p>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/gallery/${item.id}`);
                  }}
                >
                  View Photos →
                </button>

              </div>

            </article>

          ))}

        </section>

      )}

    </main>
  );
};

export default GalleryPage;