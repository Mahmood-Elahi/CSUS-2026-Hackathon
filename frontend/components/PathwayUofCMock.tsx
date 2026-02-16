// frontend/components/PathwayUofCMock.tsx
"use client";


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import ProfileForm from "./ProfileForm";


const ACCENT = "#C8102E";


// ------------------ DATA ------------------
const SKILLS = [
  "Python",
  "C/C++",
  "MATLAB",
  "SQL",
  "Machine Learning",
  "Embedded Systems",
  "CAD",
  "PCB Design",
  "Control Systems",
  "Web Dev",
  "Data",
  "Robotics",
  "Prototyping",
  "UI/UX",
  "Testing",
];


const SKILL_ALIASES: Record<string, string[]> = {
  CAD: ["CAD", "Design", "Aero", "Structures", "Materials", "Mechanical Design"],
  "Embedded Systems": ["Embedded Systems", "embedded", "Robotics", "PCB Design", "Control Systems", "IoT"],
  "Machine Learning": ["Machine Learning", "machine learning", "ML", "Python", "Data", "AI"],
  SQL: ["SQL", "Data", "Data Analysis", "Analytics"],
  "Web Dev": ["Web Dev", "Web Development", "web dev", "Frontend", "Backend", "Full Stack", "Web", "UI/UX"],
  Robotics: ["Robotics", "robotics", "Embedded Systems", "Control Systems"],
  Prototyping: ["Prototyping", "prototype", "Testing", "Research", "rapid prototyping"],
  Data: ["Data", "Data Analysis", "Data science", "analytics", "Analytics", "Power BI", "SQL", "Python"],
  Testing: ["Testing", "test", "Prototyping", "QA"],
  "PCB Design": ["PCB Design", "PCB", "Embedded Systems", "electronics"],
  "Control Systems": ["Control Systems", "controls", "Robotics", "Embedded Systems"],
  Python: ["Python", "Machine Learning", "Data", "Data Analysis"],
  "UI/UX": ["UI/UX", "UX", "UI", "UX/UI", "product design", "Product Design"],
};


const TYPES = ["CPSC", "ENG"];


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


