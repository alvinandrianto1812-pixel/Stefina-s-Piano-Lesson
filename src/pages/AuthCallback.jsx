import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const nav = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    const handleSession = async (session) => {
      if (handled.current) return;
      handled.current = true;

      if (!session) {
        nav("/auth?confirmed=1", { replace: true });
        return;
      }

      const user = session.user;
      const hash = window.location.hash;
      const isEmailVerification =
        hash.includes("type=signup") || hash.includes("type=email");
      const isOAuth =
        !isEmailVerification &&
        (user.app_metadata?.providers ?? []).includes("google");

      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        });
      }

      if (isOAuth) {
        nav("/", { replace: true });
      } else {
        await supabase.auth.signOut();
        nav("/auth?confirmed=1", { replace: true });
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") handleSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [nav]);

  return <p>Memverifikasi akun…</p>;
}
