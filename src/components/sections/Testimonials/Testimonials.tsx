import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Daniel Okafor",
    role: "Teen Member",
    image: "/images/testimonials/daniel.jpg",
    rating: 5,
    message:
      "Teens Connect Africa gave me the confidence to speak in public and believe in my future. Every meeting leaves me motivated to become a better leader."
  },

  {
    id: 2,
    name: "Favour Johnson",
    role: "Teen Member",
    image: "/images/testimonials/favour.jpg",
    rating: 5,
    message:
      "I joined because I wanted friends, but I found mentors, opportunities and a family that truly believes in young people."
  },

  {
    id: 3,
    name: "Michael Peters",
    role: "Teen Member",
    image: "/images/testimonials/michael.jpg",
    rating: 5,
    message:
      "The AI programs and leadership trainings helped me discover talents I never knew I had. My confidence has grown tremendously."
  },

  {
    id: 4,
    name: "Esther Williams",
    role: "Teen Member",
    image: "/images/testimonials/esther.jpg",
    rating: 5,
    message:
      "Every monthly meeting teaches me something new. I've learned communication, teamwork and how to set meaningful goals."
  },

  {
    id: 5,
    name: "Joshua Emmanuel",
    role: "Teen Member",
    image: "/images/testimonials/joshua.jpg",
    rating: 5,
    message:
      "Being part of this community has inspired me to pursue technology and leadership. I now believe I can make a difference in Africa."
  },

  {
    id: 6,
    name: "Precious Grace",
    role: "Teen Member",
    image: "/images/testimonials/precious.jpg",
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
