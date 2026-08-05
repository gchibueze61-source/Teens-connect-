import "./Blog.css";

const blogPosts = [
  {
    id: 1,
    title: "Why Every Teen Should Learn Leadership Early",
    category: "Leadership",
    date: "August 2026",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "Leadership is more than holding a position. Discover practical ways teenagers can begin leading in school, church and their communities."
  },

  {
    id: 2,
    title: "Artificial Intelligence Is Creating New Opportunities",
    category: "Technology",
    date: "August 2026",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "AI is changing education, business and careers. Learn how teenagers can prepare themselves for an AI-driven future."
  },

  {
    id: 3,
    title: "Building Confidence Through Community",
    category: "Personal Growth",
    date: "August 2026",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "Confidence grows when young people learn together. Here's how community and mentorship shape future leaders."
  }
];

export default function Blog() {
  return (
    <section className="blog" id="blog">

      <div className="container">

        <div className="section-header">
          <h2>Latest Articles</h2>
          <p>
            Insights, inspiration and practical knowledge to help teenagers
            grow in leadership, technology and purpose.
          </p>
        </div>

        <div className="blog-grid">

          {blogPosts.map((post) => (

            <article className="blog-card" key={post.id}>

              <img
                src={post.image}
                alt={post.title}
                className="blog-image"
              />

              <div className="blog-content">

                <span className="blog-category">
                  {post.category}
                </span>

                <h3>{post.title}</h3>

                <small>{post.date}</small>

                <p>{post.excerpt}</p>

                <button>Read More</button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}