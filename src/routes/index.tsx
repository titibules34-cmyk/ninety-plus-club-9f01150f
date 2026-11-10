import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usernameToEmail } from "@/lib/username";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoginApp" },
      { name: "description", content: "Welcome | Please login" },
      { property: "og:title", content: "LoginApp" },
      { property: "og:description", content: "Welcome | Please login" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<"" | "user" | "pass" | "login">("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/dashboard", search: { u: undefined } }); });
  }, [navigate]);
  const submit = async () => {
    if (!u) return setErr("user");
    if (!p) return setErr("pass");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(u), password: p });
    setBusy(false);
    if (error) return setErr("login");
    setErr("");
    navigate({ to: "/dashboard", search: { u: undefined } });
  };
  return (
    <div className="login-screen">
      <div className="login-box">
        <span className="login-title">Welcome &nbsp;| &nbsp;Please login</span>
        <div className="login-input">
          <input className={u ? "has-val" : ""} placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <i className="material-icons">account_circle</i>
        </div>
        <div className="login-error">{err === "user" && <span>*Enter your username</span>}</div>
        <div className="login-input">
          <input type="password" className={p ? "has-val" : ""} placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <i className="material-icons">lock_outline</i>
        </div>
        <div className="login-error">
          {err === "pass" && <span>*Enter your password</span>}
          {err === "login" && <span>*Username or password incorrect</span>}
        </div>
        <button className="login-btn" disabled={busy} onClick={submit}>Login</button>
      </div>
    </div>
  );
}
