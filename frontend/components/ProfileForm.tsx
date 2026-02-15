// frontend/components/profileform.tsx
"use client";

import React from "react";

export default function ProfileForm(props: {
  ACCENT: string;
  SKILLS: string[];
  wantSkills: string[];
  toggleWantSkill: (s: string) => void;

  fullName: string;
  setFullName: (v: string) => void;

  faculty: string;
  setFaculty: (v: string) => void;

  major: string;
  setMajor: (v: string) => void;

  year: string;
  setYear: (v: string) => void;

  majorOptions: string[];
  YEARS: string[];

  Modal: any;
  Btn: any;
  Chip: any;
  Card: any;

  onClose: () => void;
  onSave: () => void;
}) {
  const {
    ACCENT,
    SKILLS,
    wantSkills,
    toggleWantSkill,
    fullName,
    setFullName,
    faculty,
    setFaculty,
    major,
    setMajor,
    year,
    setYear,
    majorOptions,
    YEARS,
    Modal,
    Btn,
    Chip,
    Card,
    onClose,
    onSave,
  } = props;

  return (
    <Modal title="Student Profile" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Column 1: Academics */}
        <Card style={{ background: "rgba(255,255,255,0.04)" }}>
          <h3 style={{ fontSize: 14, color: ACCENT, margin: 0 }}>Academic Info</h3>

          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <input
              type="text"
              placeholder="Full Name"
              className="pw-select"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <select className="pw-select" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
              <option value="Schulich School of Engineering">Schulich School of Engineering</option>
              <option value="Faculty of Science">Faculty of Science</option>
            </select>

            <select className="pw-select" value={major} onChange={(e) => setMajor(e.target.value)}>
              {majorOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select className="pw-select" value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Column 2: Skills */}
        <Card style={{ background: "rgba(255,255,255,0.04)" }}>
          <h3 style={{ fontSize: 14, color: ACCENT, margin: 0 }}>Target Skills</h3>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SKILLS.map((s) => (
              <Chip key={s} label={s} active={wantSkills.includes(s)} onClick={() => toggleWantSkill(s)} />
            ))}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14, textAlign: "right" }}>
        <Btn variant="primary" onClick={onSave}>
          Save Profile Changes
        </Btn>
      </div>
    </Modal>
  );
}

