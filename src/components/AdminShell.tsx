import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/use-me";

export function AdminShell({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const { data: results } = useQuery({
    queryKey: ["search", q],
    enabled: !!me?.isAdmin && q.trim().length > 0,
    queryFn: async () => (await supabase.from("profiles").select("id, username").ilike("username", `%${q.trim()}%`).limit(8)).data ?? [],
  });
  const name = me?.profile?.username ?? "";

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-search">
          <i className="material-icons">search</i>
          <input placeholder="Kërko Përdorues/Menaxher" value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ("")}><i className="material-icons">close</i></button>}
          {results && results.length > 0 && (
            <div className="adm-results">
              {results.map((r) => (
                <Link key={r.id} to="/dashboard" search={{ u: r.id }} onClick={() => setQ("")}>{r.username}</Link>
              ))}
            </div>
          )}
        </div>
        <nav className="adm-nav">
          <Link to="/dashboard" search={{ u: undefined }}>Balancë &amp; Overdraft</Link>
          <Link to="/dashboard" search={{ u: undefined }}>Biletat</Link>
          <Link to="/dashboard" search={{ u: undefined }}>Llogaria</Link>
          <i className="material-icons">notifications</i>
          <i className="material-icons">email</i>
          <span>{name}</span>
          <div className="adm-menu-wrap">
            <button onClick={() => setMenu((m) => !m)} aria-label="Settings"><i className="material-icons">settings</i></button>
            {menu && <div className="adm-menu"><button onClick={signOut}>Dil (Logout)</button></div>}
          </div>
        </nav>
      </header>
      <aside className="adm-side">
        <Link to="/dashboard" search={{ u: undefined }} className="adm-avatar">{name.charAt(0).toUpperCase() || "A"}</Link>
        {me?.isAdmin && (
          <>
            <Link to="/users" title="Krijo përdorues" className="adm-side-btn"><i className="material-icons">group_add</i></Link>
            <Link to="/users" title="Përdoruesit" className="adm-side-btn"><i className="material-icons">person_add</i></Link>
          </>
        )}
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