const OPPORTUNITIES = [
  // ---------- ENG: Design Teams ----------
  {
    id: "soar",
    title: "SOAR",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Build rockets and aerospace systems in a milestone-driven team with strong technical mentorship.",
    link: "https://www.soar-rockets.ca/",
  },
  {
    id: "baja",
    title: "Baja",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Design and race an off-road vehicle while learning iterative engineering and hands-on fabrication.",
    link: "https://ucalgbaja.ca/",
  },
  {
    id: "bmerit",
    title: "BMERIT",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Work on biomedical engineering projects that blend prototyping, testing, and real-world impact.",
    link: "https://bmerit.vercel.app/",
  },
  {
    id: "calgarytospace",
    title: "CalgaryToSpace",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Get involved in space-focused builds and research with strong systems integration experience.",
    link: "https://www.calgarytospace.ca/",
  },
  {
    id: "calgary_racing",
    title: "Calgary Racing",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Join a competitive motorsport team with clear subteams, deadlines, and engineering workflow.",
    link: "https://ucalgaryracing.ca/",
  },
  {
    id: "gnctr_toboggan",
    title: "GNCTR (Toboggan)",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Concrete toboggan design and competition with real testing, timelines, and deliverables.",
    link: "https://gnctruofc.wordpress.com/",
  },
  {
    id: "space_rover_team",
    title: "Space Rover Team",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Build robotics systems end-to-end: electronics, autonomy, controls, and field testing.",
    link: "https://ucalgaryrover.weebly.com/",
  },
  {
    id: "suav",
    title: "Unmanned Aerial Vehicles (SUAV)",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Work on UAV autonomy, sensors, controls, and the discipline of flight testing.",
    link: "https://calgaryuav.com/",
  },
  {
    id: "team_zeus",
    title: "Team Zeus",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Electric motorcycle racing with battery systems, embedded work, and a strong testing culture.",
    link: "https://www.teamzeus.ca/",
  },
  {
    id: "solar_car_team",
    title: "Solar Car Team",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Long-horizon build that teaches power systems, embedded telemetry, and engineering stamina.",
    link: "https://calgarysolarcar.ca/",
  },
  {
    id: "waybionic",
    title: "WayBionic",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Assistive and bionics work combining design, prototyping, and interdisciplinary engineering.",
    link: "https://www.waybionic.com/",
  },

  // ---------- ENG: Clubs / Programs ----------
  {
    id: "project90",
    title: "Project90",
    type: "ENG",
    tags: ["Teamwork","Communication","Planning","Documentation","Problem Solving","Git","Testing","Python","C/C++","Embedded","SQL","Data Analysis","PCB Design","CAD","Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "Engineering community + projects that build leadership, consistency, and real execution habits.",
    link: "https://project90.ca/",
  },
  {
    id: "schulich_ignite",
    title: "Schulich Ignite",
    type: "ENG",
    tags: ["Programming Mentorship","Workshops","Project Building","Teamwork"],
    effort: "1hr-3hr",
    deadline: "Fall and Winter Semesters",
    why: "Grow fast through workshops and mentorship while building confidence in technical foundations.",
    link: "https://schulichignite.com/",
  },
  {
    id: "ucalgary_design_league",
    title: "uCalgary Design League",
    type: "ENG",
    tags: ["CAD","Design Thinking","Prototyping","Designathons"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "Designathons and hands-on challenges that sharpen CAD, prototyping, and design thinking.",
    link: "https://ucdesignleague.square.site/",
  },
  {
    id: "wise",
    title: "Women in Science and Engineering (WISE)",
    type: "ENG",
    tags: ["Mentorship","Professional Development","STEM Community"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Mentorship and professional development events in a supportive STEM community.",
    link: "https://www.uofcwise.com/",
  },
  {
    id: "ieee_ucalgary",
    title: "IEEE UCalgary Student Branch",
    type: "ENG",
    tags: ["Tech Talks","Networking","Embedded/IoT","Workshops"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Technical talks and workshops that connect you with industry and practical engineering skills.",
    link: "https://ieee-ucalgary.ca/",
  },
  {
    id: "revolt_ev",
    title: "ReVOLT EV",
    type: "ENG",
    tags: ["EV Projects","Embedded/Software","Teamwork","Git"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "EV-focused projects that blend teamwork with embedded and software development.",
    link: "https://schulich.ucalgary.ca/current-students/undergraduate/student-life/clubs-teams",
  },
  {
    id: "mind_mechatronics_innovation_design",
    title: "MIND (Mechatronics Innovation Design)",
    type: "ENG",
    tags: ["Robotics","Embedded Systems","Prototyping","Teamwork"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "Mechatronics and robotics builds where you learn by prototyping and iterating with a team.",
    link: "https://www.minducalgary.com/",
  },
  {
    id: "gobabygo_ucalgary",
    title: "GoBabyGo UCalgary",
    type: "ENG",
    tags: ["Assistive Tech","Embedded/Software","Hardware Integration"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "Assistive technology projects with tangible impact and strong hands-on integration work.",
    link: "https://schulich.ucalgary.ca/current-students/undergraduate/student-life/clubs-teams",
  },
  {
    id: "scrp",
    title: "Schulich Community Robotics Program (SCRP)",
    type: "ENG",
    tags: ["Robotics Outreach","Mentoring","Programming Basics"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "Teach robotics and programming fundamentals while building mentoring and leadership skills.",
    link: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },
  {
    id: "ucalgary_robotics_club",
    title: "University of Calgary Robotics Club",
    type: "ENG",
    tags: ["Robotics","Programming","Building","Teamwork"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "A hands-on robotics community for building, learning, and collaborating on projects.",
    link: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },
  {
    id: "minds_in_motion",
    title: "Minds in Motion",
    type: "ENG",
    tags: ["Robotics Mentoring","STEM Outreach","Leadership"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "Lead youth robotics programming and build confidence as a mentor and facilitator.",
    link: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },

  // ---------- CPSC: Clubs / Research / Community ----------
  {
    id: "csus",
    title: "Computer Science Undergraduate Society",
    type: "CPSC",
    tags: ["Networking","Hackathon Participation","Teamwork","Software Project Collaboration","Career Preparation"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "A central hub for CS events, community, and getting plugged into opportunities fast.",
    link: "https://csus.club/",
  },
  {
    id: "competitive_programming_club",
    title: "Competitive Programming Club",
    type: "CPSC",
    tags: ["Algorithms","Data Structures","Problem Solving","Python","C++","Interview Prep"],
    effort: "1hr-3hr",
    deadline: "Fall and Winter Semesters",
    why: "Sharpen algorithms and problem solving with consistent practice and interview-style challenges.",
    link: "https://cpc.cpsc.ucalgary.ca/",
  },
  {
    id: "dsmlc",
    title: "Data Science and Machine Learning Club",
    type: "CPSC",
    tags: ["Python","Machine Learning","SQL","Data Analysis","Power BI","AI Concepts"],
    effort: "2hr-4hr",
    deadline: "Year-Round",
    why: "Build ML and data skills through projects, workshops, and a strong learning community.",
    link: "https://www.dsmlcucalgary.ca/",
  },
  {
    id: "aic",
    title: "Artificial Intelligence Club (AIC)",
    type: "CPSC",
    tags: ["Machine Learning","Neural Networks","Python","AI Research","Project Development"],
    effort: "2hr-5hr",
    deadline: "Fall and Winter Semesters",
    why: "Explore AI through research-style learning and projects with people who take it seriously.",
    link: "https://www.vision-research.ca/aic",
  },
  {
    id: "information_security_club",
    title: "Information Security Club",
    type: "CPSC",
    tags: ["Cybersecurity","Ethical Hacking","Linux","Networking","Security Tools"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Learn security fundamentals through practical exploration, tooling, and community practice.",
    link: "https://www.linkedin.com/company/cybersec-ucalgary/",
  },
  {
    id: "gdc",
    title: "Game Design Club (GDC)",
    type: "CPSC",
    tags: ["Game Development","Unity","C#","Teamwork","Software Design"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Make games with a team while practicing clean software design and creative problem solving.",
    link: "https://uofcgamedesignclub.itch.io/",
  },
  {
    id: "tech_start_ucalgary",
    title: "Tech Start UCalgary",
    type: "CPSC",
    tags: ["Software Dev","Product Building","Teamwork","Git","Agile"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "Ship real products in cross-functional teams and learn practical dev workflows.",
    link: "https://techstartucalgary.com/",
  },
  {
    id: "dsc_ucalgary",
    title: "Developer Student Club (DSC) UCalgary",
    type: "CPSC",
    tags: ["App Dev","Web Dev","Cloud","Workshops","Networking"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "Hands-on workshops and community for building apps, web projects, and cloud skills.",
    link: "https://dsc-uofc-website.herokuapp.com/",
  },
  {
    id: "wics",
    title: "WiCS (Women in Computer Science)",
    type: "CPSC",
    tags: ["Networking","Mentorship","Career Talks","Community"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Supportive CS community with mentorship and career events that actually help.",
    link: "https://www.instagram.com/wics.uofc/",
  },
  {
    id: "wicys",
    title: "WiCyS @ UCalgary",
    type: "CPSC",
    tags: ["Cybersecurity","Networking","Career Development","Workshops"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Cybersecurity community focused on skills, confidence, and career development.",
    link: "https://www.instagram.com/wicys.uofc/",
  },
  {
    id: "cybersec_ucalgary",
    title: "CYBERSEC (UCalgary CyberSecurity Club)",
    type: "CPSC",
    tags: ["Cybersecurity","CTFs","Networking","Security Tools"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "CTFs and security practice for people who want hands-on learning and consistency.",
    link: "https://cybersec-ucalgary.club/",
  },
  {
    id: "uofc_fintech",
    title: "UofC FinTech",
    type: "CPSC",
    tags: ["Fintech Projects","Data Analysis","Python","Networking"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Fintech projects and events that connect software, data, and real industry context.",
    link: "https://suuofc.campuslabs.ca/engage/organization/fintechcalgary",
  },
  {
    id: "ucalgary_blockchain_society",
    title: "UCalgary Blockchain Society",
    type: "CPSC",
    tags: ["Blockchain Fundamentals","Smart Contracts","Dev Workshops","Networking"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Learn blockchain foundations and dev concepts through workshops and community builds.",
    link: "https://suuofc.campuslabs.ca/engage/organization/ucalgary-blockchain-society",
  },
  {
    id: "uxdc",
    title: "User Experience Design Club (UXDC)",
    type: "CPSC",
    tags: ["UX/UI","Product Design","Prototyping","User Research"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Practice UX research and prototyping with people who care about real product thinking.",
    link: "https://linktr.ee/uxdc.uofc",
  },
  {
    id: "stem_fellowship",
    title: "STEM Fellowship UCalgary Branch",
    type: "CPSC",
    tags: ["Workshops","Computational Thinking","Data/AI","Leadership"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Workshops and leadership opportunities focused on computation, data, and real skill growth.",
    link: "https://live.stemfellowship.org/university-branches/university-of-calgary-branch/",
  },
  {
    id: "adss",
    title: "Actuarial & Data Science Society (ADSS)",
    type: "CPSC",
    tags: ["Data Science","Analytics","Python/R","Professional Development"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Data and analytics community with career development and practical learning events.",
    link: "https://adssucalgary.ca/",
  },
  {
    id: "sase",
    title: "Society of Asian Scientists & Engineers (SASE)",
    type: "CPSC",
    tags: ["Professional Development","Networking","Tech Career Skills"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Professional development and networking that helps you grow your career toolkit.",
    link: "https://www.saseucalgary.com/",
  },
  {
    id: "ucalgary_bioinformatics_club",
    title: "UCalgary Bioinformatics Club",
    type: "CPSC",
    tags: ["Bioinformatics","Python/R","Data Analysis","Research Skills"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "Learn bioinformatics and research-style analysis while building a strong technical niche.",
    link: "https://linktr.ee/ucalgarybioinformatics",
  },
  {
    id: "igem_calgary",
    title: "iGEM Calgary (Dry Lab + Software)",
    type: "CPSC",
    tags: ["Modeling","Data Analysis","Software Tools","Teamwork"],
    effort: "2hr-8hr",
    deadline: "Summer + Year-Round",
    why: "Research-heavy team where you build modeling and software tools for synthetic biology projects.",
    link: "https://2025.igem.wiki/ucalgary/index.html",
  },
  {
    id: "hack4health",
    title: "Hack4Health UCalgary",
    type: "CPSC",
    tags: ["Hackathon Building","Teamwork","Rapid Prototyping"],
    effort: "8hr-24hr",
    deadline: "Event-Based",
    why: "High-energy hackathon community focused on building fast, learning, and shipping prototypes.",
    link: "https://www.hack4health.ca/",
  },
];



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
        {(o.matched || []).slice(0, 3).map((m: string) => (
          <Pill key={`${o.uid}-m-${m}`} accent>
            {m}
          </Pill>
        ))}
      </div>


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
            If email confirmation is enabled in Supabase, check your inbox to verify.
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


            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
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





