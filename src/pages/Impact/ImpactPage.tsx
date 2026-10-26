import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/sections/Footer";
import { supabase } from "../../lib/supabase";
import emmanuelImage from "../../components/sections/Testimonials/207574 (2).jpg";
import shakiraImage from "../../components/sections/Testimonials/aa019b45-3609-411b-97d5-d825f8e4bd77 (1).jpg";
import gospelImage from "../../components/sections/Testimonials/126908.jpg";
import successImage from "../../components/sections/Testimonials/207577 (1).jpg";
import anslemImage from "../../components/sections/Testimonials/207578 (1) (1).jpg";
import abrahamImage from "../../components/sections/Testimonials/207566 (1).jpg";
import "./ImpactPage.css";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number | null;
};

type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  gallery_images: GalleryImage[] | null;
};

const initialImpactStats = [
  {
    value: 2750,
    suffix: "+",
    label: "Teens reached directly",
    detail: "Through mentorship and youth engagement",
    visual: "ring",
  },
  {
    value: 3500,
    suffix: "+",
    label: "People reached online",
    detail: "Through digital platforms and educational content",
    visual: "bars",
  },
  {
    value: 345,
    suffix: "",
    label: "Talent development participants",
    detail: "Across three programme editions",
    visual: "ring",
  },
  {
    value: 3000,
    suffix: "+",
    label: "Students reached",
    detail: "Through school outreach in 2025",
    visual: "bars",
  },
  {
    value: 50,
    suffix: "",
    label: "Vocational trainees",
    detail: "Young people developing practical skills",
    visual: "ring",
  },
  {
    value: 4000,
    suffix: "+",
    label: "Community residents reached",
    detail: "Indirect community reach through environmental action",
    visual: "bars",
  },
  {
    value: 15,
    suffix: "",
    label: "Climate ambassadors",
    detail: "Appointed in Zuba community",
    visual: "ring",
  },
  {
    value: 5,
    suffix: "",
    label: "Creative talent clubs",
    detail: "Dance, Drama, Spoken Word Poetry, Writing and Music",
    visual: "bars",
  },
];

const impactPillars = [
  {
    number: "01",
    title: "Young people with a voice",
    description:
      "We create opportunities for teenagers to build confidence, express ideas, develop leadership and take an active role in their communities.",
    symbol: "voice",
  },
  {
    number: "02",
    title: "Skills for what comes next",
    description:
      "We encourage learning, talent discovery and practical development so young people can explore their strengths and prepare for future opportunities.",
    symbol: "growth",
  },
  {
    number: "03",
    title: "Communities that care",
    description:
      "We connect youth participation with community responsibility, environmental awareness and collective action.",
    symbol: "community",
  },
];

const sdgs = [
  {
    number: "04",
    title: "Quality education",
    description: "Learning, mentorship and opportunities to develop new skills.",
  },
  {
    number: "05",
    title: "Gender equality",
    description:
      "Encouraging girls to lead, participate and pursue opportunities.",
  },
  {
    number: "08",
    title: "Decent work and economic growth",
    description:
      "Supporting practical skills, creativity and future readiness.",
  },
  {
    number: "13",
    title: "Climate action",
    description:
      "Promoting environmental awareness and community participation.",
  },
  {
    number: "17",
    title: "Partnerships for the goals",
    description:
      "Working with others to widen opportunities and strengthen impact.",
  },
];

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(media.matches);

    const updatePreference = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    media.addEventListener?.("change", updatePreference);

    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  return reducedMotion;
}

