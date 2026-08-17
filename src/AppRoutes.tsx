import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<App />} />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
    </Routes>
  );
};

export default AppRoutes;