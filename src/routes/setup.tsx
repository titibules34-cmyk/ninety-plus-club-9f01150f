import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { setupFirstAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Setup — LoginApp" }, { name: "robots", content: "noindex" }] }),
  component: Setup,
});

function Setup() {
  const run = useServerFn(setupFirstAdmin);
  const navigate = useNavigate();
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  async function submit() {
    setErr("");
    try {
      const r = await run({ data: { username: u, password: p } });
      if (r.ok) navigate({ to: "/" }); else setErr(r.error);
    } catch { setErr("Username 3-32 chars, password at least 6"); }
  }
  return (
    <div className="login-screen">
      <div className="login-box">
        <span className="login-title">Create admin account</span>
        <div className="login-input"><input placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} /><i className="material-icons">account_circle</i></div>
        <div className="login-error" />
        <div className="login-input"><input type="password" placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} /><i className="material-icons">lock_outline</i></div>
        <div className="login-error">{err && <span>*{err}</span>}</div>
        <button className="login-btn" onClick={submit}>Create</button>
      </div>
    </div>
  );
}
