import { useEffect } from "react";
import "./Testimonials.css";

import testimonial1 from "./207574 (2).jpg";
import testimonial2 from "./aa019b45-3609-411b-97d5-d825f8e4bd77 (1).jpg";
import testimonial3 from "./126908.jpg";
import testimonial4 from "./207577 (1).jpg";
import testimonial5 from "./207578 (1) (1).jpg";
import testimonial6 from "./207566 (1).jpg";

const testimonials = [
  {
    id: 1,
    name: "Emmanuel Sadiq",
    role: "Graphic designer and Teen Member",
    image: testimonial1,
    message:
      "Teens Connect Africa gave me the confidence to speak in public and believe in my future. Every meeting leaves me motivated to become a better leader.",
  },
  {
    id: 2,
    name: "Olaniyi Shakira",
    role: "President of TCA 2026, Spoken Word Poet",
    image: testimonial2,
    message:
      "I joined because I wanted friends, but I found mentors, opportunities and a family that truly believes in young people. I am excited I have discovered my public speaking skills.",
  },
  {
    id: 3,
    name: "Obize Gospel",
    role: "Web Developer, AI Generalistand Teen Member",
    image: testimonial3,
    message:
      "I started with this organization from the beginning. The programs and leadership trainings helped me discover talents I never knew I had. My confidence has grown tremendously.",
  },
  {
    id: 4,
    name: "Success Sadiq",
    role: "Teen Member",
    image: testimonial4,
    message:
      "Every monthly meeting teaches me something new. I've learned communication, teamwork and how to set meaningful goals.",
  },
  {
    id: 5,
    name: "Anslem Chiagozie",
    role: "Spoken Word Poet and Teen Member",
    image: testimonial5,
    message:
      "Being part of this community has inspired me to pursue public speaking. I now believe I can make a difference in Africa.",
  },
  {
    id: 6,
    name: "Abraham Obidike.",
    role: "Teen Member",
    image: testimonial6,
    message:
      "Teens Connect Africa has changed how I see myself. I've made lifelong friends and gained skills that will help me throughout my life.",
  },
];

export default function Testimonials() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".testimonials .testimonial-reveal"
    );

    if (!elements.length) return;

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.classList.add("testimonial-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("testimonial-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">

        <div className="section-header testimonial-reveal testimonial-header-reveal">
          <span className="testimonials-label">
            TESTIMONIALS
          </span>

          <h2>What Our Teens Say</h2>

          <p>
            Hear directly from members whose lives have been transformed
            through Teens Connect Africa.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <article
              className={`testimonial-card testimonial-reveal testimonial-card-reveal testimonial-delay-${
                (index % 3) + 1
              }`}
              key={item.id}
            >
              <div className="testimonial-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="testimonial-image"
                />
              </div>

              <p className="testimonial-message">
                "{item.message}"
              </p>

              <div className="testimonial-person">
                <h3>{item.name}</h3>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}