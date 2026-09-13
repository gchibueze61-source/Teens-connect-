import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import MemberPortal from "./pages/MemberPortal/MemberPortal";

import ProgramsPage from "./pages/Programs/ProgramsPage";
import ProgramDetails from "./pages/Programs/ProgramDetails";

import EventsPage from "./pages/Events/EventsPage";
import EventDetails from "./pages/Events/EventDetails";

import GalleryPage from "./pages/Gallery/GalleryPage";
import GalleryDetails from "./pages/Gallery/GalleryDetails";

import BlogPage from "./pages/Blog/BlogPage";
import BlogDetails from "./pages/Blog/BlogDetails";

import Founders from "./pages/Founders/Founders";
import Founder from "./pages/Founder/Founder";
import CoFounder from "./pages/CoFounder/CoFounder";

import Volunteer from "./pages/Volunteer/Volunteer";
import Donation from "./pages/Donation/Donation";

import AboutPage from "./pages/About/AboutPage";

import ContactPage from "./pages/Contact/ContactPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<App />}
      />


      {/* ABOUT */}
      <Route
        path="/about"
        element={<AboutPage />}
      />


      {/* PROGRAMS */}
      <Route
        path="/programs"
        element={<ProgramsPage />}
      />

      <Route
        path="/programs/:id"
        element={<ProgramDetails />}
      />


      {/* EVENTS */}
      <Route
        path="/events"
        element={<EventsPage />}
      />

      <Route
        path="/events/:id"
        element={<EventDetails />}
      />


      {/* GALLERY */}
      <Route
        path="/gallery"
        element={<GalleryPage />}
      />

      <Route
        path="/gallery/:id"
        element={<GalleryDetails />}
      />


      {/* BLOG */}
      <Route
        path="/blog"
        element={<BlogPage />}
      />

      <Route
        path="/blog/:slug"
        element={<BlogDetails />}
      />


      {/* CONTACT */}
      <Route
        path="/contact"
        element={<ContactPage />}
      />


      {/* GET INVOLVED */}
      <Route
        path="/volunteer"
        element={<Volunteer />}
      />


      {/* FOUNDERS */}
      <Route
        path="/founders"
        element={<Founders />}
      />

      <Route
        path="/founder"
        element={<Founder />}
      />

      <Route
        path="/co-founder"
        element={<CoFounder />}
      />


      {/* AUTHENTICATION */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* MEMBER PORTAL */}
      <Route
        path="/member-portal"
        element={<MemberPortal />}
      />


      {/* DONATION */}
      <Route
        path="/donate"
        element={<Donation />}
      />

    </Routes>
  );
};


export default AppRoutes;