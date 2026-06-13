import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Tidak ada session — kemungkinan email verification
        nav("/auth?confirmed=1", { replace: true });
        return;
      }

      const user = session.user;
      const isOAuth = user.app_metadata?.provider !== "email";

      // Upsert user row
      await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        },
        { onConflict: "id" },
      );

      if (isOAuth) {
        // Google OAuth — langsung ke landing page
        nav("/", { replace: true });
      } else {
        // Email verification — logout dulu, minta login manual
        await supabase.auth.signOut();
        nav("/auth?confirmed=1", { replace: true });
      }
    })();
  }, [nav]);

  return <p>Memverifikasi akun…</p>;
}
