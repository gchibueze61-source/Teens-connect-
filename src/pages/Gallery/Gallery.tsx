import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Gallery.css";

type GalleryItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  external_url: string | null;
  external_platform: string | null;
  external_label: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
  created_at: string;
  updated_at: string;
};

type GalleryImage = {
  id: string;
  gallery_item_id: string;
  image_url: string;
  sort_order: number;
  created_at?: string;
};

type SelectedImage = {
  file: File;
  preview: string;
};

const STORAGE_BUCKET = "gallery-images";
const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function Gallery() {
  const navigate = useNavigate();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<
    Record<string, GalleryImage[]>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [externalUrl, setExternalUrl] = useState("");
  const [externalPlatform, setExternalPlatform] = useState("Instagram");
  const [externalLabel, setExternalLabel] =
    useState("View More Photos");

  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [homepage, setHomepage] = useState(false);

  const [selectedImages, setSelectedImages] = useState<
    SelectedImage[]
  >([]);

  const [existingImages, setExistingImages] = useState<
    GalleryImage[]
  >([]);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const loadGalleryItems = async () => {
    setLoading(true);
    setError("");

    const {
      data: items,
      error: itemsError,
    } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (itemsError) {
      console.error("GALLERY ITEMS ERROR:", itemsError);
      setError(itemsError.message);
      setGalleryItems([]);
      setLoading(false);
      return;
    }

    const {
      data: images,
      error: imagesError,
    } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (imagesError) {
      console.error("GALLERY IMAGES ERROR:", imagesError);
      setError(imagesError.message);
      setGalleryImages({});
    } else {
      const grouped: Record<string, GalleryImage[]> = {};

      const galleryImageRows = (images || []) as GalleryImage[];

      galleryImageRows.forEach((image: GalleryImage) => {
        if (!grouped[image.gallery_item_id]) {
          grouped[image.gallery_item_id] = [];
        }

        grouped[image.gallery_item_id].push(image);
      });

      setGalleryImages(grouped);
    }

    setGalleryItems((items || []) as GalleryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const resetForm = () => {
    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setTitle("");
    setCategory("");
    setDescription("");

    setExternalUrl("");
    setExternalPlatform("Instagram");
    setExternalLabel("View More Photos");

    setImageUrl("");
    setStatus("draft");

    setFeatured(false);
    setHomepage(false);

    setEditingId(null);
    setSelectedImages([]);
    setExistingImages([]);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setError("");

    if (files.length > MAX_IMAGES) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images at a time.`
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" is invalid. Images must be JPG, PNG or WebP and less than 5MB.`
      );

      event.target.value = "";
      return;
    }

    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    const newImages: SelectedImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages(newImages);

    event.target.value = "";
  };

  const removeSelectedImage = (index: number) => {
    const image = selectedImages[index];

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    setSelectedImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const uploadGalleryImage = async (
    file: File,
    galleryId: string,
    index: number
  ) => {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath =
      `${galleryId}/${Date.now()}-${index}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
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

      const index = imageUrlToDelete.indexOf(marker);

      if (index === -1) {
        return;
      }

      const filePath = imageUrlToDelete.substring(
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
        "Could not delete gallery image:",
        storageError
      );
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Gallery title is required.");
      return;
    }

    if (!category.trim()) {
      setError("Gallery category is required.");
      return;
    }

    if (!description.trim()) {
      setError("Gallery description is required.");
      return;
    }

    if (!externalUrl.trim()) {
      setError("Social media or gallery link is required.");
      return;
    }

    try {
      new URL(externalUrl.trim());
    } catch {
      setError("Please enter a valid external link.");
      return;
    }

    if (!editingId && selectedImages.length === 0) {
      setError("Please upload at least one gallery image.");
      return;
    }

    if (
      editingId &&
      existingImages.length === 0 &&
      selectedImages.length === 0
    ) {
      setError("Please upload at least one gallery image.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const now = new Date().toISOString();
      const slug = generateSlug(title);

      let galleryId = editingId;

      if (!editingId) {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("gallery_items")
          .insert({
            title: title.trim(),
            slug,
            description: description.trim(),
            category: category.trim(),
            image_url: null,
            external_url: externalUrl.trim(),
            external_platform: externalPlatform,
            external_label:
              externalLabel.trim() || "View More Photos",
            status,
            featured,
            homepage,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        galleryId = data.id;
      }

      if (selectedImages.length > 0 && galleryId) {
        const uploadedImages: GalleryImage[] = [];

        for (let i = 0; i < selectedImages.length; i++) {
          const image = selectedImages[i];

          const uploadedUrl = await uploadGalleryImage(
            image.file,
            galleryId,
            i
          );

          const {
            data,
            error: imageInsertError,
          } = await supabase
            .from("gallery_images")
            .insert({
              gallery_item_id: galleryId,
              image_url: uploadedUrl,
              sort_order:
                existingImages.length + i,
              created_at: now,
            })
            .select()
            .single();

          if (imageInsertError) {
            await deleteStorageImage(uploadedUrl);
            throw imageInsertError;
          }

          uploadedImages.push(data as GalleryImage);
        }

        if (galleryId && uploadedImages.length > 0) {
          const firstImage =
            existingImages.length > 0
              ? existingImages[0].image_url
              : uploadedImages[0].image_url;

          setImageUrl(firstImage);

          const {
            error: coverError,
          } = await supabase
            .from("gallery_items")
            .update({
              image_url: firstImage,
              updated_at: now,
            })
            .eq("id", galleryId);

          if (coverError) {
            throw coverError;
          }
        }
      }

      if (editingId) {
        let finalImageUrl = imageUrl || null;

        if (!finalImageUrl && existingImages.length > 0) {
          finalImageUrl = existingImages[0].image_url;
        }

        const {
          error: updateError,
        } = await supabase
          .from("gallery_items")
          .update({
            title: title.trim(),
            slug,
            description: description.trim(),
            category: category.trim(),
            image_url: finalImageUrl,
            external_url: externalUrl.trim(),
            external_platform: externalPlatform,
            external_label:
              externalLabel.trim() || "View More Photos",
            status,
            featured,
            homepage,
            updated_at: now,
          })
          .eq("id", editingId);

        if (updateError) {
          throw updateError;
        }
      }

      resetForm();
      setShowForm(false);

      await loadGalleryItems();
    } catch (submitError: unknown) {
      console.error(
        "GALLERY SAVE ERROR:",
        submitError
      );

      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving the gallery.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (item: GalleryItem) => {
    setEditingId(item.id);

    setTitle(item.title);
    setCategory(item.category || "");
    setDescription(item.description || "");

    setExternalUrl(item.external_url || "");
    setExternalPlatform(
      item.external_platform || "Instagram"
    );
    setExternalLabel(
      item.external_label || "View More Photos"
    );

    setImageUrl(item.image_url || "");
    setStatus(item.status || "draft");

    setFeatured(item.featured || false);
    setHomepage(item.homepage || false);

    setSelectedImages([]);

    const {
      data,
      error: imagesError,
    } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("gallery_item_id", item.id)
      .order("sort_order", { ascending: true });

    if (imagesError) {
      setError(imagesError.message);
      return;
    }

    setExistingImages(
      (data || []) as GalleryImage[]
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteImage = async (
    image: GalleryImage
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (deleteError) {
        throw deleteError;
      }

      await deleteStorageImage(image.image_url);

      const remainingImages = existingImages.filter(
        (item) => item.id !== image.id
      );

      setExistingImages(remainingImages);

      if (image.image_url === imageUrl) {
        setImageUrl(
          remainingImages[0]?.image_url || ""
        );
      }
    } catch (deleteError: unknown) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the image.";

      setError(message);
    }
  };

  const handleDelete = async (
    item: GalleryItem
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const {
        data: images,
      } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("gallery_item_id", item.id);

      const {
        error: deleteError,
      } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      if (images) {
        for (const image of images as {
          image_url: string | null;
        }[]) {
          await deleteStorageImage(image.image_url);
        }
      }

      await loadGalleryItems();
    } catch (deleteError: unknown) {
      console.error(
        "GALLERY DELETE ERROR:",
        deleteError
      );

      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the gallery item.";

      setError(message);
    }
  };

  const handleTogglePublish = async (
    item: GalleryItem
  ) => {
    setError("");

    const newStatus =
      item.status === "published"
        ? "draft"
        : "published";

    const {
      error: updateError,
    } = await supabase
      .from("gallery_items")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadGalleryItems();
  };

  return (
    <main className="gallery-page">
      <div className="gallery-header">
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

          <span className="gallery-badge">
            TCA ADMIN
          </span>

          <h1>Gallery</h1>

          <p>
            Create and manage Teens Connect Africa
            gallery collections.
          </p>
        </div>

        <button
          className="add-gallery-button"
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
            : "+ Add Gallery Item"}
        </button>
      </div>

      {error && (
        <div className="gallery-error">
          {error}
        </div>
      )}

      {showForm && (
        <section className="gallery-form-card">
          <h2>
            {editingId
              ? "Edit Gallery Item"
              : "Add New Gallery Item"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="gallery-title">
                Gallery Title
              </label>

              <input
                id="gallery-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. TCA Leadership Summit 2026"
                required
              />

              {title.trim() && (
                <small className="slug-preview">
                  Slug: {generateSlug(title)}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="gallery-category">
                Category
              </label>

              <input
                id="gallery-category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="e.g. Events"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="gallery-description">
                Description
              </label>

              <textarea
                id="gallery-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe this gallery..."
                rows={5}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="gallery-images">
                Gallery Images
              </label>

              <input
                id="gallery-images"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleImageChange}
              />

              <small className="image-help-text">
                Upload up to 6 images at once.
                JPG, PNG or WebP. Maximum 5MB each.
              </small>

              {selectedImages.length > 0 && (
                <div className="selected-gallery-images">
                  {selectedImages.map(
                    (image, index) => (
                      <div
                        className="selected-gallery-image"
                        key={image.preview}
                      >
                        <img
                          src={image.preview}
                          alt={`Selected ${index + 1}`}
                        />

                        <span>
                          Image {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedImage(index)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {editingId &&
              existingImages.length > 0 && (
                <div className="form-field">
                  <label>
                    Existing Images
                  </label>

                  <div className="existing-gallery-images">
                    {existingImages.map(
                      (image, index) => (
                        <div
                          className="existing-gallery-image"
                          key={image.id}
                        >
                          <img
                            src={image.image_url}
                            alt={`Gallery ${index + 1}`}
                            loading="lazy"
                          />

                          <span>
                            Image {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteImage(image)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="form-field">
              <label htmlFor="external-platform">
                Where can users see more images?
              </label>

              <select
                id="external-platform"
                value={externalPlatform}
                onChange={(event) =>
                  setExternalPlatform(event.target.value)
                }
              >
                <option value="Instagram">
                  Instagram
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="YouTube">
                  YouTube
                </option>

                <option value="TikTok">
                  TikTok
                </option>

                <option value="X">
                  X
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="external-url">
                Social Media / Gallery Link
              </label>

              <input
                id="external-url"
                type="url"
                value={externalUrl}
                onChange={(event) =>
                  setExternalUrl(event.target.value)
                }
                placeholder="https://www.instagram.com/..."
                required
              />

              <small className="image-help-text">
                The public gallery will use this link
                for the "View More Photos" button.
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="external-label">
                Link Button Text
              </label>

              <input
                id="external-label"
                type="text"
                value={externalLabel}
                onChange={(event) =>
                  setExternalLabel(event.target.value)
                }
                placeholder="View More Photos"
              />
            </div>

            <div className="form-field">
              <label htmlFor="gallery-status">
                Status
              </label>

              <select
                id="gallery-status"
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

            <div className="gallery-options">
              <label className="gallery-checkbox">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                />

                <span>
                  Featured
                </span>
              </label>

              <label className="gallery-checkbox">
                <input
                  type="checkbox"
                  checked={homepage}
                  onChange={(event) =>
                    setHomepage(event.target.checked)
                  }
                />

                <span>
                  Show on Homepage
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-gallery-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Gallery Item"
                  : "Save Gallery Item"}
              </button>

              <button
                type="button"
                className="cancel-gallery-button"
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

      <section className="galleries-list">
        <div className="section-heading">
          <h2>
            All Gallery Items
          </h2>

          <span>
            {galleryItems.length} item
            {galleryItems.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {loading ? (
          <div className="galleries-loading">
            Loading gallery...
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="galleries-empty">
            <h3>
              No gallery items yet
            </h3>

            <p>
              Click "Add Gallery Item" to create
              your first gallery collection.
            </p>
          </div>
        ) : (
          <div className="galleries-grid">
            {galleryItems.map((item) => {
              const images =
                galleryImages[item.id] || [];

              return (
                <article
                  className="gallery-card"
                  key={item.id}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="gallery-image-placeholder">
                      No image
                    </div>
                  )}

                  <div className="gallery-card-content">
                    <div className="gallery-card-top">
                      <span className="gallery-category">
                        {item.category ||
                          "General"}
                      </span>

                      <span
                        className={`gallery-status ${
                          item.status === "published"
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.featured && (
                      <span className="featured-badge">
                        Featured
                      </span>
                    )}

                    <h3>
                      {item.title}
                    </h3>

                    <p className="gallery-description">
                      {item.description ||
                        "No description available."}
                    </p>

                    <div className="gallery-image-count">
                      {images.length} image
                      {images.length !== 1
                        ? "s"
                        : ""}
                    </div>

                    <div className="gallery-external-info">
                      <span>
                        More images:
                      </span>

                      <strong>
                        {item.external_platform ||
                          "External Link"}
                      </strong>
                    </div>

                    <div className="gallery-card-actions">
                      <button
                        type="button"
                        className="edit-gallery-button"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="publish-gallery-button"
                        onClick={() =>
                          handleTogglePublish(item)
                        }
                      >
                        {item.status === "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        className="delete-gallery-button"
                        onClick={() =>
                          handleDelete(item)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Gallery;