import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import MemberPortal from "./pages/MemberPortal/MemberPortal";

import Programs from "./components/sections/Programs";

import GalleryPage from "./pages/Gallery/GalleryPage";
import GalleryDetails from "./pages/Gallery/GalleryDetails";

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* =========================
          PUBLIC HOMEPAGE
      ========================= */}
      <Route
        path="/"
        element={<App />}
      />

      {/* =========================
          USER AUTHENTICATION
      ========================= */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          MEMBER PORTAL
      ========================= */}
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

    </Routes>
  );
};

export default AppRoutes;