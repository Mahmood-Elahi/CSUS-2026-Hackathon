// frontend/components/PathwayUofCMock.tsx
"use client";


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import ProfileForm from "./ProfileForm";
import{
  SKILLS,
  SKILL_ALIASES,
  TYPES,
  ENGINEERING_MAJORS,
  SCIENCE_MAJORS,
  YEARS,
  OPPORTUNITIES,
} from "./PathwayData";

const ACCENT = "#C8102E";





// ------------------ TYPES ------------------
type PlanItem = { id: string; title: string; why: string };
type ProfileRow = {
  id: string;
  full_name: string | null;
  faculty: string | null;
  major: string | null;
  year: string | null;
  target_skills: any;
  plan_items: any;
  updated_at: string | null;
};


// ------------------ UI ------------------
function Pill({ children, accent = false }: any) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        border: accent ? `1px solid rgba(200,16,46,0.55)` : "1px solid rgba(255,255,255,0.14)",
        background: accent ? "rgba(200,16,46,0.10)" : "rgba(255,255,255,0.06)",
        color: accent ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}


function Btn({ children, onClick, variant = "primary", disabled = false }: any) {
  const isPrimary = variant === "primary";
  const bg = isPrimary ? `linear-gradient(90deg, ${ACCENT}, rgba(200,16,46,0.80))` : "rgba(255,255,255,0.06)";
  const border = isPrimary ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.14)";
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "10px 14px",
        borderRadius: 14,
        border,
        background: bg,
        color: "white",
        fontWeight: 900,
        letterSpacing: "-0.01em",
        boxShadow: isPrimary ? "0 10px 26px rgba(200,16,46,0.22)" : "none",
        opacity: disabled ? 0.6 : 1,
        position: "relative",
        zIndex: 5,
        pointerEvents: "auto",
      }}
    >
      {children}
    </button>
  );
}


function Card({ children, style }: any) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: 14,
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}


function Row({ o, added, onAdd, onRemove }: any) {
  const matched = Array.isArray(o.matched) ? o.matched : [];
  const tags = Array.isArray(o.tags) ? o.tags : [];

  // Show matched skills first, then the remaining tags (no duplicates)
  const matchedSet = new Set(matched);
  const remaining = tags.filter((t: string) => !matchedSet.has(t));
  const allSkillsOrdered = [...matched, ...remaining];

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 14,
        display: "grid",
        gap: 12,
        background: "rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontWeight: 950, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          {o.title}
        </div>
        <div style={{ flexShrink: 0 }}>
          {added ? (
            <Btn variant="secondary" onClick={onRemove}>
              Remove
            </Btn>
          ) : (
            <Btn variant="primary" onClick={onAdd}>
              Add
            </Btn>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Pill accent>{o.type}</Pill>
        <Pill>Effort: {o.effort}</Pill>
        <Pill>Deadline: {o.deadline}</Pill>

        {/* Keep a quick “at a glance” */}
        {matched.slice(0, 3).map((m: string) => (
          <Pill key={m} accent>
            {m}
          </Pill>
        ))}

        {/* If there are more skills, show count */}
        {allSkillsOrdered.length > 3 ? <Pill>+{allSkillsOrdered.length - 3} skills</Pill> : null}
      </div>

      {/* Dropdown: show ALL skills/tags */}
      <details
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14,
          padding: 10,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            listStyle: "none",
            fontWeight: 900,
            color: "rgba(255,255,255,0.85)",
            outline: "none",
          }}
        >
          View all skills
        </summary>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {allSkillsOrdered.map((t: string) => (
            <Pill key={t} accent={matchedSet.has(t)}>
              {t}
            </Pill>
          ))}
        </div>

        {matched.length ? (
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
            Matched: {matched.length} / {tags.length}
          </div>
        ) : (
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
            No matched skills (based on your selected skills).
          </div>
        )}
      </details>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.35 }}>{o.why}</div>
    </div>
  );
}



