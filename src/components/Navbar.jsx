// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import NavAnimation from "./NavAnimation";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false); // keep

  // solidkan navbar saat discroll dikit
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .maybeSingle();
        setIsAdmin(data?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_e, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u?.email) {
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("email", u.email)
            .maybeSingle();
          setIsAdmin(data?.role === "admin");
        } else {
          setIsAdmin(false);
        }
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // rute aktif untuk underline
  const isActive = (path) => location.pathname === path;

  // tetap arahkan ke /logout
  const handleLogout = async () => {
    navigate("/logout");
  };

  const isHome = location.pathname === "/";

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all border-b backdrop-blur-md brand-nav ${
          isHome && !scrolled ? "" : "brand-nav--solid"
        }`}
      >
        {/* ============== CONTAINER UTAMA ============== */}
        <div className="w-full max-w-[1400px] mx-auto px-3 md:px-4 h-30 flex items-center justify-between">
          {/* KIRI: logo + animasi kecil */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center shrink-0"
              aria-label="GuruNada Home"
            >
              <img
                src="/brand/gurunada_final_charcoal-03.png"
                srcSet="/brand/gurunada_final_charcoal-03.png 1x, /brand/gurunada_final_charcoal-03.png 2x"
                alt="gurunada"
                className="h-14 md:h-16 lg:h-[100px] w-auto select-none -ml-1"
                draggable={false}
              />
            </Link>

            {/* animasi tipis — tampil md+ */}
            <div className="hidden md:block opacity-70">
              <NavAnimation className="w-[140px]" />
            </div>
          </div>

          {/* TENGAH/KANAN: menu desktop */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/AboutUs", label: "About Us" },
              { to: "/OurTeachers", label: "Our Teachers" },
              { to: "/Questionnaire", label: "Registration" },
              { to: "/Events", label: "Event" },
              { to: "/ContactUs", label: "Contact Us" },
            ].map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${active ? "text-olive" : ""}`}
                  data-active={active}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className={`group relative px-3 py-2 text-[15px] transition-colors ${
                  isActive("/admin")
                    ? "text-brand-gold"
                    : "text-slate-700 hover:text-brand-gold"
                }`}
              >
                Admin
                <span
                  className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-gold transition-transform ${
                    isActive("/admin")
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-full border border-brand-gold text-brand-dark/90 hover:bg-brand-gold hover:text-white transition shadow-luxe"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-4 py-2 rounded-full bg-brand-gold text-white hover:opacity-90 shadow-luxe"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* UJUNG KANAN: toggle mobile */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-brand-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* ============ /CONTAINER UTAMA ============ */}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xs px-4 pb-4 pt-2 space-y-2 border-t border-[#E8E0CC]">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              Home
            </Link>

            <Link
              to="/Events"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/Events")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              Events
            </Link>

            <Link
              to="/Questionnaire"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/Questionnaire")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              Registration
            </Link>

            <Link
              to="/OurTeachers"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/OurTeachers")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              Our Teachers
            </Link>

            <Link
              to="/AboutUs"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/AboutUs")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              About Us
            </Link>

            <Link
              to="/ContactUs"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 ${
                isActive("/ContactUs")
                  ? "text-brand-gold"
                  : "text-slate-700 hover:bg-[#F8F6ED]"
              }`}
            >
              Contact Us
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 ${
                  isActive("/admin")
                    ? "text-brand-gold"
                    : "text-slate-700 hover:bg-[#F8F6ED]"
                }`}
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/logout");
                }}
                className="mt-1 w-full rounded-full border border-brand-gold px-4 py-2 text-brand-dark/90 hover:bg-brand-gold hover:text-white transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block w-full text-center rounded-full bg-brand-gold px-4 py-2 text-white hover:opacity-90 shadow-luxe"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Spacer agar konten tidak mepet dengan navbar yang fixed */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none h-10 md:h-12 lg:h-14"
      />
    </>
  );
}
