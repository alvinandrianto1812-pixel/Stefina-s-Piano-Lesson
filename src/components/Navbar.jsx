// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavAnimation from "./NavAnimation";
import { gsap } from "gsap";
import { useAuth } from "../contexts/AuthProvider";

const DROPDOWN_GROUPS = [
  {
    label: "About",
    items: [
      { to: "/AboutUs", label: "About Us", desc: "Our story & vision" },
      { to: "/OurTeachers", label: "Our Teachers", desc: "Meet the educators" },
      {
        to: "/OurServices",
        label: "Our Services",
        desc: "Lessons, freq & duration",
      },
      { to: "/OurPolicy", label: "Our Policy", desc: "Studio guidelines" },
    ],
  },
  {
    label: "Programs",
    items: [
      { to: "/Events", label: "Events", desc: "Concerts & workshops" },
      { to: "/Media", label: "Media", desc: "Photos & videos gallery" },
    ],
  },
];

const STANDALONE = [{ to: "/ContactUs", label: "Contact Us" }];

function DropdownMenu({ group }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const groupActive = group.items.some((i) => isActive(i.to));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`nav-link text-[13px] lg:text-[15px] flex items-center gap-1 ${groupActive ? "text-olive" : ""}`}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          fontFamily: "inherit",
          fontWeight: 600,
        }}
        data-active={groupActive}
      >
        {group.label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "12px",
            height: "12px",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.6,
          }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "220px",
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E8E0CC",
            boxShadow:
              "0 16px 48px rgba(39,41,37,0.14), 0 4px 12px rgba(39,41,37,0.08)",
            overflow: "hidden",
            zIndex: 100,
            animation: "dropIn 0.18s ease",
          }}
        >
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #272925, #50553C)",
            }}
          />
          <div style={{ padding: "8px" }}>
            {group.items.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    background: active ? "#F0EDE4" : "transparent",
                    transition: "background 0.15s",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "#F8F6ED";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#272925",
                      lineHeight: 1.3,
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#50553C",
                          marginRight: "7px",
                          verticalAlign: "middle",
                          marginBottom: "2px",
                        }}
                      />
                    )}
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94A3B8",
                      marginTop: "2px",
                    }}
                  >
                    {item.desc}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <style>{`@keyframes dropIn { from{opacity:0;transform:translateX(-50%) translateY(-6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();
  const isAdmin = role === "admin" || role === "owner";
  const isOwner = role === "owner";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(null);

  // GSAP animation refs for mobile menu
  const mobileMenuRef = useRef(null);
  const mobileMenuTlRef = useRef(null);
  const hamburgerLineTopRef = useRef(null);
  const hamburgerLineBotRef = useRef(null);
  const mobileNavItemsRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) closeMenu();
    setMobileOpen(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Build GSAP timeline for mobile menu
  const buildMobileTl = () => {
    const panel = mobileMenuRef.current;
    if (!panel) return null;

    const items = mobileNavItemsRef.current.filter(Boolean);

    // Measure natural height first so reverse works correctly
    gsap.set(panel, { height: "auto", display: "block", overflow: "hidden" });
    const naturalHeight = panel.scrollHeight;
    gsap.set(panel, { height: 0 });
    gsap.set(items, { y: 24, opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({ paused: true });

    // 1. Expand panel height
    tl.to(panel, {
      height: naturalHeight,
      duration: 0.42,
      ease: "power3.out",
    });

    // 2. Stagger items in with bounce
    tl.to(
      items,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.36,
        ease: "back.out(1.7)",
        stagger: 0.055,
      },
      "-=0.18",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const panel = mobileMenuRef.current;
    if (!panel) return;
    gsap.set(panel, { height: 0, overflow: "hidden", display: "none" });
  }, []);

  const openMenu = () => {
    const panel = mobileMenuRef.current;
    if (!panel) return;

    gsap.set(panel, { display: "block" });
    const tl = buildMobileTl();
    mobileMenuTlRef.current = tl;
    tl?.play();

    // Animate hamburger lines → X with back ease
    gsap.to(hamburgerLineTopRef.current, {
      y: 5,
      rotate: 45,
      duration: 0.3,
      ease: "back.out(1.4)",
    });
    gsap.to(hamburgerLineBotRef.current, {
      y: -5,
      rotate: -45,
      duration: 0.3,
      ease: "back.out(1.4)",
    });

    setMenuOpen(true);
  };

  const closeMenu = () => {
    const tl = mobileMenuTlRef.current;
    const panel = mobileMenuRef.current;

    // Animate X → hamburger lines
    gsap.to(hamburgerLineTopRef.current, {
      y: 0,
      rotate: 0,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(hamburgerLineBotRef.current, {
      y: 0,
      rotate: 0,
      duration: 0.25,
      ease: "power2.out",
    });

    if (tl) {
      tl.eventCallback("onReverseComplete", () => {
        if (panel) gsap.set(panel, { display: "none" });
        setMenuOpen(false);
      });
      tl.reverse();
    } else {
      if (panel) gsap.set(panel, { display: "none", height: 0 });
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    if (menuOpen) closeMenu();
    else openMenu();
  };

  const setMobileItemRef = (i) => (el) => {
    mobileNavItemsRef.current[i] = el;
  };

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => navigate("/logout");
  const isHome = location.pathname === "/";
  const isRegistrationActive =
    isActive("/OurPolicy") || isActive("/Questionnaire");

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all border-b backdrop-blur-md brand-nav ${isHome && !scrolled ? "" : "brand-nav--solid"}`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-3 md:px-4 h-30 flex items-center justify-between">
          {/* Logo */}
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
            <div className="hidden md:block opacity-70">
              <NavAnimation className="w-[140px]" />
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`nav-link text-[13px] lg:text-[15px] ${isActive("/") ? "text-olive" : ""}`}
              data-active={isActive("/")}
            >
              Home
            </Link>

            {DROPDOWN_GROUPS.map((group) => (
              <DropdownMenu key={group.label} group={group} />
            ))}

            {STANDALONE.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link text-[13px] lg:text-[15px] ${isActive(item.to) ? "text-olive" : ""}`}
                data-active={isActive(item.to)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/OurPolicy"
              style={{
                marginLeft: "8px",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                border: "1.5px solid #272925",
                letterSpacing: "0.01em",
                transition: "all 0.2s ease",
                ...(isRegistrationActive
                  ? { background: "#272925", color: "#F8F6ED" }
                  : { background: "#F8F6ED", color: "#272925" }),
              }}
              onMouseEnter={(e) => {
                if (!isRegistrationActive) {
                  e.currentTarget.style.background = "#272925";
                  e.currentTarget.style.color = "#F8F6ED";
                }
              }}
              onMouseLeave={(e) => {
                if (!isRegistrationActive) {
                  e.currentTarget.style.background = "#F8F6ED";
                  e.currentTarget.style.color = "#272925";
                }
              }}
            >
              Registration
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`group relative px-3 py-2 text-[13px] lg:text-[15px] transition-colors ${isActive("/admin") ? "text-olive" : "text-slate-700 hover:text-olive"}`}
              >
                Admin
                <span
                  className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform ${isActive("/admin") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  style={{ background: "#272925" }}
                />
              </Link>
            )}

            {isOwner && (
              <Link
                to="/owner"
                className={`group relative px-3 py-2 text-[13px] lg:text-[15px] transition-colors ${isActive("/owner") ? "text-[#C0503D]" : "text-slate-700 hover:text-[#C0503D]"}`}
              >
                Owner
                <span
                  className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform ${isActive("/owner") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  style={{ background: "#C0503D" }}
                />
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "4px",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "transparent",
                  color: "#272925",
                  border: "1.5px solid rgba(39,41,37,0.35)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#272925";
                  e.currentTarget.style.background = "rgba(39,41,37,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(39,41,37,0.35)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                style={{
                  marginLeft: "4px",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "#272925",
                  color: "#F8F6ED",
                  textDecoration: "none",
                  border: "1.5px solid #272925",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#50553C";
                  e.currentTarget.style.borderColor = "#50553C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#272925";
                  e.currentTarget.style.borderColor = "#272925";
                }}
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Hamburger — GSAP animated */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-olive"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ overflow: "visible" }}
            >
              <line
                ref={hamburgerLineTopRef}
                x1="3"
                y1="7"
                x2="21"
                y2="7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ transformOrigin: "12px 7px" }}
              />
              <line
                ref={hamburgerLineBotRef}
                x1="3"
                y1="17"
                x2="21"
                y2="17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ transformOrigin: "12px 17px" }}
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu — always rendered, shown/hidden via GSAP */}
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white/97 backdrop-blur-sm px-4 pb-5 pt-2 space-y-1 border-t border-[#E8E0CC]"
          style={{ display: "none", overflow: "hidden" }}
        >
          <Link
            ref={setMobileItemRef(0)}
            to="/"
            onClick={() => closeMenu()}
            className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive("/") ? "bg-[#ECEAE2] font-semibold" : "text-slate-700 hover:bg-[#F8F6ED]"}`}
            style={isActive("/") ? { color: "#272925" } : {}}
          >
            Home
          </Link>

          {DROPDOWN_GROUPS.map((group, gi) => (
            <div key={group.label} ref={setMobileItemRef(gi + 1)}>
              <button
                onClick={() => setMobileOpen(mobileOpen === gi ? null : gi)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#F8F6ED] transition"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span>{group.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    width: "14px",
                    height: "14px",
                    transition: "transform 0.2s",
                    transform:
                      mobileOpen === gi ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
              {mobileOpen === gi && (
                <div style={{ paddingLeft: "12px", paddingBottom: "4px" }}>
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => closeMenu()}
                      className={`flex flex-col rounded-xl px-4 py-2.5 text-sm transition ${isActive(item.to) ? "bg-[#ECEAE2]" : "text-slate-700 hover:bg-[#F8F6ED]"}`}
                      style={isActive(item.to) ? { color: "#272925" } : {}}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {STANDALONE.map((item, si) => (
            <Link
              key={item.to}
              ref={setMobileItemRef(DROPDOWN_GROUPS.length + 1 + si)}
              to={item.to}
              onClick={() => closeMenu()}
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive(item.to) ? "bg-[#ECEAE2] font-semibold" : "text-slate-700 hover:bg-[#F8F6ED]"}`}
              style={isActive(item.to) ? { color: "#272925" } : {}}
            >
              {item.label}
            </Link>
          ))}

          <Link
            ref={setMobileItemRef(DROPDOWN_GROUPS.length + 2)}
            to="/OurPolicy"
            onClick={() => closeMenu()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              marginTop: "8px",
              border: "1.5px solid #272925",
              transition: "all 0.2s",
              ...(isRegistrationActive
                ? { background: "#272925", color: "#F8F6ED" }
                : { background: "#F8F6ED", color: "#272925" }),
            }}
          >
            Registration
          </Link>

          {isAdmin && (
            <Link
              ref={setMobileItemRef(DROPDOWN_GROUPS.length + 3)}
              to="/admin"
              onClick={() => closeMenu()}
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive("/admin") ? "bg-[#ECEAE2]" : "text-slate-700 hover:bg-[#F8F6ED]"}`}
              style={isActive("/admin") ? { color: "#272925" } : {}}
            >
              Admin
            </Link>
          )}

          {isOwner && (
            <Link
              ref={setMobileItemRef(DROPDOWN_GROUPS.length + 4)}
              to="/owner"
              onClick={() => closeMenu()}
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${isActive("/owner") ? "bg-[#FCECE9]" : "text-slate-700 hover:bg-[#F8F6ED]"}`}
              style={isActive("/owner") ? { color: "#C0503D" } : {}}
            >
              Owner
            </Link>
          )}

          <div
            ref={setMobileItemRef(DROPDOWN_GROUPS.length + 5)}
            className="pt-2"
          >
            {user ? (
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/logout");
                }}
                style={{
                  width: "100%",
                  borderRadius: "999px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "transparent",
                  color: "#272925",
                  border: "1.5px solid rgba(39,41,37,0.35)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => closeMenu()}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "999px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "#272925",
                  color: "#F8F6ED",
                  textDecoration: "none",
                }}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none h-10 md:h-12 lg:h-14"
      />
    </>
  );
}
