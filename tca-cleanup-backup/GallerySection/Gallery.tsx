import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./Gallery.css";

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
  external_url: string | null;
  external_platform: string | null;
  external_label: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
  gallery_images: GalleryImage[];
};

function Gallery() {
  const navigate = useNavigate();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select(`
          *,
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
        console.error("PUBLIC GALLERY ERROR:", error);
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
      <section className="public-gallery">
        <div className="public-gallery-loading">
          Loading gallery...
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="public-gallery">
        <div className="public-gallery-empty">
          <h3>No gallery images yet</h3>

          <p>
            Check back soon for pictures from
            Teens Connect Africa.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="public-gallery"
      id="gallery"
    >

      {/* HEADER */}

      <div className="public-gallery-heading">

        <span className="public-gallery-badge">
          OUR GALLERY
        </span>

        <h2>
          Moments That Matter
        </h2>

        <p>
          See some of the moments, activities and
          memories from Teens Connect Africa.
        </p>

      </div>


      {/* GALLERY */}

      <div className="public-gallery-grid">

        {items.map((item) => {

          const images =
            item.gallery_images || [];

          const visibleImages =
            images.slice(0, 6);

          return (
            <article
              className="public-gallery-card"
              key={item.id}
            >

              {/* CARD HEADER */}

              <div className="public-gallery-card-heading">

                <span className="public-gallery-category">
                  {item.category || "Gallery"}
                </span>

                <h3>
                  {item.title}
                </h3>

              </div>


              {/* DESCRIPTION */}

              {item.description && (
                <p className="public-gallery-description">
                  {item.description}
                </p>
              )}


              {/* SIX IMAGE GRID */}

              <div className="public-gallery-images">

                {visibleImages.map(
                  (image, index) => (
                    <div
                      className={`public-gallery-image image-${index + 1}`}
                      key={image.id}
                    >

                      <img
                        src={image.image_url}
                        alt={`${item.title} ${index + 1}`}
                        loading={
                          index < 4
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                      />

                    </div>
                  )
                )}

              </div>


              {/* CARD FOOTER */}

              <div className="public-gallery-footer">

                <span>
                  {images.length > 6
                    ? `${images.length} photos available`
                    : `${images.length} photo${
                        images.length === 1
                          ? ""
                          : "s"
                      }`
                  }
                </span>


                {/* EXTERNAL SOCIAL MEDIA BUTTON */}

                {item.external_url && (
                  <button
                    type="button"
                    className="public-gallery-more-button"
                    onClick={() =>
                      window.open(
                        item.external_url!,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    {item.external_label ||
                      "View More Photos"}

                    <span>→</span>
                  </button>
                )}

              </div>

            </article>
          );
        })}

      </div>


      {/* VIEW ALL GALLERY BUTTON */}

      <div className="public-gallery-view-all">

        <button
          type="button"
          onClick={() => navigate("/gallery")}
        >
          View All Photos
          <span>→</span>
        </button>

      </div>

    </section>
  );
}

export default Gallery;