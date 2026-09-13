import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomepagePosts = async () => {
      setLoading(true);

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
        .eq("homepage", true)
        .order("featured", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        })
        .limit(3);

      if (error) {
        console.error("PUBLIC HOMEPAGE BLOG ERROR:", error);
        setBlogPosts([]);
      } else {
        setBlogPosts((data || []) as BlogPost[]);
      }

      setLoading(false);
    };

    loadHomepagePosts();
  }, []);

  return (
    <section className="blog" id="blog">
      <div className="container">

        <div className="section-header">
          <span className="blog-eyebrow">
            FROM OUR BLOG
          </span>

          <h2>Latest Articles</h2>

          <p>
            Insights, inspiration and practical
            knowledge to help teenagers grow in
            leadership, technology and purpose.
          </p>
        </div>

        {loading ? (
          <div className="blog-loading">
            <div className="blog-loader"></div>
            <p>Loading articles...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="blog-empty">
            <h3>No articles yet</h3>
            <p>
              Check back soon for new articles from
              Teens Connect Africa.
            </p>
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article
                  className="blog-card"
                  key={post.id}
                >
                  {post.image_url ? (
                    <div className="blog-image-wrapper">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="blog-image"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="blog-image-placeholder">
                      <span>Teens Connect Africa</span>
                    </div>
                  )}

                  <div className="blog-content">

                    <div className="blog-meta">
                      {post.category && (
                        <span className="blog-category">
                          {post.category}
                        </span>
                      )}

                      <span className="blog-date">
                        {new Date(
                          post.created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3>{post.title}</h3>

                    <p>
                      {post.excerpt ||
                        "Read this article to learn more."}
                    </p>

                    <button
                      type="button"
                      className="blog-read-button"
                      onClick={() =>
                        navigate(`/blog/${post.slug}`)
                      }
                    >
                      Read Article
                      <span>→</span>
                    </button>

                  </div>
                </article>
              ))}
            </div>

            <div className="blog-view-all">
              <button
                type="button"
                onClick={() => navigate("/blog")}
              >
                View All Articles
                <span>→</span>
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
}

export default Blog;