import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./BlogDetails.css";

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

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError("Article not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          category,
          author,
          image_url,
          status,
          featured,
          homepage,
          created_at,
          updated_at
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        console.error(
          "BLOG DETAILS ERROR:",
          error
        );

        setError(error.message);
        setPost(null);
      } else if (!data) {
        setError("This article could not be found.");
        setPost(null);
      } else {
        setPost(data as BlogPost);
      }

      setLoading(false);
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="blog-details-page">
        <div className="blog-details-state">
          <div className="blog-details-loader"></div>
          <p>Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="blog-details-page">
        <div className="blog-details-state">
          <h1>Article Not Found</h1>

          <p>
            {error ||
              "The article you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/blog")}
          >
            Back to Blog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-details-page">

      <section className="blog-details-hero">
        <div className="container">

          <button
            type="button"
            className="blog-details-back"
            onClick={() => navigate("/blog")}
          >
            ← Back to Articles
          </button>

          <div className="blog-details-heading">

            {post.category && (
              <span className="blog-details-category">
                {post.category}
              </span>
            )}

            <h1>{post.title}</h1>

            <div className="blog-details-meta">
              <span>
                By{" "}
                {post.author ||
                  "Teens Connect Africa"}
              </span>

              <span>
                {new Date(
                  post.created_at
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

          </div>
        </div>
      </section>

      <section className="blog-details-content">
        <div className="container">

          <article className="blog-article">

            {post.image_url && (
              <div className="blog-details-image-wrapper">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="blog-details-image"
                />
              </div>
            )}

            <div className="blog-article-body">

              {post.excerpt && (
                <p className="blog-details-excerpt">
                  {post.excerpt}
                </p>
              )}

              <div className="blog-details-text">
                {post.content
                  .split(/\r?\n/)
                  .map((line, index) => {
                    const trimmedLine =
                      line.trim();

                    if (!trimmedLine) {
                      return (
                        <div
                          key={index}
                          className="blog-article-space"
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

            </div>

          </article>

          <div className="blog-details-bottom">
            <button
              type="button"
              onClick={() => navigate("/blog")}
            >
              ← Back to Articles
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}