// src/pages/Questionnaire.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const ADMIN_WA = import.meta.env.VITE_WA_PHONE || "6281234567890";
const BUCKET = "proofs";
const POLICY_KEY = "gurunada_policy_accepted";

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

/* ─── Inline style helpers (brand palette) ──────────── */
const fieldInputStyle = {
  width: "100%",
  borderRadius: 12,
  background: "#fff",
  border: "1.5px solid rgba(39,41,37,0.15)",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  color: "var(--charcoal)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: '"Creato Display", sans-serif',
  boxSizing: "border-box",
};
const fieldSelectStyle = {
  ...fieldInputStyle,
  height: 44,
  cursor: "pointer",
  appearance: "auto",
};
const panelStyle = {
  borderRadius: 20,
  background: "#fff",
  border: "1px solid rgba(209,167,153,0.22)",
  boxShadow: "0 4px 20px rgba(39,41,37,0.07)",
  padding: "1.75rem 2rem",
};
const labelStyle = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "var(--olive)",
  marginBottom: "0.4rem",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const formatIDRDisplay = (n) => {
  const num = Number(n || 0);
  const base = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(num);
  return `Rp ${base},-`;
};

function timeOptions(day) {
  const slots = [];
  let startHour, endHour;
  if (day === "saturday") {
    startHour = 9;
    endHour = 14;
  } else {
    startHour = 13;
    endHour = 18;
  }
  for (let h = startHour; h <= endHour; h++) {
    const hh = String(h).padStart(2, "0");
    slots.push({ value: `${hh}:00`, label: `${hh}:00` });
  }
  return slots;
}

