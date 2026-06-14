import { Routes, Route, Navigate } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/user/LandingPage";
import Auth from "./pages/Auth";
import Questionnaire from "./pages/user/Questionnaire";
import Admin from "./pages/admin/Admin";
import Logout from "./pages/Logout";
import Events from "./pages/user/Events";
import OurTeachers from "./pages/user/OurTeachers";
import AboutUs from "./pages/user/AboutUs";
import ContactUs from "./pages/user/ContactUs";
import OurPolicy from "./pages/user/OurPolicy";
import OurServices from "./pages/user/OurServices";
import Media from "./pages/user/Media";
import Programs from "./pages/user/Programs";
import PendingApproval from "./pages/user/PendingApproval";
import EventRSVP from "./pages/user/EventRSVP";
import StudentPortal from "./pages/student/StudentPortal";
import TeacherPortal from "./pages/teacher/TeacherPortal";
import OwnerReport from "./pages/owner/OwnerReport";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import OwnerRoute from "./components/OwnerRoute";
import StudentRoute from "./components/StudentRoute";
import TeacherRoute from "./components/TeacherRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id/register" element={<EventRSVP />} />
          <Route path="/media" element={<Media />} />
          <Route path="/our-teachers" element={<OurTeachers />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/our-policy" element={<OurPolicy />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/programs" element={<Programs />} />

          {/* ── Pending approval ── */}
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* ── Protected: semua user login ── */}
          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            }
          />

          {/* ── Student portal ── */}
          <Route
            path="/student"
            element={
              <StudentRoute>
                <StudentPortal />
              </StudentRoute>
            }
          />

          {/* ── Teacher portal ── */}
          <Route
            path="/teacher"
            element={
              <TeacherRoute>
                <TeacherPortal />
              </TeacherRoute>
            }
          />

          {/* ── Admin ── */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* ── Owner ── */}
          <Route
            path="/owner"
            element={
              <OwnerRoute>
                <OwnerReport />
              </OwnerRoute>
            }
          />

          {/* ── Utility ── */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}