function Chip({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 999,
        padding: "8px 12px",
        border: active ? `1px solid rgba(200,16,46,0.60)` : "1px solid rgba(255,255,255,0.14)",
        background: active ? "rgba(200,16,46,0.12)" : "rgba(255,255,255,0.06)",
        color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)",
        fontSize: 13,
        fontWeight: 900,
      }}
    >
      {label}
    </button>
  );
}


function Modal({ title, onClose, children }: any) {
  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(920px, 96vw)",
          background: "rgba(10,10,14,0.96)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 14,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ color: "white" }}>
            <div style={{ fontWeight: 950 }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Update your profile.</div>
          </div>
          <Btn variant="secondary" onClick={onClose}>
            Close
          </Btn>
        </div>
        <div style={{ padding: 14 }}>{children}</div>
      </div>
    </div>
  );
}


// ------------------ AUTH MODAL ------------------
function AuthModal({ open, onClose, signUp, signIn }: any) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);


  if (!open) return null;


  const submit = async () => {
    setBusy(true);
    setMsg(null);


    const fn = mode === "signup" ? signUp : signIn;
    const { error } = await fn(email.trim(), password);


    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }


    setBusy(false);
    onClose();
  };


  return (
    <Modal title={mode === "signup" ? "Create account" : "Sign in"} onClose={onClose}>
      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>Email</span>
          <input className="pw-select" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </label>


        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>Password</span>
          <input
            className="pw-select"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </label>


        {msg ? <div style={{ fontSize: 12, color: "#ffb4b4" }}>{msg}</div> : null}


        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 6 }}>
          <Btn variant="secondary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} disabled={busy}>
            {mode === "signup" ? "I already have an account" : "Create account instead"}
          </Btn>


          <Btn variant="primary" onClick={submit} disabled={busy}>
            {busy ? "Working..." : mode === "signup" ? "Sign up" : "Sign in"}
          </Btn>
        </div>


        {mode === "signup" ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
            Welcome to Pathway.
          </div>
        ) : null}
      </div>
    </Modal>
  );
}


