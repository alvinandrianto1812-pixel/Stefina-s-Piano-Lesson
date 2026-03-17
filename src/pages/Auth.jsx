// src/pages/Auth.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

/**
 * Pastikan baris di public.users ada & sinkron dengan auth.uid()
 * - Jika belum ada: insert (id, email, name)
 * - Jika sudah ada tapi id beda (warisan data lama): update id
 */
async function ensureUserRow(sb, { id, email }, name) {
  const payload = { id, email };
  if (name && name.trim()) payload.name = name.trim();

  const { data, error, status } = await sb
    .from("users")
    .upsert(payload, { onConflict: "email" })
    .select("id, email, name, role")
    .single();

  if (error) {
    console.error("upsert users error:", { error, status, payload });
  } else {
    console.log("users upsert OK:", data);
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem("rememberMe");
    if (saved === null) {
      localStorage.setItem("rememberMe", "true");
      return true;
    }
    return JSON.parse(saved);
  });
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notice, setNotice] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Jika sudah login, lempar ke beranda
  useEffect(() => {
    // Jika provider bilang ada sesi, langsung arahkan ke beranda
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  // Setelah klik link verifikasi -> tampilkan notifikasi
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("confirmed") === "1") {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate("/");
        else setNotice("Your email has been verified. Please log in.");
      });
    }
  }, [location.search, navigate]);

  // untuk remember me
  useEffect(() => {
    localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
  }, [rememberMe]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // SIGN UP - SUPABASE LOGIC
      if (isSignUp) {
        // SIGN UP + kirim email verifikasi (redirect balik ke /auth?confirmed=1)
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { name: form.name || "" }, // simpan nama ke metadata auth
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        // ⚠️ Hanya upsert jika user langsung punya session (confirm-email OFF).
        if (data?.session && data?.user) {
          await ensureUserRow(supabase, data.user, form.name);
          navigate("/");
        } else {
          setEmailSent(true);
          alert("Account created! Check your verification email, then log in.");
        }
        return; // penting: stop di sini
      } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) {
          if (/email not confirmed/i.test(error.message)) {
            alert(
              "Your email has not been verified. Check your inbox/spam folder, then click the verification link."
            );
          } else {
            alert(error.message);
          }
          return;
        }

        // Pastikan token sudah siap sebelum upsert
        await supabase.auth.getSession();

        // Setelah login, pastikan row users tersinkron
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const nameFromMeta = user?.user_metadata?.name || undefined;
        if (user) await ensureUserRow(supabase, user, nameFromMeta);

        navigate("/");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) return alert("Fill in the email first.");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });
    if (error) return alert(error.message);
    alert("Verification email resent. Check your inbox/spam folder.");
  };

  const handleForgot = async () => {
    if (!form.email) return alert("Fill in the registered email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth?reset=1`,
    });
    if (error) return alert(error.message);
    alert("Password reset link has been sent to your email.");
  };

  return (
    <div
      className="brand-page min-h-[calc(100vh-4rem)] flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(1200px 400px at 50% -10%, rgba(209,167,153,.22), transparent 60%), var(--cream)",
      }}
    >
      {/* ====== CARD ====== */}
      <div className="w-full max-w-md rounded-2xl border border-[rgba(232,224,204,.9)] bg-white shadow-[0_12px_24px_rgba(16,24,40,.08)] overflow-hidden transition-transform duration-200 hover:-translate-y-[1px]">
        {/* ====== HEADER: gradient + wave + BRAND IMAGE ====== */}
        <div className="relative h-28 md:h-32 text-white flex items-center justify-center bg-gradient-to-tr from-[#272925] via-[#50553C] to-[#D1A799]">
          <img
            src="/brand/gurunada_final_light-03.png"
            alt="GuruNada"
            className="h-8 md:h-10 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.35)] select-none"
            draggable={false}
          />
          <svg
            className="absolute -bottom-[1px] left-0 w-full"
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff"
              d="M0,64L60,58.7C120,53,240,43,360,42.7C480,43,600,53,720,64C840,75,960,85,1080,80C1200,75,1320,53,1380,42.7L1440,32L1440,90L1380,90C1320,90,1200,90,1080,90C960,90,840,90,720,90C600,90,480,90,360,90C240,90,120,90,60,90L0,90Z"
            />
          </svg>
        </div>

        {/* Body */}
        <div className="p-6">
          {notice && (
            <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
              {notice}
            </div>
          )}
          <h1 className="text-2xl mb-1">
            {isSignUp ? "Create Account" : "Welcome back!"}
          </h1>
          <p className="text-slate-600 mb-6">
            {isSignUp
              ? "Sign up to start booking classes."
              : "Log in to manage your schedule & bookings."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignUp && (
              <label className="block">
                <span className="text-sm text-slate-700">Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={onChange}
                  className="field mt-1"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={onChange}
                required
                className="field mt-1"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Password</span>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                  className="field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm px-2"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-700 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-olive hover:text-brick transition-colors"
                >
                  Forget Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          {/* Resend hint setelah sign up */}
          {isSignUp && emailSent && (
            <div className="mt-3 text-sm text-slate-700">
              Not receiving verification email?{" "}
              <button
                onClick={handleResend}
                className="text-olive hover:text-brick underline"
              >
                Resend
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setNotice("");
              }}
              className="text-olive hover:text-brick underline transition-colors font-[1000]"
            >
              {isSignUp ? "Login here" : "Sign up here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
