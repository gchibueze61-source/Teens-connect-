import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminGuard from "./components/auth/AdminGuard";

const AdminLogin = lazy(() => import("./pages/Login/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/Login/AdminResetPassword"));
const AdminDashboard = lazy(() => import("./pages/Dashboard/AdminDashboard"));
const Events = lazy(() => import("./pages/Events/Events"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const Programs = lazy(() => import("./pages/Impact/Programs/Programs"));
const Gallery = lazy(() => import("./pages/Impact/Gallery/Gallery"));
const Membership = lazy(() => import("./pages/Membership/Membership"));
const TeenRecords = lazy(() => import("./pages/Admin/TeenRecords/TeenRecords"));
const TeamMembers = lazy(() => import("./pages/TeamMembers/TeamMembers"));
const BoardMembers = lazy(() => import("./pages/BoardMembers/BoardMembers"));
const TeenExecutiveCommittee = lazy(
  () => import("./pages/TeenExecutiveCommittee/TeenExecutiveCommittee")
);
const Impact = lazy(() => import("./pages/Impact/Impact"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <main
            role="status"
            aria-live="polite"
            style={{
              minHeight: "50vh",
              display: "grid",
              placeItems: "center",
              padding: "2rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Loading...
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/reset-password" element={<AdminResetPassword />} />

          <Route element={<AdminGuard />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/impact" element={<Impact />} />
            <Route path="/admin/programs" element={<Programs />} />
            <Route path="/admin/gallery" element={<Gallery />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/blog" element={<Blog />} />
            <Route path="/admin/membership" element={<Membership />} />
            <Route path="/admin/teen-records" element={<TeenRecords />} />
            <Route path="/admin/team-members" element={<TeamMembers />} />
            <Route path="/admin/board-members" element={<BoardMembers />} />
            <Route
              path="/admin/teen-executive-committee"
              element={<TeenExecutiveCommittee />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
