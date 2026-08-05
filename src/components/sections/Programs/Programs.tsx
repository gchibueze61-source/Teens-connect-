import "./Programs.css";

const programs = [
  {
    id: 1,
    title: "Youth & Leadership Summit 26.0",
    category: "Leadership & Technology",
    description:
      "Join hundreds of young leaders as we eplore the future of leadership, technology and responsible citizenship.",
    image: "/images/programs/digital-skills.jpg",
    duration: "8 Weeks",
    ageRange: "Teenagers & youth",
    status: "Open",
    featured: true,
    homepage: true,
    registrationDeadline: "27-29 August 2026"
  },
  {
    id: 2,
    title: "Leadership Development",
    category: "Leadership",
    description:
      "Develop confidence, communication, teamwork and leadership skills through practical training.",
    image: "/images/programs/leadership.jpg",
    duration: "6 Weeks",
    ageRange: "13 - 19 Years",
    status: "Open",
    featured: true,
    homepage: true,
    registrationDeadline: "15 September 2026"
  },
  {
    id: 3,
    title: "Scholarship Hub",
    category: "Education",
    description:
      "Discover local and international scholarships with expert guidance throughout your application journey.",
    image: "/images/programs/scholarship.jpg",
    duration: "Ongoing",
    ageRange: "15 - 19 Years",
    status: "Open",
    featured: false,
    homepage: true,
    registrationDeadline: "-"
  },
  {
    id: 4,
    title: "Career Mentorship",
    category: "Career",
    description:
      "Connect with experienced professionals to explore careers and build a clear roadmap for your future.",
    image: "/images/programs/career.jpg",
    duration: "12 Weeks",
    ageRange: "14 - 19 Years",
    status: "Coming Soon",
    featured: false,
    homepage: true,
    registrationDeadline: "-"
  },
  {
    id: 5,
    title: "Entrepreneurship",
    category: "Business",
    description:
      "Learn business planning, financial literacy, innovation and how to build sustainable ventures.",
    image: "/images/programs/entrepreneurship.jpg",
    duration: "10 Weeks",
    ageRange: "15 - 19 Years",
    status: "Open",
    featured: false,
    homepage: true,
    registrationDeadline: "25 September 2026"
  },
  {
    id: 6,
    title: "Community Outreach",
    category: "Community",
    description:
      "Volunteer in impactful community projects while developing teamwork and leadership experience.",
    image: "/images/programs/community.jpg",
    duration: "Monthly",
    ageRange: "All Teenagers",
    status: "Ongoing",
    featured: true,
    homepage: true,
    registrationDeadline: "-"
  }
];

export default function Programs() {
  return (
    <section className="programs" id="programs">
      <div className="container">

        <div className="section-header">
          <h2>Our Programs</h2>
          <p>
            Empowering African teenagers through education,
            technology, leadership and mentorship.
          </p>
        </div>

        <div className="program-grid">

          {programs
            .filter(program => program.homepage)
            .map(program => (

            <div className="program-card" key={program.id}>

              <div className="program-image">
                <img src={program.image} alt={program.title} />
              </div>
<section className="programs" id="programs"></section>
              <span className="category">
                {program.category}
              </span>

              <h3>{program.title}</h3>

              <p>{program.description}</p>

              <div className="program-meta">

                <span> {program.duration}</span>

                <span> {program.ageRange}</span>

              </div>

              <div className="status-row">

                <span className={`status ${program.status.toLowerCase().replace(/\s/g,"-")}`}>
                  {program.status}
                </span>

                <button>
                  Learn More
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}