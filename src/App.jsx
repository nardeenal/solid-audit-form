import { useState } from "react";

const questions = [
  {
    section: "Daily Repetition",
    icon: "â»",
    items: [
      "What's the most repetitive task you do every week?",
      "Where do you find yourself copying information from one place to another?",
      "What do you do manually that feels like it shouldn't be manual?",
    ],
  },
  {
    section: "Time Leaks",
    icon: "â·",
    items: [
      "What task takes you the longest to start because the setup is annoying?",
      "Where does a project slow down the most before reaching the next person?",
      "What's one thing that always falls through the cracks?",
    ],
  },
  {
    section: "Tool Friction",
    icon: "â",
    items: [
      "What apps and tools do you use every single day?",
      "Do any tools feel disconnected â like you wish they just talked to each other?",
      "Where does information get lost or delayed between people?",
    ],
  },
  {
    section: "Dream Fix",
    icon: "â¦",
    items: [
      "If you could make ONE task disappear from your week, what would it be?",
      "If that was fixed, what would you do with that saved time?",
      "Is there anything you've always thought 'there must be a better way to do this'?",
    ],
  },
];

export default function AuditForm() {
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const totalQuestions = questions.reduce((a, s) => a + s.items.length, 0);
  const answered = Object.values(answers).filter((v) => v.trim() !== "").length;
  const progress = Math.round((answered / totalQuestions) * 100);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxt4oGTOPwC98zxTloIHNqDublj__pi-s9sS4MJ4wMbU6UNrnisURCBDPwofjKSYTF/exec";

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);

    const payload = {
      name,
      role,
      timestamp: new Date().toISOString(),
      ...Object.fromEntries(
        questions.flatMap((section, si) =>
          section.items.map((q, qi) => [
            `${section.section} - Q${qi + 1}: ${q}`,
            answers[`${si}-${qi}`] || "",
          ])
        )
      ),
    };

    try {
      const qs = Object.entries(payload)
        .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
        .join("&");
      await fetch(APPS_SCRIPT_URL + "?" + qs, {
        method: "GET",
        mode: "no-cors",
      });
    } catch (e) {
      console.error(e);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.thankYou}>
          <div style={styles.thankIcon}>â¦</div>
          <h2 style={styles.thankTitle}>Thank you, {name}.</h2>
          <p style={styles.thankSub}>
            Your answers will help shape how we work smarter at Solid Design Studio.
            Naridin will review your responses and follow up with you directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus, input:focus { outline: none; border-color: #c9a96e !important; }
        textarea { resize: vertical; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #c9a96e44; border-radius: 2px; }
        .tab:hover { background: #1a1a1a !important; color: #c9a96e !important; }
        .submit-btn:hover { background: #b8924a !important; }
        .answer-card { transition: border-color 0.2s; }
        .answer-card:hover { border-color: #c9a96e44 !important; }
      `}</style>

      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>SOLID</div>
          <div style={styles.headerRight}>
            <div style={styles.progressLabel}>{progress}% complete</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div style={styles.heroText}>
          <span style={styles.eyebrow}>AI Implementation Audit</span>
          <h1 style={styles.title}>
            Where does your <em>time</em> go?
          </h1>
          <p style={styles.subtitle}>
            Help us find the friction. Your answers will directly shape how we automate and improve our workflow.
          </p>
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.identityRow}>
          <div style={styles.field}>
            <label style={styles.label}>Your Name</label>
            <input
              style={styles.input}
              placeholder="e.g. Sara Al-Rashid"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Your Role</label>
            <input
              style={styles.input}
              placeholder="e.g. Graphic Designer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.tabs}>
          {questions.map((s, i) => (
            <button
              key={i}
              className="tab"
              onClick={() => setActiveSection(i)}
              style={{
                ...styles.tab,
                ...(activeSection === i ? styles.tabActive : {}),
              }}
            >
              <span style={styles.tabIcon}>{s.icon}</span>
              {s.section}
            </button>
          ))}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{questions[activeSection].icon}</span>
            <h2 style={styles.sectionTitle}>{questions[activeSection].section}</h2>
          </div>

          {questions[activeSection].items.map((q, qi) => {
            const key = `${activeSection}-${qi}`;
            return (
              <div key={key} className="answer-card" style={styles.card}>
                <label style={styles.questionText}>
                  <span style={styles.qNum}>0{qi + 1}</span>
                  {q}
                </label>
                <textarea
                  style={styles.textarea}
                  placeholder="Write freely â there are no wrong answers here."
                  rows={3}
                  value={answers[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            );
          })}

          <div style={styles.navRow}>
            {activeSection > 0 && (
              <button style={styles.navBtn} onClick={() => setActiveSection((p) => p - 1)}>
                â Previous
              </button>
            )}
            {activeSection < questions.length - 1 ? (
              <button
                style={{ ...styles.navBtn, ...styles.navBtnNext }}
                onClick={() => setActiveSection((p) => p + 1)}
              >
                Next â
              </button>
            ) : (
              <button
                className="submit-btn"
                style={styles.submitBtn}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Submit Audit â¦"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#e8e0d4" },
  header: { background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)", borderBottom: "1px solid #1e1e1e", paddingBottom: "40px" },
  headerInner: { maxWidth: "760px", margin: "0 auto", padding: "28px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontFamily: "'DM Sans', sans-serif", fontWeight: "700", fontSize: "22px", letterSpacing: "6px", color: "#fff" },
  headerRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
  progressLabel: { fontSize: "11px", color: "#c9a96e", letterSpacing: "1px", textTransform: "uppercase" },
  progressBar: { width: "120px", height: "2px", background: "#1e1e1e", borderRadius: "2px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#c9a96e", borderRadius: "2px", transition: "width 0.4s ease" },
  heroText: { maxWidth: "760px", margin: "0 auto", padding: "48px 24px 0" },
  eyebrow: { fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#c9a96e", display: "block", marginBottom: "16px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "400", lineHeight: "1.15", color: "#fff", marginBottom: "16px" },
  subtitle: { fontSize: "15px", color: "#888", lineHeight: "1.7", maxWidth: "520px", fontWeight: "300" },
  body: { maxWidth: "760px", margin: "0 auto", padding: "40px 24px 80px" },
  identityRow: { display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap" },
  field: { flex: "1", minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#666" },
  input: { background: "#111", border: "1px solid #1e1e1e", borderRadius: "6px", padding: "12px 16px", color: "#e8e0d4", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" },
  tabs: { display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" },
  tab: { background: "transparent", border: "1px solid #1e1e1e", borderRadius: "100px", padding: "8px 18px", color: "#555", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s", letterSpacing: "0.5px" },
  tabActive: { background: "#1a1a1a", border: "1px solid #c9a96e44", color: "#c9a96e" },
  tabIcon: { fontSize: "14px" },
  section: { display: "flex", flexDirection: "column", gap: "16px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  sectionIcon: { fontSize: "24px", color: "#c9a96e" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "400", color: "#fff" },
  card: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  questionText: { fontSize: "14px", color: "#ccc", lineHeight: "1.6", display: "flex", gap: "12px", alignItems: "flex-start", fontWeight: "400" },
  qNum: { color: "#c9a96e", fontSize: "11px", fontWeight: "500", letterSpacing: "1px", marginTop: "2px", minWidth: "20px" },
  textarea: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "12px 14px", color: "#e8e0d4", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6", fontWeight: "300", transition: "border-color 0.2s" },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: "8px" },
  navBtn: { background: "transparent", border: "1px solid #1e1e1e", borderRadius: "6px", padding: "10px 20px", color: "#666", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  navBtnNext: { marginLeft: "auto", color: "#c9a96e", borderColor: "#c9a96e44" },
  submitBtn: { marginLeft: "auto", background: "#c9a96e", border: "none", borderRadius: "6px", padding: "12px 28px", color: "#0a0a0a", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: "600", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.2s" },
  thankYou: { maxWidth: "480px", margin: "20vh auto", padding: "0 24px", textAlign: "center" },
  thankIcon: { fontSize: "40px", color: "#c9a96e", marginBottom: "24px" },
  thankTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "400", color: "#fff", marginBottom: "16px" },
  thankSub: { fontSize: "15px", color: "#666", lineHeight: "1.8", fontWeight: "300" },
};
