import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Emmanuel Sadiq",
    role: " Graphic designer and Teen Member",
    image: "src/components/sections/Hero/207574 (2).jpg",
    rating: 5,
    message:
      "Teens Connect Africa gave me the confidence to speak in public and believe in my future. Every meeting leaves me motivated to become a better leader."
  },

  {
    id: 2,
    name: "Olaniyi Shakira",
    role: "President of TCA 2026,spoken Word Poet",
    image: "src/components/sections/Hero/aa019b45-3609-411b-97d5-d825f8e4bd77 (1).jpg",
    rating: 5,
    message:
      "I joined because I wanted friends, but I found mentors, opportunities and a family that truly believes in young people. I am ecited i have discovered my public speaking skills."
  },

  {
    id: 3,
    name: "Obize Gospel",
    role: "Tech Enthusiast and Teen Member",
    image: "src/components/sections/Hero/126908.jpg",
    rating: 5,
    message:
      "I started with this organization from the beginning. The programs and leadership trainings helped me discover talents I never knew I had. My confidence has grown tremendously."
  },

  {
    id: 4,
    name: "Success Sadiq",
    role: "Teen Member",
    image: "src/components/sections/Hero/207577 (1).jpg",
    rating: 5,
    message:
      "Every monthly meeting teaches me something new. I've learned communication, teamwork and how to set meaningful goals."
  },

  {
    id: 5,
    name: "Anslem Chiagozie",
    role: "Spoken Word Poet and Teen Member",
    image: "src/components/sections/Hero/207578 (1) (1).jpg",
    rating: 5,
    message:
      "Being part of this community has inspired me to pursue public speaking. I now believe I can make a difference in Africa."
  },

  {
    id: 6,
    name: "Abraham O.",
    role: "Auto engineer and Teen Member",
    image: "src/components/sections/Hero/207566 (1).jpg",
    rating: 5,
    message:
      "Teens Connect Africa has changed how I see myself. I've made lifelong friends and gained skills that will help me throughout my life."
  }
];
export default function Testimonials() {
  return (
    <section className="testimonials">

      <div className="container">

        <div className="section-header">
          <h2>What Our Teens Say</h2>
          <p>
            Hear directly from members whose lives have been transformed
            through Teens Connect Africa.
          </p>
        </div>
<section className="testimonials" id="testimonials"></section>
        <div className="testimonial-grid">

          {testimonials.map((item) => (

            <div className="testimonial-card" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
                className="testimonial-image"
              />

              <p className="testimonial-message">
                "{item.message}"
              </p>

              <h3>{item.name}</h3>

              <span>{item.role}</span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