// ------------------ MAIN ------------------
export default function PathwayUofCMock() {
  const [tab, setTab] = useState("home");
  const { session, loading, signUp, signIn, signOut } = useAuth();


  const [fullName, setFullName] = useState("");
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState("University of Calgary");
  const UNIVERSITIES = ["University of Calgary"];


  const [faculty, setFaculty] = useState("Schulich School of Engineering");
  const [major, setMajor] = useState(ENGINEERING_MAJORS[0]);
  const [year, setYear] = useState("3rd year");


  const [wantSkills, setWantSkills] = useState<string[]>(["Python", "Embedded Systems", "CAD"]);
  const [typeFilter, setTypeFilter] = useState(new Set(TYPES));


  // NEW: Explore filter tab (Types vs Skills)
  const [exploreFilterTab, setExploreFilterTab] = useState<"types" | "skills">("types");
  const [exploreSkillFilter, setExploreSkillFilter] = useState<Set<string>>(new Set());


  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);


  const [authOpen, setAuthOpen] = useState(false);


  const majorOptions = useMemo(() => (faculty === "Faculty of Science" ? SCIENCE_MAJORS : ENGINEERING_MAJORS), [faculty]);


  useEffect(() => {
    if (!majorOptions.includes(major)) setMajor(majorOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faculty]);


  // ---------- Load profile + plan from Supabase ----------
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setPlanItems([]);
        return;
      }


      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, faculty, major, year, target_skills, plan_items, updated_at")
        .eq("id", session.user.id)
        .maybeSingle<ProfileRow>();


      if (error) {
        console.error("Profile load error:", error);
        return;
      }


      if (!data) {
        const { error: upsertError } = await supabase.from("profiles").upsert({
          id: session.user.id,
          full_name: "",
          faculty: "Schulich School of Engineering",
          major: ENGINEERING_MAJORS[0],
          year: "3rd year",
          target_skills: ["Python", "Embedded Systems", "CAD"],
          plan_items: [],
          updated_at: new Date().toISOString(),
        });


        if (upsertError) console.error("Profile create error:", upsertError);
        return;
      }


      setFullName(data.full_name ?? "");
      setFaculty(data.faculty ?? "Schulich School of Engineering");
      setMajor(data.major ?? ENGINEERING_MAJORS[0]);
      setYear(data.year ?? "3rd year");
      setWantSkills(Array.isArray(data.target_skills) ? data.target_skills : ["Python", "Embedded Systems", "CAD"]);
      setPlanItems(Array.isArray(data.plan_items) ? data.plan_items : []);
    };


    loadProfile();
  }, [session?.user?.id]);


  // ---------- Helpers: case-insensitive skill matching ----------
  const computeMatches = (o: any, skills: string[]) => {
    const tagSet = new Set((o.tags || []).map((t: any) => String(t).toLowerCase()));
    const matched: string[] = [];


    for (const s of skills) {
      const alias = SKILL_ALIASES[s] || [s];


      // strict match (case-insensitive)
      const hitStrict = alias.some((a) => tagSet.has(String(a).toLowerCase()));


      // loose match (substring)
      const hitLoose =
        !hitStrict &&
        alias.some((a) => {
          const al = String(a).toLowerCase();
          for (const t of tagSet) {
            if (t.includes(al) || al.includes(t)) return true;
          }
          return false;
        });


      if (hitStrict || hitLoose) matched.push(s);
    }


    return matched;
  };


  // ---------- Matching + filtering + sorting ----------
  const planIdSet = useMemo(() => new Set(planItems.map((p) => p.id)), [planItems]);
  const isInPlan = (uid: string) => planIdSet.has(uid);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();


    return OPPORTUNITIES
      .filter((o) => typeFilter.has(o.type))
      .filter((o) => {
        if (!q) return true;
        const tags = (o.tags || []).map((t: any) => String(t).toLowerCase());
        return (
          String(o.title).toLowerCase().includes(q) ||
          String(o.type).toLowerCase().includes(q) ||
          tags.some((t) => t.includes(q))
        );
      })
      .map((o) => {
        // IMPORTANT: make a stable unique id per row (because OPPORTUNITIES has duplicate `id`s)
        const uid = `${o.id}__${o.type}__${o.title}`;


        const matched = computeMatches(o, wantSkills);
        const matchCount = matched.length;


        return { ...o, uid, matched, matchCount };
      })
      .filter((o) => {
        // If user is on "Skills" tab and selected skills, only show opportunities
        // that match at least one of the selected filter skills.
        if (exploreFilterTab !== "skills") return true;
        if (exploreSkillFilter.size === 0) return true;


        const selected = Array.from(exploreSkillFilter);
        const hits = computeMatches(o, selected);
        return hits.length > 0;
      })
      .sort((a, b) => {
        // Sort by skill match count first
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        // Tie-breaker: alphabetical
        return String(a.title).localeCompare(String(b.title));
      });
  }, [query, wantSkills, typeFilter, exploreFilterTab, exploreSkillFilter]);


  const topMatches = useMemo(() => filtered.slice(0, 4), [filtered]);


  // ---------- UI actions ----------
  function toggleWantSkill(skill: string) {
    setWantSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }


  function toggleType(t: string) {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }


  function resetTypes() {
    setTypeFilter(new Set(TYPES));
  }


  function toggleExploreSkill(skill: string) {
    setExploreSkillFilter((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  }


  function resetExploreSkills() {
    setExploreSkillFilter(new Set());
  }


  function addToPlan(o: any) {
    if (isInPlan(o.uid)) return;
    setPlanItems((prev) => [...prev, { id: o.uid, title: o.title, why: o.why }]);
  }


  function removeFromPlan(uid: string) {
    setPlanItems((prev) => prev.filter((p) => p.id !== uid));
  }


  // ---------- Save profile ----------
  const saveToSupabase = async () => {
    if (!session?.user) return alert("Please sign in first!");


    const payload = {
      id: session.user.id,
      full_name: fullName,
      faculty,
      major,
      year,
      target_skills: wantSkills,
      plan_items: planItems,
      updated_at: new Date().toISOString(),
    };


    const { error } = await supabase.from("profiles").upsert(payload);


    if (error) {
      console.error("Error saving:", error);
      alert("Error saving profile: " + error.message);
    } else {
      alert("Saved!");
      setProfileOpen(false);
    }
  };


  // ---------- Auto-save plan per account ----------
  const autosaveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!session?.user?.id) return;


    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);


    autosaveTimer.current = window.setTimeout(async () => {
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        plan_items: planItems,
        updated_at: new Date().toISOString(),
      });


      if (error) console.error("Auto-save plan error:", error);
    }, 900);


    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    };
  }, [planItems, session?.user?.id]);


  const layout = { maxWidth: 1100, margin: "0 auto", padding: 18 };


  const navItem = (id: string, label: string) => {
    const active = tab === id;
    return (
      <button
        key={id}
        onClick={() => setTab(id)}
        style={{
          cursor: "pointer",
          border: "none",
          background: "transparent",
          color: active ? "white" : "rgba(255,255,255,0.78)",
          fontWeight: 900,
          letterSpacing: "-0.01em",
          padding: "10px 10px",
          borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
        }}
      >
        {label}
      </button>
    );
  };


  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) alert(error.message);
  };


  const handleProfileClick = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }
    setProfileOpen(true);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 700px at 20% 20%, rgba(200,16,46,0.20), transparent 60%), radial-gradient(900px 600px at 70% 30%, rgba(255,255,255,0.08), transparent 55%), linear-gradient(180deg, #08080c, #06060a)",
        color: "white",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, Helvetica, Arial",
      }}
    >
      <style>{`
        .pw-select{
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .pw-select:focus{
          border-color: rgba(200,16,46,0.70);
          box-shadow: 0 0 0 3px rgba(200,16,46,0.18);
        }
        .pw-select option{
          background: #0b0b10;
          color: rgba(255,255,255,0.92);
        }
      `}</style>


      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(8,8,12,0.55)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ ...layout, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontWeight: 1000, letterSpacing: "-0.03em", fontSize: 20 }}>Pathway</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {navItem("home", "Home")}
              {navItem("explore", "Explore")}
              {navItem("plan", `Plan (${planItems.length})`)}
            </div>
          </div>


          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select className="pw-select" value={university} onChange={(e) => setUniversity(e.target.value)}>
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>


          {tab !== "home" ? (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clubs"
              style={{
                width: 320,
                maxWidth: "80vw",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                outline: "none",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                }}
              />
            ) : null}



            <Btn variant="secondary" onClick={handleProfileClick}>
              Profile
            </Btn>


            {!loading && session?.user ? (
              <Btn variant="secondary" onClick={handleSignOut}>
                Sign out
              </Btn>
            ) : (
              <Btn variant="secondary" onClick={() => setAuthOpen(true)}>
                Sign in
              </Btn>
            )}
          </div>
        </div>
      </div>


      {/* Content */}
      <div style={{ ...layout }}>
        {tab === "home" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18, alignItems: "center", paddingTop: 20 }}>
            <div>
              <Pill accent>
                {faculty} · {major} · {year}
              </Pill>


              <div style={{ marginTop: 14, fontSize: 52, fontWeight: 1000, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                Find your next <span style={{ color: "rgba(255,255,255,0.96)" }}>campus move.</span>
              </div>


              <div style={{ marginTop: 14, fontSize: 15, color: "rgba(255,255,255,0.70)", maxWidth: 560, lineHeight: 1.5 }}>
                One place to discover teams and programs that build the skills you actually want. Add a few picks and keep a simple plan.
              </div>


              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
                <Btn variant="primary" onClick={() => setTab("explore")}>
                  Browse opportunities
                </Btn>
                <Pill>Top matches: {topMatches.length}</Pill>
              </div>


              <div style={{ marginTop: 18 }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 950, letterSpacing: "-0.02em" }}>Top matches</div>
                    <Pill accent>Based on your skills</Pill>
                  </div>
                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {topMatches.map((o) => (
                      <Row key={o.uid} o={o} added={isInPlan(o.uid)} onAdd={() => addToPlan(o)} onRemove={() => removeFromPlan(o.uid)} />
                    ))}
                  </div>
                </Card>
              </div>
            </div>


            <div>
              <Card style={{ minHeight: 420 }}>
                <div style={{ fontWeight: 950, letterSpacing: "-0.02em" }}>Your plan, at a glance</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>
                  Saved per account automatically.
                </div>


                <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                  {planItems.length === 0 ? (
                    <div style={{ border: "1px dashed rgba(255,255,255,0.18)", borderRadius: 16, padding: 14, color: "rgba(255,255,255,0.70)" }}>
                      Nothing in your plan yet. Add one from Top matches.
                    </div>
                  ) : (
                    planItems.slice(0, 6).map((it) => (
                      <div
                        key={it.id}
                        style={{
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 16,
                          padding: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 950 }}>{it.title}</div>
                        <Pill accent>Saved</Pill>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        ) : null}


        {tab === "explore" ? (
          <div style={{ paddingTop: 20, display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 1000, letterSpacing: "-0.03em", fontSize: 22 }}>Explore</div>
                <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 13 }}>Filter and add what feels realistic.</div>
              </div>
              <Pill accent>{filtered.length} results</Pill>
            </div>


            <Card>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Chip label="Types" active={exploreFilterTab === "types"} onClick={() => setExploreFilterTab("types")} />
                  <Chip label="Skills" active={exploreFilterTab === "skills"} onClick={() => setExploreFilterTab("skills")} />
                </div>


                {exploreFilterTab === "types" ? (
                  <Btn variant="secondary" onClick={resetTypes}>
                    Reset
                  </Btn>
                ) : (
                  <Btn variant="secondary" onClick={resetExploreSkills}>
                    Reset
                  </Btn>
                )}
              </div>


              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {exploreFilterTab === "types"
                  ? TYPES.map((t) => <Chip key={t} label={t} active={typeFilter.has(t)} onClick={() => toggleType(t)} />)
                  : SKILLS.map((s) => <Chip key={s} label={s} active={exploreSkillFilter.has(s)} onClick={() => toggleExploreSkill(s)} />)}
              </div>
            </Card>


            <div style={{ display: "grid", gap: 12 }}>
              {filtered.map((o) => (
                <Row key={o.uid} o={o} added={isInPlan(o.uid)} onAdd={() => addToPlan(o)} onRemove={() => removeFromPlan(o.uid)} />
              ))}
            </div>
          </div>
        ) : null}


        {tab === "plan" ? (
          <div style={{ paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 1000, letterSpacing: "-0.03em", fontSize: 22 }}>Plan</div>
                <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 13 }}>Per-account saved list.</div>
              </div>
              <Pill accent>{planItems.length} items</Pill>
            </div>


            <div style={{ marginTop: 14 }}>
              <Card>
                {planItems.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.70)" }}>No items yet.</div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {planItems.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 16,
                          padding: 12,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 950 }}>{it.title}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{it.why}</div>
                        </div>
                        <Btn variant="secondary" onClick={() => removeFromPlan(it.id)}>
                          Remove
                        </Btn>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        ) : null}
      </div>


      {/* Profile modal */}
      {profileOpen ? (
        <ProfileForm
          ACCENT={ACCENT}
          SKILLS={SKILLS}
          wantSkills={wantSkills}
          toggleWantSkill={toggleWantSkill}
          fullName={fullName}
          setFullName={setFullName}
          faculty={faculty}
          setFaculty={setFaculty}
          major={major}
          setMajor={setMajor}
          year={year}
          setYear={setYear}
          majorOptions={majorOptions}
          YEARS={YEARS}
          Modal={Modal}
          Btn={Btn}
          Chip={Chip}
          Card={Card}
          onClose={() => setProfileOpen(false)}
          onSave={saveToSupabase}
        />
      ) : null}


      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} signUp={signUp} signIn={signIn} />
    </div>
  );
}





