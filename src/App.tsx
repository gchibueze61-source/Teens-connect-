
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminGuard from "./components/auth/AdminGuard";
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Events from "./pages/Events/Events";
import Blog from "./pages/Blog/Blog";
import Programs from "./pages/Impact/Programs/Programs";
import Gallery from "./pages/Impact/Gallery/Gallery";
import Membership from "./pages/Membership/Membership";
import TeenRecords from "./pages/Admin/TeenRecords/TeenRecords";
import TeamMembers from "./pages/TeamMembers/TeamMembers";
import BoardMembers from "./pages/BoardMembers/BoardMembers";
import TeenExecutiveCommittee from "./pages/TeenExecutiveCommittee/TeenExecutiveCommittee";
import Impact from "./pages/Impact/Impact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/login" replace />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route element={<AdminGuard />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/impact"
            element={<Impact />}
          />

          <Route
            path="/admin/programs"
            element={<Programs />}
          />

          <Route
            path="/admin/gallery"
            element={<Gallery />}
          />

          <Route
            path="/admin/events"
            element={<Events />}
          />

          <Route
            path="/admin/blog"
            element={<Blog />}
          />

          <Route
            path="/admin/membership"
            element={<Membership />}
          />

          <Route
            path="/admin/teen-records"
            element={<TeenRecords />}
          />

          <Route
            path="/admin/team-members"
            element={<TeamMembers />}
          />

          <Route
            path="/admin/board-members"
            element={<BoardMembers />}
          />

          <Route
            path="/admin/teen-executive-committee"
            element={<TeenExecutiveCommittee />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
