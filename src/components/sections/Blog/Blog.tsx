import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
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

function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] =
    useState<BlogPost | null>(null);

  useEffect(() => {
    const loadPublishedPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("PUBLIC BLOG ERROR:", error);
        setBlogPosts([]);
      } else {
        setBlogPosts((data || []) as BlogPost[]);
      }

      setLoading(false);
    };

    loadPublishedPosts();
  }, []);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);

    // Move to the beginning of the article
    setTimeout(() => {
      document
        .getElementById("blog-article")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const handleBack = () => {
    setSelectedPost(null);

    setTimeout(() => {
      document
        .getElementById("blog")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /*
   * ==============================
   * FULL ARTICLE
   * ==============================
   */

  if (selectedPost) {
    return (
      <section
        className="blog blog-article-view"
        id="blog-article"
      >
        <div className="container">

          <button
            type="button"
            className="blog-back-button"
            onClick={handleBack}
          >
            ← Back to Articles
          </button>

          <article className="full-blog-article">

            {selectedPost.image_url && (
              <div className="full-blog-image-wrapper">
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="full-blog-image"
                />
              </div>
            )}

            <div className="full-blog-content">

              <div className="full-blog-meta">

                {selectedPost.category && (
                  <span className="blog-category">
                    {selectedPost.category}
                  </span>
                )}

                <span className="full-blog-date">
                  {new Date(
                    selectedPost.created_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>

              </div>

              <h1>{selectedPost.title}</h1>

              <div className="full-blog-author">
                By{" "}
                {selectedPost.author ||
                  "Teens Connect Africa"}
              </div>

              {selectedPost.excerpt && (
                <p className="full-blog-excerpt">
                  {selectedPost.excerpt}
                </p>
              )}

              {/* FULL CONTENT FROM SUPABASE */}

              <div className="full-blog-body">
                {selectedPost.content
                  .split(/\r?\n/)
                  .map((line, index) => {
                    const trimmedLine = line.trim();

                    if (!trimmedLine) {
                      return (
                        <div
                          key={index}
                          className="article-space"
                        />
                      );
                    }

                    return (
                      <p key={index}>
                        {trimmedLine}
                      </p>
                    );
                  })}
              </div>

              <button
                type="button"
                className="blog-back-bottom-button"
                onClick={handleBack}
              >
                ← Back to Articles
              </button>

            </div>

          </article>

        </div>
      </section>
    );
  }

  /*
   * ==============================
   * BLOG LIST
   * ==============================
   */

  return (
    <section
      className="blog"
      id="blog"
    >
      <div className="container">

        <div className="section-header">

          <h2>Latest Articles</h2>

          <p>
            Insights, inspiration and practical
            knowledge to help teenagers grow in
            leadership, technology and purpose.
          </p>

        </div>

        {loading ? (
          <div className="blog-loading">
            Loading articles...
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="blog-empty">
            <p>No published articles yet.</p>
          </div>
        ) : (
          <div className="blog-grid">

            {blogPosts.map((post) => (
              <article
                className="blog-card"
                key={post.id}
              >

                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="blog-image"
                  />
                ) : (
                  <div className="blog-image-placeholder">
                    No image
                  </div>
                )}

                <div className="blog-content">

                  {post.category && (
                    <span className="blog-category">
                      {post.category}
                    </span>
                  )}

                  <h3>{post.title}</h3>

                  <small>
                    {new Date(
                      post.created_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </small>

                  <p>
                    {post.excerpt ||
                      "Read this article to learn more."}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleReadMore(post)
                    }
                  >
                    Read More
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Blog;