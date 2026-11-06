"use client";
import { useEffect, useState } from "react";

const blank = {
  experience: { role: "", company: "", location: "", start: "", end: "", bullets: "" },
  education: { degree: "", school: "", year: "", grade: "" },
  projects: { name: "", tech: "", bullets: "" },
};
const initial = {
  name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "",
  summary: "", skills: "",
  experience: [{ ...blank.experience }],
  education: [{ ...blank.education }],
  projects: [{ ...blank.projects }],
};

function Field({ label, value, onChange, area, placeholder }) {
  const Tag = area ? "textarea" : "input";
  return (
    <label className="field">
      <span>{label}</span>
      <Tag value={value} placeholder={placeholder} rows={area ? 4 : undefined} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

const lines = (t) => t.split("\n").map((s) => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

export default function Page() {
  const [d, setD] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem("resume"); if (s) setD(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem("resume", JSON.stringify(d)); } catch {}
  }, [d, ready]);

  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const setItem = (list, i, k, v) =>
    setD((p) => ({ ...p, [list]: p[list].map((it, n) => (n === i ? { ...it, [k]: v } : it)) }));
  const add = (list) => setD((p) => ({ ...p, [list]: [...p[list], { ...blank[list] }] }));
  const remove = (list, i) => setD((p) => ({ ...p, [list]: p[list].filter((_, n) => n !== i) }));

  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean).join(" | ");
  const skills = d.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const exp = d.experience.filter((e) => e.role || e.company);
  const edu = d.education.filter((e) => e.degree || e.school);
  const prj = d.projects.filter((p) => p.name);

  return (
    <main>
      <section className="panel no-print">
        <header className="hero">
          <h1>RESUME<br />BUILDER</h1>
          <p>Fill in the details. Get a clean, single-column, ATS-friendly resume.</p>
        </header>

        <div className="card">
          <h2>Personal</h2>
          <Field label="Full name" value={d.name} onChange={(v) => set("name", v)} />
          <Field label="Job title" value={d.title} onChange={(v) => set("title", v)} />
          <div className="row">
            <Field label="Email" value={d.email} onChange={(v) => set("email", v)} />
            <Field label="Phone" value={d.phone} onChange={(v) => set("phone", v)} />
          </div>
          <Field label="Location" value={d.location} onChange={(v) => set("location", v)} />
          <div className="row">
            <Field label="LinkedIn" value={d.linkedin} onChange={(v) => set("linkedin", v)} />
            <Field label="GitHub / Portfolio" value={d.github} onChange={(v) => set("github", v)} />
          </div>
        </div>

        <div className="card">
          <h2>Summary</h2>
          <Field area label="2–3 lines about you" value={d.summary} onChange={(v) => set("summary", v)} />
        </div>

        <div className="card">
          <h2>Skills</h2>
          <Field area label="Comma separated" placeholder="Java, Python, Django, SQL" value={d.skills} onChange={(v) => set("skills", v)} />
        </div>

        <div className="card">
          <h2>Experience</h2>
          {d.experience.map((e, i) => (
            <div className="item" key={i}>
              <div className="row">
                <Field label="Role" value={e.role} onChange={(v) => setItem("experience", i, "role", v)} />
                <Field label="Company" value={e.company} onChange={(v) => setItem("experience", i, "company", v)} />
              </div>
              <div className="row">
                <Field label="Start" placeholder="Jun 2024" value={e.start} onChange={(v) => setItem("experience", i, "start", v)} />
                <Field label="End" placeholder="Present" value={e.end} onChange={(v) => setItem("experience", i, "end", v)} />
              </div>
              <Field label="Location" value={e.location} onChange={(v) => setItem("experience", i, "location", v)} />
              <Field area label="Achievements (one per line)" value={e.bullets} onChange={(v) => setItem("experience", i, "bullets", v)} />
              {d.experience.length > 1 && <button className="ghost" onClick={() => remove("experience", i)}>Remove</button>}
            </div>
          ))}
          <button className="ghost" onClick={() => add("experience")}>+ Add experience</button>
        </div>

        <div className="card">
          <h2>Projects</h2>
          {d.projects.map((p, i) => (
            <div className="item" key={i}>
              <div className="row">
                <Field label="Project name" value={p.name} onChange={(v) => setItem("projects", i, "name", v)} />
                <Field label="Tech used" value={p.tech} onChange={(v) => setItem("projects", i, "tech", v)} />
              </div>
              <Field area label="Details (one per line)" value={p.bullets} onChange={(v) => setItem("projects", i, "bullets", v)} />
              {d.projects.length > 1 && <button className="ghost" onClick={() => remove("projects", i)}>Remove</button>}
            </div>
          ))}
          <button className="ghost" onClick={() => add("projects")}>+ Add project</button>
        </div>

        <div className="card">
          <h2>Education</h2>
          {d.education.map((e, i) => (
            <div className="item" key={i}>
              <div className="row">
                <Field label="Degree" value={e.degree} onChange={(v) => setItem("education", i, "degree", v)} />
                <Field label="School / College" value={e.school} onChange={(v) => setItem("education", i, "school", v)} />
              </div>
              <div className="row">
                <Field label="Year" value={e.year} onChange={(v) => setItem("education", i, "year", v)} />
                <Field label="Grade / CGPA" value={e.grade} onChange={(v) => setItem("education", i, "grade", v)} />
              </div>
              {d.education.length > 1 && <button className="ghost" onClick={() => remove("education", i)}>Remove</button>}
            </div>
          ))}
          <button className="ghost" onClick={() => add("education")}>+ Add education</button>
        </div>

        <button className="primary" onClick={() => window.print()}>DOWNLOAD PDF</button>
      </section>

      <section className="preview">
        <article className="paper">
          <h1>{d.name || "Your Name"}</h1>
          {d.title && <p className="role">{d.title}</p>}
          {contact && <p className="contact">{contact}</p>}

          {d.summary && (<><h2>Professional Summary</h2><p>{d.summary}</p></>)}
          {skills.length > 0 && (<><h2>Skills</h2><p>{skills.join(", ")}</p></>)}

          {exp.length > 0 && <h2>Work Experience</h2>}
          {exp.map((e, i) => (
            <div key={i} className="entry">
              <p><b>{e.role}</b>{e.company && `, ${e.company}`}{e.location && `, ${e.location}`}</p>
              {(e.start || e.end) && <p className="dates">{e.start} – {e.end || "Present"}</p>}
              <ul>{lines(e.bullets).map((b, n) => <li key={n}>{b}</li>)}</ul>
            </div>
          ))}

          {prj.length > 0 && <h2>Projects</h2>}
          {prj.map((p, i) => (
            <div key={i} className="entry">
              <p><b>{p.name}</b>{p.tech && ` | ${p.tech}`}</p>
              <ul>{lines(p.bullets).map((b, n) => <li key={n}>{b}</li>)}</ul>
            </div>
          ))}

          {edu.length > 0 && <h2>Education</h2>}
          {edu.map((e, i) => (
            <div key={i} className="entry">
              <p><b>{e.degree}</b>{e.school && `, ${e.school}`}</p>
              <p className="dates">{[e.year, e.grade && `Grade: ${e.grade}`].filter(Boolean).join(" | ")}</p>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