const EXAM_TYPES = ["ABRSM", "LCM", "Trinity", "Other"];
const EXAM_GRADES = ["Preparatory", "1", "2", "3", "4", "5", "6", "7", "8"];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Main form state
  const [form, setForm] = useState({
    // Student
    student_full_name: "",
    student_gender: "male",
    student_dob: "",
    student_age: "",
    student_address: "",
    student_phone: "",
    student_email: "",
    student_instagram: "",

    // Parents
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    parents_email: "",
    parents_instagram: "",

    // Instrument & schedule
    instrument: "Piano",
    preferred_day: "monday",
    preferred_time: "",
    learned_before: "no", // "yes" | "no" (UI)
    learned_duration: "",
    took_exam_before: "no", // "yes" | "no" (UI)
    exam_type: "",
    exam_grade: "",

    // Payment (UI disembunyikan, tetap kirim ke DB)
    teacher_type: "junior",
    amount: "500000",
  });

  // Load auth + cek policy
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return navigate("/auth");
      setUser(data.user);

      // Harus sudah menyetujui OurPolicy di sesi ini
      if (sessionStorage.getItem(POLICY_KEY) !== "true") {
        navigate("/OurPolicy", { replace: true });
      }
    })();
  }, [navigate]);

  // Time options + default time per day
  const timeOpts = useMemo(
    () => timeOptions(form.preferred_day),
    [form.preferred_day],
  );
  useEffect(() => {
    if (
      !form.preferred_time ||
      !timeOpts.some((t) => t.value === form.preferred_time)
    ) {
      setForm((s) => ({ ...s, preferred_time: timeOpts[0]?.value || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.preferred_day, timeOpts]);

  // Auto compute age
  useEffect(() => {
    if (!form.student_dob) return;
    const dob = new Date(form.student_dob);
    if (isNaN(dob)) return;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    setForm((s) => ({ ...s, student_age: String(Math.max(age, 0)) }));
  }, [form.student_dob]);

  // Learned before default/reset
  useEffect(() => {
    if (form.learned_before === "yes" && !form.learned_duration) {
      setForm((s) => ({ ...s, learned_duration: "< 6 months" }));
    }
    if (form.learned_before === "no") {
      setForm((s) => ({
        ...s,
        learned_duration: "",
        took_exam_before: "no",
        exam_type: "",
        exam_grade: "",
      }));
    }
  }, [form.learned_before]);

  // Exam default/reset
  useEffect(() => {
    if (form.took_exam_before === "yes") {
      setForm((s) => ({
        ...s,
        exam_type: s.exam_type || "ABRSM",
        exam_grade: s.exam_grade || "Preparatory",
      }));
    } else {
      setForm((s) => ({ ...s, exam_type: "", exam_grade: "" }));
    }
  }, [form.took_exam_before]);

  // Keep amount fixed 500k
  useEffect(() => {
    setForm((s) => ({ ...s, amount: "500000" }));
  }, [form.teacher_type]);

  const isValid = useMemo(() => {
    const amt = Number(form.amount);
    return (
      !!form.student_full_name &&
      !!form.student_gender &&
      !!form.student_dob &&
      !!form.student_phone &&
      !!form.instrument &&
      !!form.preferred_day &&
      !!form.preferred_time &&
      !!file &&
      Number.isFinite(amt) &&
      amt > 0
    );
  }, [form, file]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return alert("Max file size is 10MB.");
    if (!/(image|pdf)/.test(f.type)) return alert("Only image or PDF allowed.");
    setFile(f);
  };

  async function uploadProof(userId) {
    const ext = file?.name?.split(".").pop() || "dat";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file?.type || "application/octet-stream",
      upsert: false,
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return pub.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard anti double click
    if (!user) return navigate("/auth");
    if (!isValid)
      return alert(
        "Please complete all required fields and upload the proof of payment.",
      );
    const waWindow = window.open("", "_blank");

    setSubmitting(true);
    try {
      const proofUrl = await uploadProof(user.id);

      // Konversi ke boolean + fallback teks '-'
      const learnedYes = form.learned_before === "yes";
      const examYes = form.took_exam_before === "yes";

      const payload = {
        user_id: user.id,

        // Student
        student_full_name: form.student_full_name,
        student_gender: form.student_gender,
        student_dob: form.student_dob,
        student_address: form.student_address || null,
        student_phone: form.student_phone,
        student_email: form.student_email || null,
        student_instagram: form.student_instagram || null,

        // Parents
        father_name: form.father_name || null,
        father_phone: form.father_phone || null,
        mother_name: form.mother_name || null,
        mother_phone: form.mother_phone || null,
        parents_email: form.parents_email || null,
        parents_instagram: form.parents_instagram || null,

        // Instrument & Schedule
        instrument: form.instrument,
        preferred_day: form.preferred_day,
        preferred_time: form.preferred_time,

        // === BOOLEANS ===
        learned_before: learnedYes,
        took_exam_before: examYes,

        // === TEXT dependents: '-' bila tidak relevan ===
        learned_duration: learnedYes ? form.learned_duration : "-",
        exam_type: examYes ? form.exam_type : "-",
        exam_grade: examYes ? form.exam_grade : "-",

        // Payment (disembunyikan di UI)
        teacher_type: "junior",
        amount: 500000,

        // Optional JSON trail
        extra: {
          preferred: { day: form.preferred_day, time: form.preferred_time },
        },
      };

      // 1) insert questionnaire
      const { data: q, error: qErr } = await supabase
        .from("questionnaire")
        .insert([payload])
        .select()
        .single();
      if (qErr) throw qErr;

      // 3) insert payment + TAUTKAN questionnaire_id
      const { error: pErr } = await supabase.from("payments").insert([
        {
          user_id: user.id,
          questionnaire_id: q.id, // atau 'questionare_id' kalau kolommu namanya itu
          amount: 500000,
          proof_url: proofUrl,
          status: "pending",
        },
      ]);
      if (pErr) throw pErr;

      // Redirect WA — pesan registrasi resmi (official template)
      const hasExperience = form.learned_before === "yes";
      const experienceDetail =
        hasExperience && form.exam_grade
          ? `Yes\n*) Most recent exam: ${form.exam_type} Grade ${form.exam_grade}`
          : hasExperience
            ? `Yes\n*) Duration: ${form.learned_duration}`
            : "No";
      const dayLabel =
        form.preferred_day.charAt(0).toUpperCase() +
        form.preferred_day.slice(1);

      const msg =
        `REGISTRATION:\n\n` +
        `Thank you for your registration with Guru Nada. Your information has been received.\n\n` +
        `*Student's Full Name:* ${form.student_full_name}\n` +
        `*Student's Age:* ${form.student_age || "-"}\n` +
        `*Instrument of Interest:* ${form.instrument}\n` +
        `*Any Previous Musical Experience:* ${experienceDetail}\n` +
        `*Preferred Day and Time:* ${dayLabel}, ${form.preferred_time}\n\n` +
        `To complete your registration, please:\n\n` +
        `1. Sign the Parent Agreement: [Insert Link to Agreement]\n` +
        `2. Reply to this chat with your payment confirmation screenshot.\n\n` +
        `Our admin will process your registration and confirm your lesson schedule soon.\n\n` +
        `Thank you,\n` +
        `Guru Nada\n` +
        `www.gurunada.com`;

    waWindow.location.href = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
    navigate("/", { replace: true });

    } catch (err) {
      waWindow?.close();
      console.error(err);
      alert(err.message || "Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--cream)",
        minHeight: "100vh",
        fontFamily: '"Creato Display", sans-serif',
      }}
    >
      {/* Hero header strip */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--charcoal) 0%, var(--olive) 100%)",
          padding: "7rem 2rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(-14deg, transparent 0px, transparent 28px, rgba(209,167,153,0.05) 28px, rgba(209,167,153,0.05) 29px)",
          }}
        />
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--blush)",
              margin: "0 0 0.5rem",
            }}
          >
            Step 2 of 2
          </p>
          <h1
            style={{
              fontFamily: '"Rockdale FREE", serif',
              fontSize: "clamp(1.75rem,4vw,2.5rem)",
              color: "var(--cream)",
              margin: "0 0 0.75rem",
            }}
          >
            Student Registration
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(248,246,237,0.6)",
              maxWidth: "50ch",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            Fill in the information below to help us understand your needs and
            schedule your lessons.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "2.5rem 1.5rem 5rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Student Info */}
          <section style={panelStyle}>
            <h2
              style={{
                fontFamily: '"Rockdale FREE", serif',
                fontSize: "1.15rem",
                color: "var(--olive)",
                margin: "0 0 1.25rem",
                borderBottom: "1px solid rgba(209,167,153,0.2)",
                paddingBottom: "0.75rem",
              }}
            >
              Student Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>Student's Full Name *</label>
                <input
                  name="student_full_name"
                  style={fieldInputStyle}
                  value={form.student_full_name}
                  onChange={onChange}
                  required
                  placeholder="e.g. Anya Putri"
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <select
                  name="student_gender"
                  style={fieldSelectStyle}
                  value={form.student_gender}
                  onChange={onChange}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input
                  type="date"
                  name="student_dob"
                  style={fieldInputStyle}
                  value={form.student_dob}
                  onChange={onChange}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Age (auto-calculated)</label>
                <input
                  readOnly
                  style={{
                    ...fieldInputStyle,
                    background: "var(--cream)",
                    cursor: "default",
                  }}
                  value={form.student_age}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Address</label>
                <input
                  name="student_address"
                  style={fieldInputStyle}
                  value={form.student_address}
                  onChange={onChange}
                  placeholder="e.g. Jakarta Selatan"
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  name="student_phone"
                  style={fieldInputStyle}
                  value={form.student_phone}
                  onChange={onChange}
                  required
                  placeholder="e.g. 08123456789"
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="student_email"
                  style={fieldInputStyle}
                  value={form.student_email}
                  onChange={onChange}
                  placeholder="optional"
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Instagram</label>
                <input
                  name="student_instagram"
                  style={fieldInputStyle}
                  value={form.student_instagram}
                  onChange={onChange}
                  placeholder="@username (optional)"
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
            </div>
          </section>

          {/* Parents */}
          <section style={panelStyle}>
            <h2
              style={{
                fontFamily: '"Rockdale FREE", serif',
                fontSize: "1.15rem",
                color: "var(--olive)",
                margin: "0 0 1.25rem",
                borderBottom: "1px solid rgba(209,167,153,0.2)",
                paddingBottom: "0.75rem",
              }}
            >
              Parents Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>Father's Name</label>
                <input
                  name="father_name"
                  style={fieldInputStyle}
                  value={form.father_name}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Father's Phone</label>
                <input
                  name="father_phone"
                  style={fieldInputStyle}
                  value={form.father_phone}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Mother's Name</label>
                <input
                  name="mother_name"
                  style={fieldInputStyle}
                  value={form.mother_name}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Mother's Phone</label>
                <input
                  name="mother_phone"
                  style={fieldInputStyle}
                  value={form.mother_phone}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Parent's Email</label>
                <input
                  type="email"
                  name="parents_email"
                  style={fieldInputStyle}
                  value={form.parents_email}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Parent's Instagram</label>
                <input
                  name="parents_instagram"
                  style={fieldInputStyle}
                  value={form.parents_instagram}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                />
              </div>
            </div>
          </section>

          {/* Instrument & Schedule */}
          <section style={panelStyle}>
            <h2
              style={{
                fontFamily: '"Rockdale FREE", serif',
                fontSize: "1.15rem",
                color: "var(--olive)",
                margin: "0 0 1.25rem",
                borderBottom: "1px solid rgba(209,167,153,0.2)",
                paddingBottom: "0.75rem",
              }}
            >
              Instrument & Schedule
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                gap: "1.25rem",
                alignItems: "start",
              }}
            >
              <div>
                <label style={labelStyle}>Instrument *</label>
                <select
                  name="instrument"
                  style={fieldSelectStyle}
                  value={form.instrument}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                >
                  {[
                    "Piano",
                    "Violin",
                    "Cello",
                    "Vocal",
                    "Drum/Percussion",
                    "Digital Music Producing",
                  ].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred Day *</label>
                <select
                  name="preferred_day"
                  style={fieldSelectStyle}
                  value={form.preferred_day}
                  onChange={onChange}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred Time *</label>
                <select
                  name="preferred_time"
                  style={fieldSelectStyle}
                  value={form.preferred_time}
                  onChange={onChange}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                >
                  {timeOpts.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94A3B8",
                    marginTop: "0.3rem",
                  }}
                >
                  Mon–Fri: 13:00–18:00 · Sat: 09:00–14:00
                </p>
              </div>
              <div>
                <label style={labelStyle}>Learned Before?</label>
                <select
                  name="learned_before"
                  style={fieldSelectStyle}
                  value={form.learned_before}
                  onChange={onChange}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blush)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {form.learned_before === "yes" && (
                <div>
                  <label style={labelStyle}>If yes, how long?</label>
                  <select
                    name="learned_duration"
                    style={fieldSelectStyle}
                    value={form.learned_duration}
                    onChange={onChange}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--blush)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                    }
                  >
                    <option value="< 6 months">&lt; 6 months</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="> 3 years">&gt; 3 years</option>
                  </select>
                </div>
              )}
              {form.learned_before === "yes" && (
                <>
                  <div>
                    <label style={labelStyle}>Taken an exam before?</label>
                    <select
                      name="took_exam_before"
                      style={fieldSelectStyle}
                      value={form.took_exam_before}
                      onChange={onChange}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--blush)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {form.took_exam_before === "yes" && (
                    <>
                      <div>
                        <label style={labelStyle}>Which Exam?</label>
                        <select
                          name="exam_type"
                          style={fieldSelectStyle}
                          value={form.exam_type}
                          onChange={onChange}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "var(--blush)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                          }
                        >
                          {EXAM_TYPES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Exam Grade</label>
                        <select
                          name="exam_grade"
                          style={fieldSelectStyle}
                          value={form.exam_grade}
                          onChange={onChange}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "var(--blush)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "rgba(39,41,37,0.15)")
                          }
                        >
                          {EXAM_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Payment & Proof */}
          <section style={panelStyle}>
            <h2
              style={{
                fontFamily: '"Rockdale FREE", serif',
                fontSize: "1.15rem",
                color: "var(--olive)",
                margin: "0 0 1.25rem",
                borderBottom: "1px solid rgba(209,167,153,0.2)",
                paddingBottom: "0.75rem",
              }}
            >
              Payment
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                gap: "1.25rem",
                alignItems: "start",
              }}
            >
              <div>
                <label style={labelStyle}>Amount (IDR)</label>
                <input
                  name="amount_display"
                  type="text"
                  style={{
                    ...fieldInputStyle,
                    background: "var(--cream)",
                    cursor: "not-allowed",
                  }}
                  value={formatIDRDisplay(form.amount)}
                  readOnly
                />
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94A3B8",
                    marginTop: "0.3rem",
                  }}
                >
                  Fixed trial class fee.
                </p>
              </div>
              <div>
                <label style={labelStyle}>Upload Payment Proof *</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={onFile}
                  style={{
                    ...fieldInputStyle,
                    padding: "0.5rem",
                    cursor: "pointer",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94A3B8",
                    marginTop: "0.3rem",
                  }}
                >
                  Image or PDF, max 10MB.
                </p>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              paddingTop: "0.5rem",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              title={
                !isValid
                  ? "Please complete all required fields and upload payment proof."
                  : ""
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 3rem",
                borderRadius: "999px",
                background: submitting
                  ? "rgba(39,41,37,0.45)"
                  : "var(--charcoal)",
                color: "var(--cream)",
                border: "none",
                fontFamily: '"Creato Display", sans-serif',
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting
                  ? "none"
                  : "0 8px 24px rgba(39,41,37,0.25)",
                transition: "all 0.2s ease",
                opacity: !isValid ? 0.55 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting && isValid) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(39,41,37,0.35)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = submitting
                  ? "none"
                  : "0 8px 24px rgba(39,41,37,0.25)";
              }}
            >
              {submitting ? "Submitting…" : "Submit Registration"}
              {!submitting && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 16, height: 16 }}
                >
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              )}
            </button>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#94A3B8",
                textAlign: "center",
              }}
            >
              After submitting, you'll be redirected to WhatsApp for
              registration confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
