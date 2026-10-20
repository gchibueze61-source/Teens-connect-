import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";

// Lazy-loaded pages
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const MemberPortal = lazy(() => import("./pages/MemberPortal/MemberPortal"));
const Team = lazy(() => import("./pages/Team/Team"));

const Mentor = lazy(() => import("./pages/Mentor/Mentor"));
const EventsPage = lazy(() => import("./pages/Events/EventsPage"));
const EventDetails = lazy(() => import("./pages/Events/EventDetails"));


const BlogPage = lazy(() => import("./pages/Blog/BlogPage"));
const BlogDetails = lazy(() => import("./pages/Blog/BlogDetails"));

const Founders = lazy(() => import("./pages/Founders/Founders"));
const Founder = lazy(() => import("./pages/Founder/Founder"));
const CoFounder = lazy(() => import("./pages/CoFounder/CoFounder"));

const BoardMembers = lazy(
  () => import("./pages/BoardMembers/BoardMembers")
);

const BoardApplication = lazy(
  () => import("./pages/BoardApplication/BoardApplication")
);

const Volunteer = lazy(() => import("./pages/Volunteer/Volunteer"));
const Donation = lazy(() => import("./pages/Donation/Donation"));
const ImpactPage = lazy(() => import("./pages/Impact/ImpactPage"));
const AboutPage = lazy(() => import("./pages/About/AboutPage"));
const ContactPage = lazy(() => import("./pages/Contact/ContactPage"));
const TeenExecutiveCommittee = lazy(
  () =>
    import(
      "./pages/TeenExecutiveCommittee/TeenExecutiveCommittee"
    )
);
const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Loading...
        </div>
      }
    >
      <Routes>

        {/* HOME */}
        <Route path="/" element={<App />} />

        {/* ABOUT */}
        <Route path="/about" element={<AboutPage />} />

       
        {/* EVENTS */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />

      

        {/* BLOG */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />

        {/* CONTACT */}
        <Route path="/contact" element={<ContactPage />} />

        {/* GET INVOLVED */}
        <Route path="/volunteer" element={<Volunteer />} />
        <Route
          path="/board-application"
          element={<BoardApplication />}
        />
<Route path="/mentor" element={<Mentor />} />
        {/* FOUNDERS */}
        <Route path="/founders" element={<Founders />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/co-founder" element={<CoFounder />} />
        <Route path="/board-members" element={<BoardMembers />} />

        {/* AUTHENTICATION */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* MEMBER PORTAL */}
        <Route path="/member-portal" element={<MemberPortal />} />
<Route
  path="/teen-executive-committee"
  element={<TeenExecutiveCommittee />}
/>
        {/* DONATION */}
        <Route path="/donate" element={<Donation />} />
<Route path="/team" element={<Team />} />
{/* IMPACT */}
<Route path="/impact" element={<ImpactPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;