function AnimatedCounter({
  value,
  suffix = "",
  reduceMotion,
}: {
  value: number;
  suffix?: string;
  reduceMotion: boolean;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, reduceMotion]);

  useEffect(() => {
    if (!visible) return;

    if (reduceMotion) {
      setCount(value);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;
    const duration = 2400;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    setCount(0);
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [visible, value, reduceMotion]);

  return (
    <span ref={elementRef} className="impact-counter">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function ProgressRing({
  value,
  maximum,
}: {
  value: number;
  maximum: number;
}) {
  const percentage = Math.max(0, Math.min((value / maximum) * 100, 100));

  return (
    <div
      className="impact-ring"
      style={{ "--ring-progress": `${percentage}%` } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="impact-ring-inner">
        <span className="impact-ring-dot" />
      </span>
    </div>
  );
}

function MiniBars({ index }: { index: number }) {
  const heights = [
    [36, 52, 44, 68, 60, 82, 74],
    [28, 46, 38, 62, 76, 68, 90],
    [34, 42, 58, 48, 72, 84, 78],
    [30, 50, 44, 70, 62, 80, 92],
  ];

  return (
    <div className="impact-mini-bars" aria-hidden="true">
      {heights[index % heights.length].map((height, barIndex) => (
        <span
          key={`${index}-${barIndex}`}
          style={{ "--bar-height": `${height}%` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function AfricaImpactIllustration() {
  const points = [
    [145, 112],
    [205, 164],
    [165, 219],
    [224, 260],
    [190, 315],
    [268, 132],
    [108, 177],
    [275, 213],
    [155, 350],
  ];

  const mapPath =
    "M105 32 L145 25 L174 40 L205 35 L230 53 L258 51 L282 71 L310 82 L330 109 L318 135 L333 153 L316 174 L301 198 L284 218 L276 245 L257 273 L248 304 L230 331 L219 359 L199 393 L184 427 L166 411 L153 379 L138 353 L129 326 L111 302 L98 276 L85 248 L70 222 L60 194 L46 172 L53 145 L43 121 L55 96 L76 78 L83 55 Z";

  return (
    <div
      className="impact-map-art"
      aria-label="Illustration representing community connections across Africa"
    >
      <div className="impact-map-orbit impact-map-orbit-one" />
      <div className="impact-map-orbit impact-map-orbit-two" />
      <div className="impact-map-glow" />

      <svg
        className="impact-africa-map"
        viewBox="0 0 420 470"
        role="img"
        aria-label="Stylised illustration of Africa with connected points"
      >
        <defs>
          <linearGradient id="africaFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>

          <pattern
            id="africaDots"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1.3"
              fill="#FFFFFF"
              opacity="0.32"
            />
          </pattern>
        </defs>

        <path
          className="impact-africa-shape"
          d={mapPath}
          fill="url(#africaFill)"
        />

        <path d={mapPath} fill="url(#africaDots)" />

        <path
          className="impact-map-connection"
          d="M145 112 L205 164 L165 219 L224 260 L190 315 M205 164 L268 132 M165 219 L108 177 M224 260 L275 213 M190 315 L155 350"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeDasharray="4 7"
        />

        {points.map(([cx, cy], index) => (
          <g className="impact-map-point" key={index}>
            <circle cx={cx} cy={cy} r="10" fill="#5EEAD4" opacity="0.22" />
            <circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" />
            <circle cx={cx} cy={cy} r="2" fill="#0F766E" />
          </g>
        ))}
      </svg>

      <div className="impact-map-label impact-map-label-main">
        <span className="impact-map-label-pulse" />
        <span>
          <strong>One continent</strong>
          <small>Many possibilities</small>
        </span>
      </div>

      <div className="impact-map-label impact-map-label-small">
        <span className="impact-map-label-icon">✳</span>
        <span>
          <strong>Youth-led change</strong>
          <small>Starts in communities</small>
        </span>
      </div>

      <span className="impact-map-coordinate impact-map-coordinate-top">
        09°04′ N
      </span>

      <span className="impact-map-coordinate impact-map-coordinate-bottom">
        COMMUNITY · CONNECTION · CHANGE
      </span>
    </div>
  );
}

/*
 * Testimonial content supplied for the TCA website.
 * Confirm photo-to-person matching and publication consent before publishing.
 */
function TeenTestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Emmanuel Sadiq",
      role: "Graphic Designer and Teen Member",
      message:
        "Teens Connect Africa gave me the confidence to speak in public and believe in my future. Every meeting leaves me motivated to become a better leader.",
      image: emmanuelImage,
    },
    {
      id: 2,
      name: "Olaniyi Shakira",
      role: "President of TCA 2026, Spoken Word Poet",
      message:
        "I joined because I wanted friends, but I found mentors, opportunities and a family that truly believes in young people. I am excited I have discovered my public speaking skills.",
      image: shakiraImage,
    },
    {
      id: 3,
      name: "Obize Gospel",
      role: "Web Developer, AI Generalist and Teen Member",
      message:
        "I started with this organization from the beginning. The programs and leadership trainings helped me discover talents I never knew I had. My confidence has grown tremendously.",
      image: gospelImage,
    },
    {
      id: 4,
      name: "Success Sadiq",
      role: "Teen Member",
      message:
        "Every monthly meeting teaches me something new. I've learned communication, teamwork and how to set meaningful goals.",
      image: successImage,
    },
    {
      id: 5,
      name: "Anslem Chiagozie",
      role: "Spoken Word Poet and Teen Member",
      message:
        "Being part of this community has inspired me to pursue public speaking. I now believe I can make a difference in Africa.",
      image: anslemImage,
    },
    {
      id: 6,
      name: "Abraham Obidike",
      role: "Teen Member",
      message:
        "Teens Connect Africa has changed how I see myself. I've made lifelong friends and gained skills that will help me throughout my life.",
      image: abrahamImage,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotionPreference();
  const active = testimonials[activeIndex];

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  function showPrevious() {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }

  return (
    <section
      className="impact-testimonials-section impact-featured-testimonial"
      id="teen-stories"
    >
      <div className="impact-container">
        <div className="impact-section-heading">
          <div>
            <span className="impact-eyebrow">
              <span className="impact-eyebrow-line" />
              VOICES FROM OUR COMMUNITY
            </span>

            <h2>
              What our teens say.
              <br />
              <span>Real voices. Real growth.</span>
            </h2>
          </div>

          <p>
            From discovering new talents to building confidence, leadership
            and practical skills, hear directly from the young people whose
            experiences are part of the Teens Connect Africa story.
          </p>
        </div>

        <div className="impact-testimonial-slider">
          <div className="impact-testimonial-slide-image">
            <img
              key={active.image}
              src={active.image}
              alt={`Portrait of ${active.name}`}
              loading="eager"
              decoding="async"
            />

            <span className="impact-testimonial-image-label">
              TEENS CONNECT AFRICA
            </span>

            <span className="impact-testimonial-image-counter">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>

          <div className="impact-testimonial-slide-content" aria-live="polite">
            <span
              className="impact-testimonial-quote-mark"
              aria-hidden="true"
            >
              “
            </span>

            <span className="impact-eyebrow">
              A YOUNG PERSON'S EXPERIENCE
            </span>

            <blockquote
              key={`${activeIndex}-quote`}
              className="impact-testimonial-quote"
            >
              {active.message}
            </blockquote>

            <div className="impact-testimonial-person">
              <h3 className="impact-testimonial-name">{active.name}</h3>

              <p className="impact-testimonial-attribution">{active.role}</p>

              <span className="impact-testimonial-organization">
                Teens Connect Africa
              </span>
            </div>

            <div className="impact-testimonial-slider-controls">
              <div
                className="impact-testimonial-dots"
                role="group"
                aria-label="Choose a testimonial"
              >
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    className={`impact-testimonial-dot ${
                      activeIndex === index ? "is-active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    aria-pressed={activeIndex === index}
                  />
                ))}
              </div>

              <div className="impact-testimonial-arrows">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous testimonial"
                >
                  <span aria-hidden="true">←</span>
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next testimonial"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery_items")
          .select(
            "id, title, description, category, gallery_images(id, image_url, sort_order)"
          )
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (active) {
          const records = (data ?? []) as unknown as GalleryAlbum[];

          const sortedRecords = records
            .map((album) => ({
              ...album,
              gallery_images: [...(album.gallery_images ?? [])].sort(
                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
              ),
            }))
            .filter((album) =>
              album.gallery_images?.some((image) => image.image_url)
            );

          setAlbums(sortedRecords);
        }
      } catch (error) {
        console.error("Unable to load impact gallery:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGallery();

    return () => {
      active = false;
    };
  }, []);

  const photos = albums.flatMap((album) =>
    (album.gallery_images ?? [])
      .filter((image) => image.image_url)
      .map((image) => ({
        ...image,
        albumTitle: album.title,
        albumDescription: album.description,
        albumCategory: album.category,
      }))
  );

  const currentPhoto = photos[activeImage];

  function showPrevious() {
    setActiveImage((current) =>
      photos.length ? (current - 1 + photos.length) % photos.length : 0
    );
  }

  function showNext() {
    setActiveImage((current) =>
      photos.length ? (current + 1) % photos.length : 0
    );
  }

  useEffect(() => {
    if (activeImage >= photos.length) setActiveImage(0);
  }, [activeImage, photos.length]);

  return (
    <section className="impact-gallery-section" id="impact-in-action">
      <div className="impact-container">
        <div className="impact-section-heading impact-gallery-heading">
          <div>
            <span className="impact-eyebrow">
              <span className="impact-eyebrow-line" />
              IMPACT IN ACTION
            </span>

            <h2>
              Real moments.
              <br />
              <span>Real community.</span>
            </h2>
          </div>

          <p>
            Behind every number are people, shared experiences and communities
            working towards a brighter future. These moments offer a glimpse
            into the work and connections behind our impact.
          </p>
        </div>

        {loading ? (
          <div className="impact-gallery-loading" aria-live="polite">
            <span className="impact-loading-spinner" />
            <span>Bringing our community moments together...</span>
          </div>
        ) : currentPhoto ? (
          <div className="impact-gallery-viewer">
            <div className="impact-gallery-main">
              <img
                src={currentPhoto.image_url}
                alt="Teens Connect Africa community activity"
                loading="lazy"
                decoding="async"
              />

              <div className="impact-gallery-image-shade" />

              <div className="impact-gallery-caption">
                <span className="impact-gallery-caption-tag">
                  TCA COMMUNITY
                </span>
                <h3>Impact in action</h3>
              </div>

              <div className="impact-gallery-controls">
                <span className="impact-gallery-count">
                  {String(activeImage + 1).padStart(2, "0")}{" "}
                  <span>/ {String(photos.length).padStart(2, "0")}</span>
                </span>

                <div className="impact-gallery-buttons">
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous community photo"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next community photo"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div
              className="impact-gallery-thumbnails"
              aria-label="Choose a community photo"
            >
              {photos.slice(0, 6).map((photo, index) => (
                <button
                  type="button"
                  className={`impact-gallery-thumb ${
                    activeImage === index ? "is-active" : ""
                  }`}
                  key={photo.id}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show community photo ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img src={photo.image_url} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="impact-gallery-empty">
            <div className="impact-gallery-empty-icon">✳</div>
            <h3>Our impact is lived, not just counted.</h3>
            <p>
              Community photographs will appear here when published images are
              available in the TCA gallery.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ImpactPage() {
  const [activeStat, setActiveStat] = useState(0);
  const [impactStats, setImpactStats] = useState(initialImpactStats);
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    let active = true;
    async function loadImpactStats() {
      const { data, error } = await supabase
        .from("impact_statistics")
        .select("statistic_key, label, value, suffix, description, sort_order")
        .eq("is_published", true)
        .eq("show_on_impact_page", true)
        .order("sort_order", { ascending: true });
      if (error || !data || !active || data.length === 0) return;
      setImpactStats(data.map((stat, index) => ({
        value: Number(stat.value),
        suffix: stat.suffix ?? "",
        label: stat.label,
        detail: stat.description ?? "",
        visual: index % 2 === 0 ? "ring" : "bars",
      })));
      setActiveStat(0);
    }
    void loadImpactStats();
    return () => { active = false; };
  }, []);

  return (
    <>
      <Navbar />

      <main className="impact-page">
        <section className="impact-hero">
          <div className="impact-hero-background" aria-hidden="true">
            <span className="impact-hero-orb impact-hero-orb-one" />
            <span className="impact-hero-orb impact-hero-orb-two" />
            <span className="impact-hero-grid" />
          </div>

          <div className="impact-container impact-hero-layout">
            <div className="impact-hero-copy">
              <span className="impact-eyebrow impact-eyebrow-light">
                <span className="impact-eyebrow-line" />
                OUR IMPACT
              </span>

              <h1>
                The future changes
                <br />
                when <span>young people</span>
                <br />
                get the chance.
              </h1>

              <p className="impact-hero-description">
                We believe every young person carries potential. Through
                mentorship, learning, creativity and community action, Teens
                Connect Africa is helping young people discover what they can
                become and what they can change.
              </p>

              <div className="impact-hero-actions">
                <a
                  className="impact-button impact-button-light"
                  href="#impact-numbers"
                >
                  Explore our impact <span aria-hidden="true">↘</span>
                </a>

                <Link className="impact-text-link" to="/about">
                  Discover our mission <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="impact-hero-footnote">
                <span className="impact-footnote-dot" />
                <span>
                  Growing potential. Connecting communities. Inspiring change.
                </span>
              </div>
            </div>

            <div className="impact-hero-visual">
              <div className="impact-hero-visual-top">
                <span>THE CHANGE WE CREATE</span>
                <span className="impact-live-indicator">
                  <i /> IN MOTION
                </span>
              </div>

              <div className="impact-hero-visual-center">
                <div className="impact-hero-ring impact-hero-ring-outer" />
                <div className="impact-hero-ring impact-hero-ring-middle" />
                <div className="impact-hero-ring impact-hero-ring-inner" />

                <div className="impact-hero-center-symbol">
                  <span className="impact-symbol-sun">✳</span>
                  <strong>TCA</strong>
                  <small>YOUTH · COMMUNITY · FUTURE</small>
                </div>

                <span className="impact-orbit-node impact-orbit-node-one" />
                <span className="impact-orbit-node impact-orbit-node-two" />
                <span className="impact-orbit-node impact-orbit-node-three" />
              </div>

              <div className="impact-hero-visual-bottom">
                <div>
                  <span className="impact-hero-mini-label">OUR BELIEF</span>
                  <strong>Potential deserves opportunity.</strong>
                </div>

                <span className="impact-hero-arrow">↗</span>
              </div>
            </div>
          </div>

          <div className="impact-hero-bottom-line">
            <span>01 — PEOPLE</span>
            <span>02 — POSSIBILITY</span>
            <span>03 — PROGRESS</span>
          </div>
        </section>

        <section className="impact-numbers-section" id="impact-numbers">
          <div className="impact-container">
            <div className="impact-section-heading">
              <div>
                <span className="impact-eyebrow">
                  <span className="impact-eyebrow-line" />
                  OUR IMPACT AT A GLANCE
                </span>

                <h2>
                  Every number
                  <br />
                  <span>represents possibility.</span>
                </h2>
              </div>

              <p>
                The figures below reflect reported reach and participation
                across TCA's work. They tell part of our story; the experiences
                behind them are what make the work meaningful.
              </p>
            </div>

            <div className="impact-dashboard">
              <div className="impact-dashboard-header">
                <div>
                  <span className="impact-dashboard-kicker">
                    TCA IMPACT SNAPSHOT
                  </span>
                  <h3>Progress through people</h3>
                </div>

                <span className="impact-dashboard-status">
                  <i /> IMPACT INDICATORS
                </span>
              </div>

              <div className="impact-stat-grid">
                {impactStats.map((stat, index) => (
                  <button
                    type="button"
                    className={`impact-stat-card ${
                      activeStat === index ? "is-selected" : ""
                    }`}
                    key={stat.label}
                    onClick={() => setActiveStat(index)}
                    aria-pressed={activeStat === index}
                  >
                    <div className="impact-stat-card-top">
                      <span className="impact-stat-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {stat.visual === "ring" ? (
                        <ProgressRing value={stat.value} maximum={4000} />
                      ) : (
                        <MiniBars index={index} />
                      )}
                    </div>

                    <div className="impact-stat-number">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        reduceMotion={reduceMotion}
                      />
                    </div>

                    <h4>{stat.label}</h4>
                    <p>{stat.detail}</p>
                    <span className="impact-stat-indicator" />
                  </button>
                ))}
              </div>

              <div className="impact-dashboard-footer">
                <div className="impact-dashboard-footer-mark">✳</div>
                <p>
                  <strong>{impactStats[activeStat].label}</strong>
                  <span>{impactStats[activeStat].detail}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <TeenTestimonialsSection />

        <section className="impact-map-section">
          <div className="impact-container impact-map-layout">
            <div className="impact-map-copy">
              <span className="impact-eyebrow">
                <span className="impact-eyebrow-line" />
                LOCAL ACTION, BIGGER POSSIBILITY
              </span>

              <h2>
                Change begins
                <br />
                <span>where we are.</span>
              </h2>

              <p>
                From community connections in Zuba, Abuja, to the wider
                possibilities across Africa, we believe lasting change grows
                when young people are supported to participate, lead and serve.
              </p>

              <div className="impact-map-facts">
                <div className="impact-map-fact">
                  <span className="impact-map-fact-icon">01</span>
                  <div>
                    <strong>Rooted in community</strong>
                    <p>Listening, learning and working with young people.</p>
                  </div>
                </div>

                <div className="impact-map-fact">
                  <span className="impact-map-fact-icon">02</span>
                  <div>
                    <strong>Connected by purpose</strong>
                    <p>
                      Building relationships that help ideas grow into action.
                    </p>
                  </div>
                </div>

                <div className="impact-map-fact">
                  <span className="impact-map-fact-icon">03</span>
                  <div>
                    <strong>Looking towards the future</strong>
                    <p>
                      Creating room for the next generation to make a
                      difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <AfricaImpactIllustration />
          </div>
        </section>

        <section className="impact-pillars-section">
          <div className="impact-container">
            <div className="impact-section-heading impact-pillars-heading">
              <div>
                <span className="impact-eyebrow">
                  <span className="impact-eyebrow-line" />
                  WHAT IMPACT MEANS TO US
                </span>

                <h2>
                  More than numbers.
                  <br />
                  <span>A change in possibility.</span>
                </h2>
              </div>

              <p>
                Impact is not only about how many people we reach. It is also
                about the confidence, skills, connections and sense of
                responsibility that young people carry into their futures.
              </p>
            </div>

            <div className="impact-pillars-grid">
              {impactPillars.map((pillar) => (
                <article className="impact-pillar-card" key={pillar.number}>
                  <div className="impact-pillar-card-top">
                    <span>{pillar.number}</span>

                    <span
                      className={`impact-pillar-symbol symbol-${pillar.symbol}`}
                    >
                      {pillar.symbol === "voice"
                        ? "↗"
                        : pillar.symbol === "growth"
                          ? "✳"
                          : "◎"}
                    </span>
                  </div>

                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                  <span className="impact-pillar-bottom-line" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <GallerySection />

        <section className="impact-sdg-section">
          <div className="impact-container">
            <div className="impact-section-heading">
              <div>
                <span className="impact-eyebrow">
                  <span className="impact-eyebrow-line" />
                  OUR WORK AND THE GLOBAL GOALS
                </span>

                <h2>
                  Local actions.
                  <br />
                  <span>Shared global goals.</span>
                </h2>
              </div>

              <p>
                Our focus on young people, learning, skills and community
                participation connects with wider efforts to create a more
                inclusive and sustainable future.
              </p>
            </div>

            <div className="impact-sdg-grid">
              {sdgs.map((sdg) => (
                <article className="impact-sdg-card" key={sdg.number}>
                  <span className="impact-sdg-number">{sdg.number}</span>

                  <div className="impact-sdg-card-content">
                    <h3>{sdg.title}</h3>
                    <p>{sdg.description}</p>
                  </div>

                  <span className="impact-sdg-arrow" aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>

            <p className="impact-sdg-note">
              These are areas of alignment, not a claim of official UN
              endorsement or certification.
            </p>
          </div>
        </section>

        <section className="impact-cta-section">
          <div className="impact-cta-decoration" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="impact-container impact-cta-layout">
            <div>
              <span className="impact-eyebrow impact-eyebrow-light">
                <span className="impact-eyebrow-line" />
                THE FUTURE IS A SHARED PROJECT
              </span>

              <h2>
                Help possibility
                <br />
                become <span>progress.</span>
              </h2>

              <p>
                Young people thrive when communities, mentors and partners
                believe in their potential. Be part of the connections that
                make more opportunities possible.
              </p>
            </div>
            <div className="impact-cta-actions">
  <Link
    to="/donate"
    className="impact-button impact-button-donate"
  >
    Support a Teen <span aria-hidden="true">♥</span>
  </Link>

  <Link
    to="/contact"
    className="impact-button impact-button-light"
  >
    Connect with TCA <span aria-hidden="true">→</span>
  </Link>

  <Link to="/about" className="impact-cta-secondary">
    Learn about our mission <span aria-hidden="true">↗</span>
  </Link>
</div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}