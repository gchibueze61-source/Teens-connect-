import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import MemberPortal from "./pages/MemberPortal/MemberPortal";

import Programs from "./components/sections/Programs";

import GalleryPage from "./pages/Gallery/GalleryPage";
import GalleryDetails from "./pages/Gallery/GalleryDetails";

import Founders from "./pages/Founders/Founders";
import Founder from "./pages/Founder/Founder";
import CoFounder from "./pages/CoFounder/CoFounder";

import Volunteer from "./pages/Volunteer/Volunteer";
import Donation from "./pages/Donation/Donation";
const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* =========================
          MAIN WEBSITE
      ========================= */}
      <Route
        path="/"
        element={<App />}
      />

      {/* =========================
          MEMBERSHIP
      ========================= */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/member-portal"
        element={<MemberPortal />}
      />

      {/* =========================
          PROGRAMS
      ========================= */}
      <Route
        path="/programs"
        element={<Programs />}
      />

      {/* =========================
          GALLERY
      ========================= */}
      <Route
        path="/gallery"
        element={<GalleryPage />}
      />

      <Route
        path="/gallery/:id"
        element={<GalleryDetails />}
      />

      {/* =========================
          FOUNDERS
      ========================= */}
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
<Route path="/donate" element={<Donation />} />
      {/* =========================
          VOLUNTEER
      ========================= */}
      <Route
        path="/volunteer"
        element={<Volunteer />}
      />

    </Routes>
  );
};

export default AppRoutes;