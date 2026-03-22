import { BrowserRouter, Routes, Route } from "react-router-dom";

// auth + pages
import Login from "./pages/auth/Login";
import Home from "./pages/student/Home";

// feature-based
import QnA from "./features/qna/QnA";
import FAQ from "./features/faq/FAQ";
import Schedule from "./features/schedule/Schedule";

// admin
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";

// layout + protected
import ProtectedRoute from "./components/ui/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/schedule" element={<Schedule />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;