import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./BlogPage.css";

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

export default function BlogPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
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
        .eq("status", "published")
        .order("featured", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("BLOG PAGE ERROR:", error);
        setError(error.message);
        setPosts([]);
      } else {
        setPosts((data || []) as BlogPost[]);
      }

      setLoading(false);
    };

    loadPosts();
  }, []);

  return (
    <main className="blog-page">

      <section className="blog-page-hero">
        <div className="container">
          <span className="blog-page-eyebrow">
            TEENS CONNECT AFRICA
          </span>

          <h1>Our Blog</h1>

          <p>
            Insights, inspiration and practical
            knowledge to help teenagers grow in
            leadership, technology and purpose.
          </p>
        </div>
      </section>

      <section className="blog-page-content">
        <div className="container">

          {loading && (
            <div className="blog-page-state">
              <div className="blog-page-loader"></div>
              <p>Loading articles...</p>
            </div>
          )}

          {!loading && error && (
            <div className="blog-page-state">
              <h2>Unable to load articles</h2>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            posts.length === 0 && (
              <div className="blog-page-state">
                <h2>No published articles yet</h2>
                <p>
                  Check back soon for new articles from
                  Teens Connect Africa.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            posts.length > 0 && (
              <div className="blog-page-grid">
                {posts.map((post) => (
                  <article
                    className="blog-page-card"
                    key={post.id}
                  >
                    {post.image_url ? (
                      <div className="blog-page-image-wrapper">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="blog-page-image"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="blog-page-image-placeholder">
                        <span>
                          Teens Connect Africa
                        </span>
                      </div>
                    )}

                    <div className="blog-page-card-content">

                      <div className="blog-page-meta">
                        {post.category && (
                          <span className="blog-page-category">
                            {post.category}
                          </span>
                        )}

                        <span className="blog-page-date">
                          {new Date(
                            post.created_at
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <h2>{post.title}</h2>

                      <p>
                        {post.excerpt ||
                          "Read this article to learn more."}
                      </p>

                      <div className="blog-page-card-footer">
                        <span>
                          By{" "}
                          {post.author ||
                            "Teens Connect Africa"}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/blog/${post.slug}`
                            )
                          }
                        >
                          Read Article
                          <span>→</span>
                        </button>
                      </div>

                    </div>
                  </article>
                ))}
              </div>
            )}

        </div>
      </section>
    </main>
  );
}