import "./AICoach.css";

export default function AICoach() {
  return (
    <section className="ai-coach" id="ai-coach">
      <div className="container">

        <div className="ai-left">

          <span className="badge">
            AI COACH
          </span>

          <h2>
            Your Personal AI Mentor,
            <br />
            Available 24/7
          </h2>

          <p>
            Ask questions, discover scholarships, learn new skills,
            prepare for exams, receive career guidance and build
            confidence with our intelligent AI Coach.
          </p>

          <div className="features">

            <div> Scholarship Guidance</div>

            <div>Career Roadmaps</div>

            <div>AI Learning Assistant</div>

            <div>Mental Wellness Support</div>

            <div>Entrepreneurship Advice</div>

            <div> Daily Motivation</div>

          </div>

          <button>
            Chat With AI Coach
          </button>

        </div>

        <div className="ai-right">

          <div className="chat-card">

            <div className="chat-header">
              AI Coach
            </div>
<section className="ai-coach" id="ai-coach"></section>
            <div className="chat-body">

              <div className="message user">
                How can I develop my leadership skills?
              </div>

              <div className="message ai">
                To develop your leadership skills, start by setting clear goals, seeking mentorship, and practicing effective communication. Engage in team projects, take on responsibilities, and learn from both successes and failures. Additionally, consider reading books on leadership and attending workshops or seminars to enhance your knowledge and abilities.
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}