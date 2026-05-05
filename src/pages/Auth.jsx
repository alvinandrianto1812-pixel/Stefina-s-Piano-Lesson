import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import toast from "react-hot-toast";

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
    try {
      const saved = localStorage.getItem("rememberMe");
      if (saved === null) {
        localStorage.setItem("rememberMe", "true");
        return true;
      }
      return JSON.parse(saved);
    } catch (e) {
      // Ignored: Storage blocked
      return true;
    }
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
    try {
      localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
    } catch (e) {
      // Ignored: Storage blocked
    }
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
          toast.success(
            "Account created! Check your verification email, then log in.",
          );
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
            toast.error(
              "Your email has not been verified. Check your inbox/spam folder, then click the verification link.",
            );
          } else {
            toast.error(error.message);
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
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };

  const handleResend = async () => {
    if (!form.email) return toast.error("Fill in the email first.");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });
    if (error) return toast.error(error.message);
    toast.success("Verification email resent. Check your inbox/spam folder.");
  };

  const handleForgot = async () => {
    if (!form.email) return toast.error("Fill in the registered email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth?reset=1`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link has been sent to your email.");
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

          {/* Divider + Google */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

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
