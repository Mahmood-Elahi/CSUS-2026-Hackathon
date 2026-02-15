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


const TYPES = ["Competition Team", "Program", "Engineering Club", "Computer Science Club", "CPSC", "ENG"];


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


  // Many more...
  {
    id: "actuarial_and_data_science_society_adss",
    title: "Actuarial & Data Science Society (ADSS)",
    type: "CPSC",
    tags: ["Data science", "analytics", "Python/R", "professional development"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://adssucalgary.ca/",
  },
  {
    id: "artificial_intelligence_club_aic",
    title: "Artificial Intelligence Club (AIC)",
    type: "CPSC",
    tags: ["Machine learning", "neural networks", "Python", "AI research", "project development"],
    effort: "2hr-5hr",
    deadline: "Fall and Winter Semesters",
    why: "https://www.vision-research.ca/aic",
  },


  // NOTE: these duplicates are why we now use uid, not id, for keys/plan
  
  {
    id: "bmerit",
    title: "BMERIT",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "calgary_racing",
    title: "Calgary Racing",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "calgarytospace",
    title: "CalgaryToSpace",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "competitive_programming_club",
    title: "Competitive Programming Club",
    type: "CPSC",
    tags: ["Algorithms", "data structures", "problem solving", "Python/C++ coding", "interview prep"],
    effort: "1hr-3hr",
    deadline: "Fall and Winter Semesters",
    why: "helpful, but not mandatory",
  },
  {
    id: "computer_science_undergraduate_society",
    title: "Computer Science Undergraduate Society",
    type: "CPSC",
    tags: ["Networking", "hackathon participation", "teamwork", "software project collaboration", "career preparation"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://csus.club/",
  },
  {
    id: "cybersec_ucalgary_cybersecurity_club",
    title: "CYBERSEC (UCalgary CyberSecurity Club)",
    type: "CPSC",
    tags: ["Cybersecurity", "CTFs", "networking", "security tools"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://cybersec-ucalgary.club/",
  },
  {
    id: "data_science_and_machine_learning_club",
    title: "Data Science and Machine Learning Club",
    type: "CPSC",
    tags: ["Python", "machine learning", "SQL", "data analysis", "Power BI", "AI concepts"],
    effort: "2hr-4hr",
    deadline: "Year-Round",
    why: "https://www.dsmlcucalgary.ca/",
  },
  {
    id: "developer_student_club_dsc_ucalgary",
    title: "Developer Student Club (DSC) UCalgary",
    type: "CPSC",
    tags: ["App dev", "web dev", "cloud", "workshops", "networking"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://dsc-uofc-website.herokuapp.com/",
  },
  {
    id: "game_design_club_gdc",
    title: "Game Design Club (GDC)",
    type: "CPSC",
    tags: ["Game development", "Unity", "C#", "teamwork", "software design"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://uofcgamedesignclub.itch.io/",
  },
  {
    id: "gnctr_toboggan",
    title: "GNCTR (Toboggan)",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "gobabygo_ucalgary",
    title: "GoBabyGo UCalgary",
    type: "ENG",
    tags: ["Assistive tech", "embedded/software", "hardware integration"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://schulich.ucalgary.ca/current-students/undergraduate/student-life/clubs-teams",
  },
  {
    id: "hack4health_ucalgary",
    title: "Hack4Health UCalgary",
    type: "CPSC",
    tags: ["Hackathon building", "teamwork", "rapid prototyping"],
    effort: "8hr-24hr",
    deadline: "Event-Based",
    why: "https://www.hack4health.ca/",
  },
  {
    id: "ieee_ucalgary_student_branch",
    title: "IEEE UCalgary Student Branch",
    type: "ENG",
    tags: ["Tech talks", "networking", "embedded/IoT", "workshops"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://ieee-ucalgary.ca/",
  },
  {
    id: "igem_calgary_dry_lab_software",
    title: "iGEM Calgary (Dry Lab + Software)",
    type: "CPSC",
    tags: ["Modeling", "data analysis", "software tools", "teamwork"],
    effort: "2hr-8hr",
    deadline: "Summer + Year-Round",
    why: "https://2025.igem.wiki/ucalgary/index.html",
  },
  {
    id: "information_security_club",
    title: "Information Security Club",
    type: "CPSC",
    tags: ["Cybersecurity", "ethical hacking", "Linux", "networking", "security tools"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://www.linkedin.com/company/cybersec-ucalgary/",
  },
  {
    id: "mind_mechatronics_innovation_design",
    title: "MIND (Mechatronics Innovation Design)",
    type: "ENG",
    tags: ["Robotics", "embedded systems", "prototyping", "teamwork"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "https://www.minducalgary.com/",
  },
  {
    id: "minds_in_motion",
    title: "Minds in Motion",
    type: "ENG",
    tags: ["Robotics mentoring", "STEM outreach", "leadership"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },
  {
    id: "project90",
    title: "Project90",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "revolt_ev",
    title: "ReVOLT EV",
    type: "ENG",
    tags: ["EV projects", "embedded/software", "teamwork", "Git"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "https://schulich.ucalgary.ca/current-students/undergraduate/student-life/clubs-teams",
  },
  {
    id: "schulich_community_robotics_program_scrp",
    title: "Schulich Community Robotics Program (SCRP)",
    type: "ENG",
    tags: ["Robotics outreach", "mentoring", "programming basics"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },
  {
    id: "schulich_ignite",
    title: "Schulich Ignite",
    type: "ENG",
    tags: ["Programming mentorship", "workshops", "project building", "teamwork"],
    effort: "1hr-3hr",
    deadline: "Fall and Winter Semesters",
    why: "https://schulichignite.com/",
  },
  {
    id: "soar",
    title: "SOAR",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "society_of_asian_scientists_and_engineers_sase",
    title: "Society of Asian Scientists & Engineers (SASE)",
    type: "CPSC",
    tags: ["Professional development", "networking", "tech career skills"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://www.saseucalgary.com/",
  },
  {
    id: "solar_car_team",
    title: "Solar Car Team",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "space_rover_team",
    title: "Space Rover Team",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "stem_fellowship_ucalgary_branch",
    title: "STEM Fellowship UCalgary Branch",
    type: "CPSC",
    tags: ["Workshops", "computational thinking", "data/AI", "leadership"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://live.stemfellowship.org/university-branches/university-of-calgary-branch/",
  },
  {
    id: "team_zeus",
    title: "Team Zeus",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "tech_start_ucalgary",
    title: "Tech Start UCalgary",
    type: "CPSC",
    tags: ["Software dev", "product building", "teamwork", "Git", "agile"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "https://techstartucalgary.com/",
  },
  {
    id: "ucalgary_bioinformatics_club",
    title: "UCalgary Bioinformatics Club",
    type: "CPSC",
    tags: ["Bioinformatics", "Python/R", "data analysis", "research skills"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://linktr.ee/ucalgarybioinformatics",
  },
  {
    id: "ucalgary_blockchain_society",
    title: "UCalgary Blockchain Society",
    type: "CPSC",
    tags: ["Blockchain fundamentals", "smart contracts", "dev workshops", "networking"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://suuofc.campuslabs.ca/engage/organization/ucalgary-blockchain-society",
  },
  {
    id: "ucalgary_design_league",
    title: "uCalgary Design League",
    type: "ENG",
    tags: ["CAD", "design thinking", "prototyping", "designathons"],
    effort: "1hr-4hr",
    deadline: "Year-Round",
    why: "https://ucdesignleague.square.site/",
  },
  {
    id: "university_of_calgary_robotics_club",
    title: "University of Calgary Robotics Club",
    type: "ENG",
    tags: ["Robotics", "programming", "building", "teamwork"],
    effort: "2hr-6hr",
    deadline: "Year-Round",
    why: "https://www.ucalgary.ca/active-living/programs/youth-programs/robotics-community-programs",
  },
  {
    id: "unmanned_aerial_vehicles_suav",
    title: "Unmanned Aerial Vehicles (SUAV)",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "uofc_fintech",
    title: "UofC FinTech",
    type: "CPSC",
    tags: ["Fintech projects", "data analysis", "Python", "networking"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://suuofc.campuslabs.ca/engage/organization/fintechcalgary",
  },
  {
    id: "user_experience_design_club_uxdc",
    title: "User Experience Design Club (UXDC)",
    type: "CPSC",
    tags: ["UX/UI", "product design", "prototyping", "user research"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://linktr.ee/uxdc.uofc",
  },
  {
    id: "waybionic",
    title: "WayBionic",
    type: "ENG",
    tags: ["Teamwork", "Communication", "Planning", "Documentation", "Problem Solving", "Git", "Testing", "Python", "C/C++", "Embedded", "SQL", "Data Analysis", "PCB Design", "CAD", "Leadership"],
    effort: "6hr-10hr",
    deadline: "Year-Round",
    why: "helpful, but not mandatory",
  },
  {
    id: "wics_women_in_computer_science",
    title: "WiCS (Women in Computer Science)",
    type: "CPSC",
    tags: ["Networking", "mentorship", "career talks", "community"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://www.instagram.com/wics.uofc/",
  },
  {
    id: "wicys_ucalgary",
    title: "WiCyS @ UCalgary",
    type: "CPSC",
    tags: ["Cybersecurity", "networking", "career development", "workshops"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://www.instagram.com/wicys.uofc/",
  },
  {
    id: "women_in_science_and_engineering_wise",
    title: "Women in Science and Engineering (WISE)",
    type: "ENG",
    tags: ["Mentorship", "professional development", "STEM community"],
    effort: "1hr-3hr",
    deadline: "Year-Round",
    why: "https://www.uofcwise.com/",
  }
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





