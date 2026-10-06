import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminGuard from "./components/auth/AdminGuard";
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Programs from "./pages/Programs/Programs";
import Events from "./pages/Events/Events";
import Blog from "./pages/Blog/Blog";
import Gallery from "./pages/Gallery/Gallery";
import Membership from "./pages/Membership/Membership";
import AdminTeenRecords from "./pages/AdminTeenRecords/AdminTeenRecords";
import TeenRecords from "./pages/Admin/TeenRecords/TeenRecords";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminGuard />}>
          <Route path="/admin/membership" element={<Membership />} />
          <Route path="/admin/teen-records" element={<TeenRecords />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/programs" element={<Programs />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/blog" element={<Blog />} />
          <Route path="/admin/gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
