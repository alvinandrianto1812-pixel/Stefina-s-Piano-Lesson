import React from "react";
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

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import OwnerRoute from "./components/OwnerRoute";
import OwnerReport from "./pages/owner/OwnerReport";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

          {/* Redirect rute lama supaya tidak 404 */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />

          <Route path="/events" element={<Events />} />
          <Route path="/media" element={<Media />} />
          <Route path="/our-teachers" element={<OurTeachers />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Studio Policy — wajib dibaca sebelum registrasi */}
          <Route path="/our-policy" element={<OurPolicy />} />
          <Route path="/our-services" element={<OurServices />} />

          {/* Questionnaire: user harus lewat OurPolicy dulu (logic ada di OurPolicy.jsx) */}
          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* ---- Rute khusus Owner (super-admin) ---- */}
          <Route
            path="/owner"
            element={
              <OwnerRoute>
                <OwnerReport />
              </OwnerRoute>
            }
          />

          {/* Rute logout */}
          <Route path="/logout" element={<Logout />} />
          {/* Auth callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
