import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Blog.css";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author: string | null;
  image_url: string | null;
  status: string;
  featured: boolean;
  homepage: boolean;
  created_at: string;
  updated_at: string;
};

const STORAGE_BUCKET = "blog-images";

function Blog() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [homepage, setHomepage] = useState(false);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  /*
   * LOAD BLOG POSTS
   */
  const loadBlogPosts = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You are not logged in.");
        setPosts([]);
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setPosts((data || []) as BlogPost[]);
    } catch (err: any) {
      console.error("BLOG LOAD ERROR:", err);

      setError(
        err?.message ||
          "Unable to load blog posts."
      );

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  /*
   * RESET FORM
   */
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setAuthor("");
    setExcerpt("");
    setContent("");
    setImageUrl("");
    setStatus("draft");
    setFeatured(false);
    setHomepage(false);

    setEditingId(null);
    setSelectedImage(null);
    setImagePreview("");
  };

  /*
   * GENERATE BASIC SLUG
   */
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /*
   * GENERATE UNIQUE SLUG
   *
   * If:
   *
   * my-article
   *
   * already exists, this creates:
   *
   * my-article-2
   *
   * then:
   *
   * my-article-3
   */
  const generateUniqueSlug = async (
    titleValue: string,
    currentPostId?: string | null
  ) => {
    const baseSlug =
      generateSlug(titleValue) ||
      `blog-post-${Date.now()}`;

    let candidate = baseSlug;
    let counter = 2;

    while (true) {
      let query = supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", candidate);

      if (currentPostId) {
        query = query.neq(
          "id",
          currentPostId
        );
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return candidate;
      }

      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
  };

  /*
   * IMAGE SELECTION
   */
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
   * UPLOAD BLOG IMAGE
   */
  const uploadBlogImage = async (
    file: File,
    postId: string
  ) => {
    const fileExtension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const filePath =
      `${postId}-${Date.now()}.${fileExtension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(
          filePath
        );

    return data.publicUrl;
  };

  /*
   * DELETE STORAGE IMAGE
   */
  const deleteStorageImage = async (
    imageUrlToDelete:
      | string
      | null
  ) => {
    if (!imageUrlToDelete) {
      return;
    }

    try {
      const marker =
        `/storage/v1/object/public/${STORAGE_BUCKET}/`;

      const index =
        imageUrlToDelete.indexOf(
          marker
        );

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
        .remove([
          filePath,
        ]);
    } catch (storageError) {
      console.warn(
        "Could not delete old blog image:",
        storageError
      );
    }
  };

  /*
   * SAVE BLOG
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Blog title is required."
      );
      return;
    }

    if (!category.trim()) {
      setError(
        "Blog category is required."
      );
      return;
    }

    if (!author.trim()) {
      setError(
        "Author is required."
      );
      return;
    }

    if (!excerpt.trim()) {
      setError(
        "Blog excerpt is required."
      );
      return;
    }

    if (!content.trim()) {
      setError(
        "Full article content is required."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const now =
        new Date().toISOString();

      /*
       * CREATE A UNIQUE SLUG
       */
      const slug =
        await generateUniqueSlug(
          title,
          editingId
        );

      let postId =
        editingId;

      let finalImageUrl =
        imageUrl || null;

      /*
       * CREATE NEW POST
       */
      if (!editingId) {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("blog_posts")
          .insert({
            title:
              title.trim(),

            slug,

            excerpt:
              excerpt.trim(),

            content:
              content.trim(),

            category:
              category.trim(),

            author:
              author.trim(),

            image_url:
              null,

            status,

            featured,

            homepage,

            created_at:
              now,

            updated_at:
              now,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        postId =
          data.id;
      }

      /*
       * UPLOAD NEW IMAGE
       */
      if (
        selectedImage &&
        postId
      ) {
        finalImageUrl =
          await uploadBlogImage(
            selectedImage,
            postId
          );
      }

      /*
       * UPDATE EXISTING POST
       */
      if (editingId) {
        const {
          error: updateError,
        } = await supabase
          .from("blog_posts")
          .update({
            title:
              title.trim(),

            slug,

            excerpt:
              excerpt.trim(),

            content:
              content.trim(),

            category:
              category.trim(),

            author:
              author.trim(),

            image_url:
              finalImageUrl,

            status,

            featured,

            homepage,

            updated_at:
              now,
          })
          .eq(
            "id",
            editingId
          );

        if (updateError) {
          throw updateError;
        }

        /*
         * Delete old image only
         * after the new one succeeds.
         */
        if (
          selectedImage &&
          imageUrl &&
          finalImageUrl !==
            imageUrl
        ) {
          await deleteStorageImage(
            imageUrl
          );
        }
      }

      /*
       * SAVE IMAGE URL FOR NEW POST
       */
      if (
        !editingId &&
        postId
      ) {
        const {
          error:
            imageUpdateError,
        } = await supabase
          .from("blog_posts")
          .update({
            image_url:
              finalImageUrl,

            updated_at:
              now,
          })
          .eq(
            "id",
            postId
          );

        if (imageUpdateError) {
          throw imageUpdateError;
        }
      }

      resetForm();
      setShowForm(false);

      await loadBlogPosts();
    } catch (submitError: any) {
      console.error(
        "BLOG SAVE ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Something went wrong while saving the blog post."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * EDIT
   */
  const handleEdit = (
    post: BlogPost
  ) => {
    setEditingId(
      post.id
    );

    setTitle(
      post.title
    );

    setCategory(
      post.category || ""
    );

    setAuthor(
      post.author || ""
    );

    setExcerpt(
      post.excerpt || ""
    );

    setContent(
      post.content || ""
    );

    setImageUrl(
      post.image_url || ""
    );

    setStatus(
      post.status || "draft"
    );

    setFeatured(
      post.featured || false
    );

    setHomepage(
      post.homepage || false
    );

    setSelectedImage(null);

    setImagePreview(
      post.image_url || ""
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * DELETE
   */
  const handleDelete = async (
    post: BlogPost
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${post.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("blog_posts")
        .delete()
        .eq(
          "id",
          post.id
        );

      if (deleteError) {
        throw deleteError;
      }

      await deleteStorageImage(
        post.image_url
      );

      await loadBlogPosts();
    } catch (deleteError: any) {
      console.error(
        "BLOG DELETE ERROR:",
        deleteError
      );

      setError(
        deleteError?.message ||
          "Unable to delete the blog post."
      );
    }
  };

  /*
   * PUBLISH / UNPUBLISH
   */
  const handleTogglePublish = async (
    post: BlogPost
  ) => {
    setError("");

    const newStatus =
      post.status ===
      "published"
        ? "draft"
        : "published";

    const {
      error: updateError,
    } = await supabase
      .from("blog_posts")
      .update({
        status:
          newStatus,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        post.id
      );

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    await loadBlogPosts();
  };

  /*
   * REMOVE IMAGE
   */
  const handleRemoveSelectedImage =
    () => {
      setSelectedImage(null);
      setImagePreview("");
      setImageUrl("");
    };

  return (
    <main className="blog-page">

      {/* HEADER */}

      <div className="blog-header">

        <div>

          <button
            className="back-dashboard-button"
            type="button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>

          <span className="blog-badge">
            TCA ADMIN
          </span>

          <h1>
            Blog
          </h1>

          <p>
            Create and manage
            Teens Connect Africa
            blog posts.
          </p>

        </div>

        <button
          className="add-blog-button"
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
            : "+ Add Blog Post"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="blog-error">
          {error}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <section className="blog-form-card">

          <h2>
            {editingId
              ? "Edit Blog Post"
              : "Add New Blog Post"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-field">

              <label htmlFor="title">
                Blog Title
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
                placeholder="e.g. 5 Ways Teens Can Build Leadership Skills"
                required
              />

              {title.trim() && (
                <small className="slug-preview">
                  Slug:{" "}
                  {generateSlug(
                    title
                  )}
                </small>
              )}

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
                placeholder="e.g. Education"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="author">
                Author
              </label>

              <input
                id="author"
                type="text"
                value={author}
                onChange={(event) =>
                  setAuthor(
                    event.target.value
                  )
                }
                placeholder="e.g. Teens Connect Africa"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="excerpt">
                Excerpt
              </label>

              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) =>
                  setExcerpt(
                    event.target.value
                  )
                }
                placeholder="Write a short summary of the article..."
                rows={4}
                required
              />

              <small className="image-help-text">
                This will be used as
                the short description
                on blog cards and
                previews.
              </small>

            </div>

            <div className="form-field">

              <label htmlFor="content">
                Full Article Content
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Write the full article here..."
                rows={14}
                required
              />

            </div>

            {/* COVER IMAGE */}

            <div className="form-field">

              <label htmlFor="blogImage">
                Cover Image
              </label>

              <input
                id="blogImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
              />

              <small className="image-help-text">
                Upload a JPG, PNG or
                WebP image.
                Maximum size: 5MB.
              </small>

              {imagePreview && (
                <div className="blog-image-preview">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Blog cover preview"
                  />

                  <button
                    type="button"
                    className="remove-blog-image-button"
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

            {/* OPTIONS */}

            <div className="blog-options">

              <label className="blog-checkbox">

                <input
                  type="checkbox"
                  checked={
                    featured
                  }
                  onChange={(event) =>
                    setFeatured(
                      event.target
                        .checked
                    )
                  }
                />

                <span>
                  Featured
                </span>

              </label>

              <label className="blog-checkbox">

                <input
                  type="checkbox"
                  checked={
                    homepage
                  }
                  onChange={(event) =>
                    setHomepage(
                      event.target
                        .checked
                    )
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
                className="save-blog-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Blog Post"
                  : "Save Blog Post"}
              </button>

              <button
                type="button"
                className="cancel-blog-button"
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

      {/* BLOG LIST */}

      <section className="blogs-list">

        <div className="section-heading">

          <h2>
            All Blog Posts
          </h2>

          <span>
            {posts.length} post
            {posts.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {loading ? (

          <div className="blogs-loading">
            Loading blog posts...
          </div>

        ) : posts.length === 0 ? (

          <div className="blogs-empty">

            <h3>
              No blog posts yet
            </h3>

            <p>
              Click "Add Blog Post"
              to create your first
              article.
            </p>

          </div>

        ) : (

          <div className="blogs-grid">

            {posts.map(
              (post) => (

                <article
                  className="blog-card"
                  key={
                    post.id
                  }
                >

                  {post.image_url ? (

                    <img
                      src={
                        post.image_url
                      }
                      alt={
                        post.title
                      }
                      className="blog-image"
                    />

                  ) : (

                    <div className="blog-image-placeholder">
                      No image
                    </div>

                  )}

                  <div className="blog-card-content">

                    <div className="blog-card-top">

                      <span className="blog-category">
                        {post.category ||
                          "General"}
                      </span>

                      <span
                        className={`blog-status ${
                          post.status ===
                          "published"
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {post.status}
                      </span>

                    </div>

                    {post.featured && (
                      <span className="featured-badge">
                        Featured
                      </span>
                    )}

                    <h3>
                      {post.title}
                    </h3>

                    <p className="blog-excerpt">
                      {post.excerpt ||
                        "No excerpt available."}
                    </p>

                    <div className="blog-meta">

                      <span>
                        By{" "}
                        {post.author ||
                          "TCA"}
                      </span>

                      <span>
                        {new Date(
                          post.created_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <div className="blog-card-actions">

                      <button
                        type="button"
                        className="edit-blog-button"
                        onClick={() =>
                          handleEdit(
                            post
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="publish-blog-button"
                        onClick={() =>
                          handleTogglePublish(
                            post
                          )
                        }
                      >
                        {post.status ===
                        "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        className="delete-blog-button"
                        onClick={() =>
                          handleDelete(
                            post
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default Blog;