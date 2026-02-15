import React, { useEffect, useMemo, useState } from "react";

// Minimal, dependency-free React mock you can preview.
// Accent: UCalgary Dinos Red

const ACCENT = "#C8102E";

// Keep skills mainly technical (short list)
const SKILLS = [
  "Python",
  "C/C++",
  "MATLAB",
  "SQL",
  "Machine Learning",
  "Data Analysis",
  "Embedded Systems",
  "CAD",
  "PCB Design",
  "Control Systems",
  "Web Development",
  "UI/UX",
];

const TYPES = ["Engineering Club", "Computer Science Club", "Design Team", "Competition Team", "Program"];

const ENGINEERING_MAJORS = [
  "Biomedical Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Software Engineering",
  "Computer Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

const SCIENCE_MAJORS = ["Computer Science"];

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "Graduate", "Other"];

// Lean opportunities list (kept engineering + CS; removed most healthcare-specific orgs)
const OPPORTUNITIES = [
  // CS
  {
    id: "csus",
    type: "Computer Science Club",
    title: "CSUS (Computer Science Undergraduate Society)",
    tags: ["Web Development", "SQL", "UI/UX"],
    effort: "1–3 hrs/week",
    deadline: "Rolling",
    why: "Good hub for CS events, mentorship, and getting plugged in.",
  },
  {
    id: "ml-club",
    type: "Computer Science Club",
    title: "Machine Learning Club",
    tags: ["Python", "Machine Learning", "Data Analysis"],
    effort: "2–5 hrs/week",
    deadline: "Rolling",
    why: "Projects + reading groups for practical ML and portfolio building.",
  },

  // Programs
  {
    id: "techstart",
    type: "Program",
    title: "TechSTART",
    tags: ["Web Development", "UI/UX", "Python"],
    effort: "2–4 hrs/week",
    deadline: "Varies",
    why: "Cross-functional teams that ship real projects.",
  },
  {
    id: "ignite",
    type: "Program",
    title: "Schulich Ignite",
    tags: ["Python", "Data Analysis", "UI/UX"],
    effort: "2–4 hrs/week",
    deadline: "Varies",
    why: "Workshops and community that help you grow fast.",
  },

  // Competition / design teams
  {
    id: "soar",
    type: "Competition Team",
    title: "SOAR (Aerospace Research)",
    tags: ["CAD", "Embedded Systems", "C/C++"],
    effort: "4–8 hrs/week",
    deadline: "Varies",
    why: "Aerospace builds where you learn systems thinking and integration.",
  },
  {
    id: "baja",
    type: "Competition Team",
    title: "UCalgary Baja (Schulich Off-Road)",
    tags: ["CAD", "Control Systems", "Mechanical Design"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "High intensity build cycle. Great for design and iteration.",
  },
  {
    id: "racing",
    type: "Competition Team",
    title: "Schulich Racing (UCalgary Racing)",
    tags: ["CAD", "Embedded Systems", "Control Systems"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "Clear subteams and milestones. Strong engineering workflow.",
  },
  {
    id: "ssrt",
    type: "Competition Team",
    title: "SSRT (Space Rover Team)",
    tags: ["Embedded Systems", "C/C++", "PCB Design"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "Robotics integration across software, electronics, and mechanics.",
  },
  {
    id: "suav",
    type: "Competition Team",
    title: "SUAV (Unmanned Aerial Vehicles)",
    tags: ["Embedded Systems", "Control Systems", "C/C++"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "Autonomy + sensors + flight testing discipline.",
  },
  {
    id: "zeus",
    type: "Competition Team",
    title: "Team Zeus (Electric Motorcycle Racing)",
    tags: ["Embedded Systems", "PCB Design", "Control Systems"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "EV systems, batteries, and testing culture.",
  },
  {
    id: "solar",
    type: "Competition Team",
    title: "University of Calgary Solar Car Team",
    tags: ["Embedded Systems", "PCB Design", "Data Analysis"],
    effort: "4–10 hrs/week",
    deadline: "Varies",
    why: "Long-term engineering project. Great for power + embedded.",
  },
  {
    id: "gnctr",
    type: "Competition Team",
    title: "GNCTR (Concrete Toboggan)",
    tags: ["CAD", "MATLAB", "Data Analysis"],
    effort: "3–8 hrs/week",
    deadline: "Varies",
    why: "Tight deadlines, tangible deliverables, strong team culture.",
  },
  {
    id: "steel",
    type: "Competition Team",
    title: "UCSB (Steel Bridge)",
    tags: ["CAD", "MATLAB", "Data Analysis"],
    effort: "3–8 hrs/week",
    deadline: "Varies",
    why: "Build and compete with lots of iteration and testing.",
  },
];

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, accent }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        border: accent ? `1px solid ${ACCENT}` : "1px solid rgba(0,0,0,0.12)",
        background: accent ? "rgba(200,16,46,0.06)" : "white",
        color: accent ? ACCENT : "rgba(0,0,0,0.75)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 999,
        padding: "7px 10px",
        border: active ? `1px solid ${ACCENT}` : "1px solid rgba(0,0,0,0.16)",
        background: active ? "rgba(200,16,46,0.08)" : "white",
        color: active ? ACCENT : "black",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {label}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "min(980px, 96vw)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "white",
          borderRadius: 22,
          border: "1px solid rgba(0,0,0,0.10)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(0,0,0,0.10)",
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 950 }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", marginTop: 2 }}>Keep the main UI clean. Edit here.</div>
          </div>
          <button
            onClick={onClose}
            style={{
              cursor: "pointer",
              background: "white",
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              padding: "10px 12px",
              borderRadius: 14,
              fontWeight: 900,
            }}
          >
            Close
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

export default function PathwayUofCMock() {
  const [tab, setTab] = useState("dashboard");
  const [query, setQuery] = useState("");

  const [faculty, setFaculty] = useState("Engineering");
  const [major, setMajor] = useState(ENGINEERING_MAJORS[0]);
  const [year, setYear] = useState("3rd year");

  const [wantSkills, setWantSkills] = useState(["Python", "Embedded Systems", "Machine Learning"]);
  const [typeFilter, setTypeFilter] = useState(new Set(TYPES));

  const [planItems, setPlanItems] = useState([]);
  const [toast, setToast] = useState("");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // record what you added from Quick Add (so it appears at the bottom of that card)
  const [recentQuickAdds, setRecentQuickAdds] = useState([]);

  const majorOptions = useMemo(() => (faculty === "Science" ? SCIENCE_MAJORS : ENGINEERING_MAJORS), [faculty]);

  useEffect(() => {
    if (!majorOptions.includes(major)) setMajor(majorOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faculty]);

  const planIdSet = useMemo(() => new Set(planItems.map((p) => p.id)), [planItems]);
  const isInPlan = (id) => planIdSet.has(id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const want = new Set(wantSkills);

    return OPPORTUNITIES
      .filter((o) => typeFilter.has(o.type))
      .filter((o) => {
        if (!q) return true;
        return o.title.toLowerCase().includes(q) || o.type.toLowerCase().includes(q) || o.tags.some((t) => t.toLowerCase().includes(q));
      })
      .map((o) => {
        const matchWant = o.tags.filter((t) => want.has(t)).length;
        const score = Math.min(100, 35 + matchWant * 18);
        return { ...o, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [query, wantSkills, typeFilter]);

  const topMatches = useMemo(() => filtered.slice(0, 4), [filtered]);
  const topMatchIdSet = useMemo(() => new Set(topMatches.map((x) => x.id)), [topMatches]);

  // Quick add must differ from top matches AND rotate when you add something
  const quickCandidates = useMemo(() => {
    return filtered.filter((o) => !topMatchIdSet.has(o.id) && !isInPlan(o.id)).slice(0, 3);
  }, [filtered, topMatchIdSet, planIdSet]);

  function toggleType(t) {
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

  function toggleWantSkill(skill) {
    setWantSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function addToPlan(o, source) {
    if (isInPlan(o.id)) {
      setToast("Already in plan");
      setTimeout(() => setToast(""), 1000);
      return;
    }

    setPlanItems((prev) => [...prev, { id: o.id, title: o.title, type: o.type, effort: o.effort, deadline: o.deadline }]);

    if (source === "quick") {
      setRecentQuickAdds((prev) => {
        const next = [{ id: o.id, title: o.title, type: o.type }, ...prev.filter((x) => x.id !== o.id)];
        return next.slice(0, 3);
      });
    }

    setToast("Added to plan");
    setTimeout(() => setToast(""), 1000);
  }

  const layout = { maxWidth: 1180, margin: "0 auto", padding: 16 };
  const sidebarW = sidebarCollapsed ? 88 : 280;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "explore", label: "Explore", icon: "⌕" },
    { id: "plan", label: "Plan", icon: "✓" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "white", color: "black" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.92)", borderBottom: `2px solid ${ACCENT}`, backdropFilter: "blur(8px)" }}>
        <div style={{ ...layout, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ cursor: "pointer", width: 40, height: 40, borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "white", fontWeight: 900 }}
            >
              ☰
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: ACCENT, color: "white", display: "grid", placeItems: "center", fontWeight: 950 }}>D</div>
              <div>
                <div style={{ fontWeight: 950, lineHeight: 1 }}>Pathway</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>UofC Growth Engine</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clubs, teams, skills…"
              style={{ width: 360, maxWidth: "70vw", padding: "10px 12px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.14)", outline: "none" }}
            />
            <button
              onClick={() => setProfileOpen(true)}
              style={{ cursor: "pointer", background: "black", color: "white", border: "1px solid black", padding: "10px 12px", borderRadius: 14, fontWeight: 900 }}
            >
              Edit profile
            </button>
            <Pill accent>{major}</Pill>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ ...layout, display: "grid", gridTemplateColumns: `${sidebarW}px 1fr`, gap: 14, alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ display: "grid", gap: 14 }}>
          <Card style={{ padding: sidebarCollapsed ? 10 : 14 }}>
            <div style={{ fontWeight: 950, display: sidebarCollapsed ? "none" : "block" }}>Navigation</div>
            <div style={{ display: "grid", gap: 8, marginTop: sidebarCollapsed ? 0 : 10 }}>
              {navItems.map((n) => {
                const active = tab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setTab(n.id)}
                    title={n.label}
                    style={{
                      cursor: "pointer",
                      padding: sidebarCollapsed ? "12px 10px" : "10px 12px",
                      borderRadius: 14,
                      border: active ? `1px solid ${ACCENT}` : "1px solid rgba(0,0,0,0.10)",
                      background: active ? "rgba(200,16,46,0.08)" : "white",
                      color: active ? ACCENT : "black",
                      textAlign: "left",
                      fontWeight: 950,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: sidebarCollapsed ? "center" : "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{n.icon}</span>
                    <span style={{ display: sidebarCollapsed ? "none" : "inline" }}>{n.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950, display: sidebarCollapsed ? "none" : "block" }}>Target Skills</div>
              <Pill accent>{wantSkills.length}</Pill>
            </div>
            <div style={{ display: sidebarCollapsed ? "none" : "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {wantSkills.map((s) => (
                <Pill key={s} accent>
                  {s}
                </Pill>
              ))}
            </div>
            <div style={{ display: sidebarCollapsed ? "grid" : "none", placeItems: "center", paddingTop: 6 }}>
              <div title="Skills" style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT }} />
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950, display: sidebarCollapsed ? "none" : "block" }}>Plan</div>
              <Pill accent>{planItems.length} items</Pill>
            </div>
            <div style={{ display: sidebarCollapsed ? "none" : "grid", gap: 10, marginTop: 12 }}>
              {planItems.length === 0 ? (
                <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>Add items from Dashboard or Explore.</div>
              ) : (
                planItems.slice(0, 4).map((it) => (
                  <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: 10 }}>
                    <div style={{ fontWeight: 950 }}>{it.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 3 }}>
                      {it.type} · {it.deadline}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Main */}
        <div style={{ display: "grid", gap: 14 }}>
          {toast ? (
            <div style={{ border: `1px solid ${ACCENT}`, borderRadius: 18, padding: 12, background: "rgba(200,16,46,0.05)", fontSize: 13, fontWeight: 800, color: ACCENT }}>
              {toast}
            </div>
          ) : null}

          {tab === "dashboard" ? (
            <Card style={{ padding: 18, borderRadius: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <Pill accent>
                    Personalized for {major} · {year}
                  </Pill>
                  <h1 style={{ margin: "10px 0 0", fontSize: 26, lineHeight: 1.15 }}>Your growth map</h1>
                  <p style={{ margin: "10px 0 0", color: "rgba(0,0,0,0.65)", maxWidth: 720 }}>
                    A centralized view of clubs, teams, and programs ranked by the technical skills you want to build.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setTab("explore")} style={{ cursor: "pointer", background: "black", color: "white", border: "1px solid black", padding: "10px 12px", borderRadius: 14, fontWeight: 950 }}>
                    Explore
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12, marginTop: 16 }}>
                {/* Top matches */}
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 950 }}>Top matches</div>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 2 }}>Ranked by fit</div>
                    </div>
                    <Pill accent>{Math.min(4, filtered.length)} shown</Pill>
                  </div>

                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {topMatches.map((o) => {
                      const added = isInPlan(o.id);
                      return (
                        <div key={o.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <div style={{ fontWeight: 950 }}>{o.title}</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <Pill accent>Fit {o.score}</Pill>
                              <button
                                onClick={() => addToPlan(o, "top")}
                                disabled={added}
                                style={{
                                  cursor: added ? "default" : "pointer",
                                  background: added ? "rgba(0,0,0,0.06)" : "black",
                                  color: added ? "rgba(0,0,0,0.55)" : "white",
                                  border: added ? "1px solid rgba(0,0,0,0.12)" : "1px solid black",
                                  padding: "7px 10px",
                                  borderRadius: 14,
                                  fontWeight: 950,
                                  fontSize: 12,
                                }}
                              >
                                {added ? "Added" : "Add"}
                              </button>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                            {o.tags.slice(0, 4).map((t) => (
                              <Pill key={t} accent>
                                {t}
                              </Pill>
                            ))}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 8 }}>{o.why}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Quick add */}
                <Card>
                  <div style={{ fontWeight: 950 }}>Quick add</div>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 2 }}>Different from Top matches. Updates after you add.</div>

                  <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {quickCandidates.map((o) => {
                      const added = isInPlan(o.id);
                      return (
                        <div key={o.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: 10, display: "grid", gap: 8 }}>
                          <div style={{ fontWeight: 950 }}>{o.title}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            <Pill>{o.type}</Pill>
                            <Pill>Effort: {o.effort}</Pill>
                          </div>
                          <button
                            onClick={() => addToPlan(o, "quick")}
                            disabled={added}
                            style={{
                              cursor: added ? "default" : "pointer",
                              background: added ? "rgba(0,0,0,0.06)" : ACCENT,
                              color: added ? "rgba(0,0,0,0.55)" : "white",
                              border: added ? "1px solid rgba(0,0,0,0.12)" : `1px solid ${ACCENT}`,
                              padding: "8px 10px",
                              borderRadius: 14,
                              fontWeight: 950,
                              width: "fit-content",
                            }}
                          >
                            {added ? "Added to plan" : "Add"}
                          </button>
                        </div>
                      );
                    })}

                    {recentQuickAdds.length > 0 ? (
                      <div style={{ marginTop: 10, borderTop: "1px solid rgba(0,0,0,0.10)", paddingTop: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(0,0,0,0.70)" }}>Recently added</div>
                        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                          {recentQuickAdds.map((it) => (
                            <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: 10, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                              <div>
                                <div style={{ fontWeight: 950, fontSize: 13 }}>{it.title}</div>
                                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 2 }}>{it.type}</div>
                              </div>
                              <Pill accent>Added</Pill>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>
            </Card>
          ) : null}

          {tab === "explore" ? (
            <Card style={{ padding: 18, borderRadius: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>Explore clubs and teams</h2>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 4 }}>Filter by type and search by name or skill</div>
                </div>
                <Pill accent>{filtered.length} results</Pill>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {TYPES.map((t) => (
                  <Chip key={t} label={t} active={typeFilter.has(t)} onClick={() => toggleType(t)} />
                ))}
                <button onClick={resetTypes} style={{ cursor: "pointer", borderRadius: 999, padding: "7px 10px", border: "1px solid rgba(0,0,0,0.16)", background: "white", fontSize: 13, fontWeight: 850 }}>
                  Reset
                </button>
              </div>

              <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                {filtered.map((o) => {
                  const added = isInPlan(o.id);
                  return (
                    <div key={o.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 18, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ minWidth: 280 }}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <div style={{ fontWeight: 950 }}>{o.title}</div>
                            <Pill>{o.type}</Pill>
                            <Pill accent>Fit {o.score}</Pill>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            <Pill>Effort: {o.effort}</Pill>
                            <Pill>Deadline: {o.deadline}</Pill>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            {o.tags.map((t) => (
                              <Pill key={t} accent>
                                {t}
                              </Pill>
                            ))}
                          </div>
                          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", marginTop: 10 }}>{o.why}</div>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            onClick={() => addToPlan(o, "explore")}
                            disabled={added}
                            style={{
                              cursor: added ? "default" : "pointer",
                              background: added ? "rgba(0,0,0,0.06)" : "black",
                              color: added ? "rgba(0,0,0,0.55)" : "white",
                              border: added ? "1px solid rgba(0,0,0,0.12)" : "1px solid black",
                              padding: "10px 12px",
                              borderRadius: 14,
                              fontWeight: 950,
                            }}
                          >
                            {added ? "Added" : "Add to plan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : null}

          {tab === "plan" ? (
            <Card style={{ padding: 18, borderRadius: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>Semester Plan</h2>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 4 }}>What you’ve added so far</div>
                </div>
                <Pill accent>{planItems.length} items</Pill>
              </div>

              {planItems.length === 0 ? (
                <div style={{ marginTop: 14, color: "rgba(0,0,0,0.65)" }}>Your plan is empty. Add items from Dashboard or Explore.</div>
              ) : (
                <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                  {planItems.map((it) => (
                    <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 18, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 950 }}>{it.title}</div>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)", marginTop: 4 }}>{it.type}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Pill>Effort: {it.effort}</Pill>
                          <Pill>Deadline: {it.deadline}</Pill>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : null}
        </div>
      </div>

      {/* Profile modal */}
      {profileOpen ? (
        <Modal title="Edit profile" onClose={() => setProfileOpen(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 950 }}>Basics</div>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>Faculty</span>
                  <select
                    value={faculty}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFaculty(v);
                      if (v === "Science") setMajor("Computer Science");
                      else if (major === "Computer Science") setMajor(ENGINEERING_MAJORS[0]);
                    }}
                    style={{ padding: 10, borderRadius: 14, border: "1px solid rgba(0,0,0,0.14)" }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>Major</span>
                  <select value={major} onChange={(e) => setMajor(e.target.value)} style={{ padding: 10, borderRadius: 14, border: "1px solid rgba(0,0,0,0.14)" }}>
                    {majorOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>Year</span>
                  <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: 10, borderRadius: 14, border: "1px solid rgba(0,0,0,0.14)" }}>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 950 }}>Target skills (drives recommendations)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {SKILLS.map((s) => (
                  <Chip key={s} label={s} active={wantSkills.includes(s)} onClick={() => toggleWantSkill(s)} />
                ))}
              </div>
            </Card>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
