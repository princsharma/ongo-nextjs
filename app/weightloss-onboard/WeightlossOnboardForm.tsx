"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./wlf.css";
import StripePayment from "./StripePayment";
import {
  type Form,
  type ScreenId,
  initialForm,
  noBackScreens,
} from "./schema";
import {
  ALCOHOL_FREQUENCY,
  BARIATRIC_PROCEDURES,
  ETHNICITIES,
  EXERCISE_DAYS,
  FAST_FOOD_PER_WEEK,
  GLP_EXPERIENCE,
  GLP_MEDICATIONS,
  INSPIRATIONS,
  MEALS_PER_DAY,
  MEDICATION_ADDONS,
  MEDICATION_DOSES,
  NO_YES,
  NO_YES_UNSURE,
  OTHER_CONDITIONS,
  PAST_METHODS,
  PLANS,
  PLAN_BENEFITS,
  RECREATIONAL_DRUGS,
  SAFETY_TREATMENTS,
  SEX_OPTIONS,
  SLEEP_HOURS,
  SLOTS,
  STRUGGLE_DURATIONS,
  SUGARY_DRINKS_PER_WEEK,
  type GlpMedication,
  WATER_INTAKE,
  WEIGHT_DIAGNOSES,
  WEIGHT_GOALS,
  YES_NO,
} from "./data";

type RadioProps = {
  options: readonly string[];
  value: string;
  onSelect: (v: string) => void;
};

function Radio({ options, value, onSelect }: RadioProps) {
  return (
    <div className="opts">
      {options.map((o) => (
        <div
          key={o}
          className={`opt radio ${value === o ? "sel" : ""}`}
          onClick={() => onSelect(o)}
        >
          <span className="chk" />
          {o}
        </div>
      ))}
    </div>
  );
}

type MultiProps = {
  options: readonly string[];
  values: string[];
  onToggle: (v: string) => void;
};

function Multi({ options, values, onToggle }: MultiProps) {
  return (
    <div className="opts">
      {options.map((o) => (
        <div
          key={o}
          className={`opt ${values.includes(o) ? "sel" : ""}`}
          onClick={() => onToggle(o)}
        >
          <span className="chk">✓</span>
          {o}
        </div>
      ))}
    </div>
  );
}

function BmiGauge({ bmi, category }: { bmi: number | null; category: string | null }) {
  const cx = 200;
  const cy = 200;
  const r = 160;
  const min = 15;
  const max = 40;
  const v = bmi == null ? min : Math.max(min, Math.min(max, bmi));
  const t = (v - min) / (max - min);
  const arcLength = Math.PI * r;
  const filledLength = arcLength * t;
  const tickCount = 14;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tt = i / (tickCount - 1);
    const a = Math.PI * tt;
    const r1 = r + 14;
    const r2 = r + 22;
    return {
      x1: cx - r1 * Math.cos(a),
      y1: cy - r1 * Math.sin(a),
      x2: cx - r2 * Math.cos(a),
      y2: cy - r2 * Math.sin(a),
    };
  });
  const fullPath = `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`;
  const markerRotation = t * 180;

  return (
    <div className="bmi-gauge-wrap">
      <svg viewBox="0 0 400 240" className="bmi-gauge">
        <path
          d={fullPath}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d={fullPath}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength - filledLength}
          style={{
            transition: "stroke-dashoffset .55s cubic-bezier(.22,.61,.36,1)",
            opacity: bmi == null ? 0 : 1,
          }}
        />
        {ticks.map((tk, i) => (
          <line
            key={i}
            x1={tk.x1}
            y1={tk.y1}
            x2={tk.x2}
            y2={tk.y2}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
          />
        ))}
        <g
          style={{
            transform: `rotate(${markerRotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform .55s cubic-bezier(.22,.61,.36,1)",
            opacity: bmi == null ? 0 : 1,
          }}
        >
          <circle cx={cx - r} cy={cy} r="10" fill="#1a1a1a" stroke="#fff" strokeWidth="3" />
        </g>
      </svg>
      <div className="bmi-gauge-text">
        <div className="bmi-gauge-eyebrow">YOUR BMI</div>
        <div className="bmi-gauge-value">{bmi != null ? bmi.toFixed(1) : "—"}</div>
        <div className="bmi-gauge-cat">{category ? category.toUpperCase() : ""}</div>
      </div>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isValidEmail = (e: string) => EMAIL_RE.test(e.trim());
const isValidName = (n: string) => n.trim().length >= 2;
const isValidPhone = (p: string) => p.replace(/\D/g, "").length >= 10;

function Select({
  value,
  onChange,
  placeholder,
  options,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
  style?: React.CSSProperties;
}) {
  return (
    <select
      className="inp"
      style={style}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

export default function WeightlossOnboardForm() {
  const [screen, setScreen] = useState<ScreenId>("s1");
  const [form, setForm] = useState<Form>(initialForm);
  const historyRef = useRef<ScreenId[]>([]);
  const fwRef = useRef<HTMLDivElement | null>(null);

  const goTo = (next: ScreenId) => {
    historyRef.current.push(screen);
    setScreen(next);
  };

  const back = () => {
    const prev = historyRef.current.pop();
    if (prev) setScreen(prev);
  };

  useEffect(() => {
    if (fwRef.current) fwRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const upd = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggle = <K extends keyof Form>(k: K, val: string) =>
    setForm((f) => {
      const arr = f[k] as string[];
      const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
      return { ...f, [k]: next as Form[K] };
    });

  const toggleExclusive = <K extends keyof Form>(k: K, val: string, noneVal: string) =>
    setForm((f) => {
      const arr = f[k] as string[];
      let next: string[];
      if (val === noneVal) {
        next = arr.includes(noneVal) ? [] : [noneVal];
      } else {
        const without = arr.filter((x) => x !== val && x !== noneVal);
        next = arr.includes(val) ? without : [...without, val];
      }
      return { ...f, [k]: next as Form[K] };
    });

  const bmi = useMemo(() => {
    if (form.bmiUnit === "imperial") {
      const ft = parseFloat(form.heightFt) || 0;
      const inch = parseFloat(form.heightIn) || 0;
      const lbs = parseFloat(form.weightLbs) || 0;
      if (ft <= 0 || lbs <= 0) return null;
      const ti = ft * 12 + inch;
      if (ti <= 0) return null;
      return (lbs * 703) / (ti * ti);
    }
    const cm = parseFloat(form.heightCm) || 0;
    const kg = parseFloat(form.weightKg) || 0;
    if (cm <= 0 || kg <= 0) return null;
    const m = cm / 100;
    return kg / (m * m);
  }, [form.bmiUnit, form.heightFt, form.heightIn, form.weightLbs, form.heightCm, form.weightKg]);

  const bmiError = useMemo(() => {
    if (form.bmiUnit === "imperial") {
      const ft = parseFloat(form.heightFt);
      const inch = parseFloat(form.heightIn) || 0;
      const lbs = parseFloat(form.weightLbs);
      if (form.heightFt && ft < 2) return "Height must be at least 2 feet.";
      if (form.heightFt && (ft > 9 || (ft === 9 && inch > 0))) return "Height must be 9 feet or less.";
      if (form.heightIn && (inch < 0 || inch > 11)) return "Inches must be between 0 and 11.";
      if (form.weightLbs && lbs > 1100) return "Weight must be 1100 lbs or less.";
      return null;
    }
    const cm = parseFloat(form.heightCm);
    const kg = parseFloat(form.weightKg);
    if (form.heightCm && cm < 61) return "Height must be at least 61 cm (2 ft).";
    if (form.heightCm && cm > 274) return "Height must be 274 cm (9 ft) or less.";
    if (form.weightKg && kg > 500) return "Weight must be 500 kg or less.";
    return null;
  }, [form.bmiUnit, form.heightFt, form.heightIn, form.weightLbs, form.heightCm, form.weightKg]);

  const setBmiUnit = (next: "metric" | "imperial") => {
    if (next === form.bmiUnit) return;
    setForm((f) => {
      const updated = { ...f, bmiUnit: next };
      if (next === "metric") {
        const ft = parseFloat(f.heightFt) || 0;
        const inch = parseFloat(f.heightIn) || 0;
        const lbs = parseFloat(f.weightLbs) || 0;
        if (ft || inch) updated.heightCm = String(Math.round((ft * 12 + inch) * 2.54));
        if (lbs) updated.weightKg = String(Math.round(lbs / 2.20462));
      } else {
        const cm = parseFloat(f.heightCm) || 0;
        const kg = parseFloat(f.weightKg) || 0;
        if (cm) {
          const totalIn = cm / 2.54;
          const ft = Math.floor(totalIn / 12);
          updated.heightFt = String(ft);
          updated.heightIn = String(Math.round(totalIn - ft * 12));
        }
        if (kg) updated.weightLbs = String(Math.round(kg * 2.20462));
      }
      return updated;
    });
  };

  const bmiCategory = (b: number | null) => {
    if (b == null) return null;
    if (b < 18.5) return "under";
    if (b < 25) return "healthy";
    if (b < 30) return "over";
    return "obese";
  };

  const eligibilityText = (b: number | null) => {
    if (b == null) return "Enter your details";
    if (b >= 30) return "Likely qualifies";
    if (b >= 27) return "May qualify";
    return "Unlikely to qualify";
  };

  const bmiCategoryNow = bmiCategory(bmi);

  const logSubmission = (next: ScreenId, label: string) => {
    console.log(label, form);
    goTo(next);
  };

  const submit = () => logSubmission("sPlan", "Weight loss onboarding submission");

  const selectedPlan = PLANS.find((p) => p.id === form.plan);

  const emailOk = isValidEmail(form.email) && form.consentH && form.consentT;
  const profileOk =
    isValidName(form.firstName) &&
    isValidName(form.lastName) &&
    isValidPhone(form.phone);

  return (
    <div className="wlf-root">
      <div className="wlf-page">
        <div className="fw" ref={fwRef}>
          <div className="hdr">
            <button
              type="button"
              className={`back-btn ${noBackScreens.has(screen) ? "hide" : ""}`}
              onClick={back}
              aria-label="Go back"
            >
              ← Back
            </button>
            <div className="logo">
              <em>Ongo</em> Weight Loss
            </div>
            <a className="contact-link" href="tel:+18885550123">
              <span className="contact-icon" aria-hidden>📞</span>
              <span className="contact-num">1 (888) 555-0123</span>
            </a>
          </div>

          {screen === "s1" && (
            <div className="sc">
              <div className="q">How much weight would you like to lose?</div>
              <Radio
                options={WEIGHT_GOALS}
                value={form.s1}
                onSelect={(v) => upd("s1", v)}
              />
              <div className="acct">
                Already have an account? <a href="#">Log in</a>
              </div>
              <button
                type="button"
                className="cta"
                disabled={!form.s1}
                onClick={() => goTo("s2")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s2" && (
            <div className="sc">
              <div className="q">What&apos;s making you want to start now?</div>
              <div className="qs">Select all that apply.</div>
              <Multi
                options={INSPIRATIONS}
                values={form.s2}
                onToggle={(v) => toggle("s2", v)}
              />
              <div className="acct">
                Already have an account? <a href="#">Log in</a>
              </div>
              <button
                type="button"
                className="cta"
                disabled={form.s2.length === 0}
                onClick={() => goTo("s3")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s3" && (
            <div className="sc">
              <div className="q">What is your current height and weight?</div>
              <div className="acct" style={{ textAlign: "left", margin: "0 0 16px" }}>
                Already have an account? <a href="#">Log in</a>
              </div>

              <div className="unit-toggle">
                <button
                  type="button"
                  className={form.bmiUnit === "metric" ? "active" : ""}
                  onClick={() => setBmiUnit("metric")}
                >
                  Metric
                </button>
                <button
                  type="button"
                  className={form.bmiUnit === "imperial" ? "active" : ""}
                  onClick={() => setBmiUnit("imperial")}
                >
                  Imperial
                </button>
              </div>

              {form.bmiUnit === "metric" ? (
                <>
                  <div className="r2">
                    <input
                      className="inp"
                      style={{ margin: 0 }}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={500}
                      placeholder="Weight (kg)"
                      value={form.weightKg}
                      onChange={(e) => upd("weightKg", e.target.value)}
                    />
                    <input
                      className="inp"
                      style={{ margin: 0 }}
                      type="number"
                      inputMode="numeric"
                      min={61}
                      max={274}
                      placeholder="Height (cm)"
                      value={form.heightCm}
                      onChange={(e) => upd("heightCm", e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="r2">
                    <input
                      className="inp"
                      style={{ margin: 0 }}
                      type="number"
                      inputMode="numeric"
                      min={2}
                      max={9}
                      placeholder="Height (feet)"
                      value={form.heightFt}
                      onChange={(e) => upd("heightFt", e.target.value)}
                    />
                    <input
                      className="inp"
                      style={{ margin: 0 }}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={11}
                      placeholder="Height (inches)"
                      value={form.heightIn}
                      onChange={(e) => upd("heightIn", e.target.value)}
                    />
                  </div>
                  <input
                    className="inp"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={1100}
                    placeholder="Weight (pounds)"
                    value={form.weightLbs}
                    onChange={(e) => upd("weightLbs", e.target.value)}
                  />
                </>
              )}

              {bmiError && <div className="field-err">{bmiError}</div>}

              <BmiGauge bmi={bmiError ? null : bmi} category={bmiError ? null : bmiCategoryNow} />

              {bmi !== null && !bmiError && (
                <div className="bmi-pill" style={{ textAlign: "center" }}>
                  {eligibilityText(bmi)}
                </div>
              )}

              <div className="cat-row">
                {[
                  { key: "under", name: "UNDER", range: "< 18.5" },
                  { key: "healthy", name: "HEALTHY", range: "18.5 — 24.9" },
                  { key: "over", name: "OVER", range: "25 — 29.9" },
                  { key: "obese", name: "OBESE", range: "≥ 30" },
                ].map((c) => (
                  <div
                    key={c.key}
                    className={`cat-card ${bmiCategoryNow === c.key ? "active" : ""}`}
                  >
                    <div className="cat-name">{c.name}</div>
                    <div className="cat-range">{c.range}</div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="cta"
                disabled={bmi === null || bmiError !== null}
                onClick={() => goTo("iGood")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "iGood" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic center">
                <div className="ic-body">
                  <div className="ititle">Good news!</div>
                  <div className="ibody">
                    Based on this info, <strong>you may be eligible</strong> for GLP-1
                    treatment. Let&apos;s find the best option for your goals.
                  </div>
                </div>
                <button type="button" className="icta" onClick={() => goTo("s20")}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {screen === "iRoad" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic center">
                <div className="ic-body">
                  <div className="ititle" style={{ fontSize: 27, marginBottom: 8 }}>
                    Great! Now a few questions
                  </div>
                  <div className="ibody" style={{ fontSize: 14, marginBottom: 22 }}>
                    First, answer health questions and see your treatment options.
                  </div>
                  <div className="rm">
                    <div className="rms">
                      <div className="rmi a">♥</div>
                      <div className="rmt">
                        <div className="rmlab">Health history and treatment options</div>
                        <span className="rmpill">3–4 minutes</span>
                      </div>
                    </div>
                    <div className="rms">
                      <div className="rmi i">📅</div>
                      <div className="rmt">
                        <div className="rmlab d">Book your consultation</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" className="icta" onClick={() => goTo("s4")}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {screen === "s4" && (
            <div className="sc">
              <div className="slabel">Weight history</div>
              <div className="q">Can you share a little about your weight journey so far?</div>
              <div className="qs">This helps your doctor understand your journey.</div>
              <div className="r2">
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="number"
                  inputMode="numeric"
                  placeholder="Highest adult weight (lbs)"
                  value={form.wtHigh}
                  onChange={(e) => upd("wtHigh", e.target.value)}
                />
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="number"
                  inputMode="numeric"
                  placeholder="Lowest weight, past 5 yrs (lbs)"
                  value={form.wtLow}
                  onChange={(e) => upd("wtLow", e.target.value)}
                />
              </div>
              <input
                className="inp"
                type="number"
                inputMode="numeric"
                placeholder="Goal weight (lbs)"
                value={form.wtGoal}
                onChange={(e) => upd("wtGoal", e.target.value)}
              />
              <input
                className="inp"
                type="number"
                inputMode="numeric"
                placeholder="Waist circumference (inches) — optional"
                value={form.waist}
                onChange={(e) => upd("waist", e.target.value)}
              />
              <button type="button" className="cta" onClick={() => goTo("s5")}>
                Continue
              </button>
            </div>
          )}

          {screen === "s5" && (
            <div className="sc">
              <div className="slabel">Weight history</div>
              <div className="q">How long has your weight been a concern for you?</div>
              <Radio
                options={STRUGGLE_DURATIONS}
                value={form.s5}
                onSelect={(v) => upd("s5", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s5}
                onClick={() => goTo("s6")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s6" && (
            <div className="sc">
              <div className="slabel">Weight history</div>
              <div className="q">What have you tried before to lose weight?</div>
              <div className="qs">Select all that apply.</div>
              <Multi
                options={PAST_METHODS}
                values={form.s6}
                onToggle={(v) => toggle("s6", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s6.length === 0}
                onClick={() => goTo("s7")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">Have you taken any GLP-1 medications before or are you taking one now?</div>
              <Radio
                options={YES_NO}
                value={form.s7}
                onSelect={(v) => upd("s7", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s7}
                onClick={() => goTo(form.s7 === "Yes" ? "s7m" : "s7e")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7a" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">How was your experience with GLP-1 medications?</div>
              <Radio
                options={GLP_EXPERIENCE}
                value={form.glpExperience}
                onSelect={(v) => upd("glpExperience", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.glpExperience}
                onClick={() => goTo("s7c")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7m" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">Which GLP-1 medication have you used or currently using?</div>
              <Radio
                options={GLP_MEDICATIONS}
                value={form.glpMed}
                onSelect={(v) => {
                  if (v !== form.glpMed) upd("glpDose", "");
                  upd("glpMed", v);
                }}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.glpMed}
                onClick={() => goTo("s7b")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7b" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">
                What dose of {form.glpMed} are you taking or have you taken?
              </div>
              <Radio
                options={MEDICATION_DOSES[form.glpMed as GlpMedication] ?? []}
                value={form.glpDose}
                onSelect={(v) => upd("glpDose", v)}
              />
              <div className="qs">
                Please share how many units of medication you are drawing up with each injection,
                and how often you inject.
              </div>
              <textarea
                className="inp"
                placeholder="Please specify"
                value={form.glpDoseDetails ?? ""}
                onChange={(e) => upd("glpDoseDetails", e.target.value)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.glpDose}
                onClick={() => goTo("s7a")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7c" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">What was the date of your last injection (Month/Day/Year)?</div>
              <input
                className="inp"
                type="date"
                value={form.glpLastInjection ?? ""}
                onChange={(e) => upd("glpLastInjection", e.target.value)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.glpLastInjection}
                onClick={() => goTo("s7d")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7d" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q" style={{ fontSize: 17, fontWeight: 600 }}>
                 If you have a photo of your current medication or prescription, you can upload it here.
                  Please make sure your name and dosing details are visible.
              </div>
              <label className="cta2 upload-btn">
                ⬆ Upload file
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => upd("vialPhotoName", e.target.files?.[0]?.name ?? "")}
                />
              </label>
              {form.vialPhotoName && (
                <div className="upload-name">✓ {form.vialPhotoName}</div>
              )}
              <button type="button" className="cta" onClick={() => goTo("s7e")}>
                Continue
              </button>
            </div>
          )}

          {screen === "s7e" && (
            <div className="sc">
              <div className="q">ID Upload</div>
              <div className="qs">
                Please upload a government-issued photo ID
              </div>
              <div className="id-illus" aria-hidden>🪪</div>
              <div className="tips-card">
                <div className="tips-title">Tips for a good photo</div>
                <div className="tips-item">✓ Clearly shows your entire ID</div>
                <div className="tips-item">✓ Is not cropped, blurry, or dark</div>
                <div className="tips-note">
                  🔒 Your photos will not be shared with anyone except your healthcare team.
                </div>
              </div>
              {form.photoIdName && (
                <div className="upload-name">✓ {form.photoIdName}</div>
              )}
              <div className="id-actions">
                <label className="cta2 id-btn">
                  Select photo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => upd("photoIdName", e.target.files?.[0]?.name ?? "")}
                  />
                </label>
                <label className="cta cta-cap id-btn">
                  Take photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={(e) => upd("photoIdName", e.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </div>
              <button
                type="button"
                className="cta"
                disabled={!form.photoIdName}
                onClick={() => goTo("s9")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s9" && (
            <div className="sc">
              <div className="slabel">Weight history</div>
              <div className="q">Have you had any weight loss surgery in the past?</div>
              <div className="qs">Select all that apply.</div>
              <Multi
                options={BARIATRIC_PROCEDURES}
                values={form.s9}
                onToggle={(v) => toggleExclusive("s9", v, "None of these")}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s9.length === 0}
                onClick={() =>
                  goTo(
                    form.s9.some((p) => p !== "None of these") ? "s9b" : "s10"
                  )
                }
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s9b" && (() => {
            const procs = form.s9.filter((p) => p !== "None of these");
            const lower = procs.map((p) => p.toLowerCase());
            const list =
              lower.length <= 1
                ? lower[0] ?? ""
                : lower.length === 2
                ? `${lower[0]} and ${lower[1]}`
                : `${lower.slice(0, -1).join(", ")}, and ${lower[lower.length - 1]}`;
            const word = procs.length > 1 ? "surgeries" : "surgery";
            return (
              <div className="sc">
                <div className="q">
                  When was your {list} {word}?
                </div>
                <textarea
                  className="inp"
                  value={form.bariDate ?? ""}
                  onChange={(e) => upd("bariDate", e.target.value)}
                />
                <button
                  type="button"
                  className="cta"
                  disabled={!form.bariDate.trim()}
                  onClick={() => goTo("s10")}
                >
                  Continue
                </button>
              </div>
            );
          })()}

          {screen === "s10" && (
            <div className="sc">
              <div className="slabel">Medical history</div>
              <div className="q">
                Have you been diagnosed with any of these health conditions?
              </div>
              <div className="qs">
                Select all that apply.
              </div>
              <Multi
                options={WEIGHT_DIAGNOSES}
                values={form.s10}
                onToggle={(v) => toggleExclusive("s10", v, "None of the above")}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s10.length === 0}
                onClick={() => goTo("s11")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s11" && (
            <div className="sc">
              <div className="slabel">Medical history</div>
              <div className="q">Do you have any other health conditions we should know about?</div>
              <div className="qs">Select all that apply.</div>
              <Multi
                options={OTHER_CONDITIONS}
                values={form.s11}
                onToggle={(v) => toggleExclusive("s11", v, "None")}
              />
              <input
                className="inp"
                type="text"
                placeholder="Any other conditions? (optional)"
                value={form.s11Other}
                onChange={(e) => upd("s11Other", e.target.value)}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s11.length === 0}
                onClick={() => goTo("s12")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s12" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">Are you currently dealing with any of the following?</div>
              <div className="qs">
                Select all that apply.
              </div>
              <Multi
                options={SAFETY_TREATMENTS}
                values={form.s12}
                onToggle={(v) => toggleExclusive("s12", v, "None")}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s12.length === 0}
                onClick={() => goTo("s13")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s13" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">
                Have you or a close family member had medullary thyroid cancer or MEN2 syndrome?
              </div>
              <Radio
                options={NO_YES_UNSURE}
                value={form.s13}
                onSelect={(v) => upd("s13", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s13}
                onClick={() => goTo(form.s13 === "Yes" ? "dHard" : "s13a")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s13a" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">What was your sex assigned at birth?</div>
              <Radio
                options={SEX_OPTIONS}
                value={form.sexAtBirth}
                onSelect={(v) => upd("sexAtBirth", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.sexAtBirth}
                onClick={() => goTo(form.sexAtBirth === "Male" ? "s15" : "s14")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s14" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">Are you pregnant, planning to become pregnant, or breastfeeding?</div>
              <Radio
                options={NO_YES}
                value={form.s14}
                onSelect={(v) => upd("s14", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s14}
                onClick={() => goTo(form.s14 === "Yes" ? "s14b" : "s15")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s14b" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q consent-warn">
                By selecting &ldquo;I Understand&rdquo; you understand that any prescribed treatment
                must be discontinued prior to attempting pregnancy, becoming pregnant, or upon
                beginning breastfeeding.
              </div>
              <div className="opts" style={{ gap: 7 }}>
                <label
                  className={`opt consent ${form.pregnancyConsent ? "sel" : ""}`}
                  onClick={() => upd("pregnancyConsent", !form.pregnancyConsent)}
                >
                  <span className="chk">✓</span>
                  <span className="consent-text">I understand</span>
                </label>
              </div>
              <button
                type="button"
                className="cta"
                disabled={!form.pregnancyConsent}
                onClick={() => goTo("s15")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s15" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">Have you ever had pancreatitis?</div>
              <Radio
                options={NO_YES}
                value={form.s15}
                onSelect={(v) => upd("s15", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s15}
                onClick={() => goTo(form.s15 === "Yes" ? "dHard" : "s16")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s16" && (
            <div className="sc">
              <div className="slabel">Lifestyle</div>
              <div className="q">How many alcoholic drinks do you have in a week?</div>
              <Radio
                options={ALCOHOL_FREQUENCY}
                value={form.s16}
                onSelect={(v) => upd("s16", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s16}
                onClick={() => goTo("s17")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s17" && (
            <div className="sc">
              <div className="slabel">Lifestyle</div>
              <div className="q">Do you use any recreational drugs?</div>
              <div className="qs">
                Your answer is private.
              </div>
              <Multi
                options={RECREATIONAL_DRUGS}
                values={form.s17}
                onToggle={(v) => toggleExclusive("s17", v, "I don't use any")}
              />
              {form.s17.includes("Other") && (
                <textarea
                  className="inp"
                  placeholder="Please specify"
                  value={form.s17Other}
                  onChange={(e) => upd("s17Other", e.target.value)}
                />
              )}
              <button
                type="button"
                className="cta"
                disabled={
                  form.s17.length === 0 ||
                  (form.s17.includes("Other") && !form.s17Other.trim())
                }
                onClick={() => goTo("s18")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s18" && (
            <div className="sc">
              <div className="slabel">Lifestyle</div>
              <div className="q">Can you tell us a bit about your daily routine and habits?</div>
              <div className="qs">This helps your doctor build the right plan for you.</div>
              <div className="r2">
                <Select
                  style={{ margin: 0 }}
                  placeholder="Meals per day"
                  options={MEALS_PER_DAY}
                  value={form.meals}
                  onChange={(v) => upd("meals", v)}
                />
                <Select
                  style={{ margin: 0 }}
                  placeholder="Exercise days / week"
                  options={EXERCISE_DAYS}
                  value={form.exercise}
                  onChange={(v) => upd("exercise", v)}
                />
              </div>
              <div className="r2" style={{ marginTop: 8 }}>
                <Select
                  style={{ margin: 0 }}
                  placeholder="Sleep hours / night"
                  options={SLEEP_HOURS}
                  value={form.sleep}
                  onChange={(v) => upd("sleep", v)}
                />
                <Select
                  style={{ margin: 0 }}
                  placeholder="Fast food / week"
                  options={FAST_FOOD_PER_WEEK}
                  value={form.fastFood}
                  onChange={(v) => upd("fastFood", v)}
                />
              </div>
              <div className="r2" style={{ marginTop: 8 }}>
                <Select
                  style={{ margin: 0 }}
                  placeholder="Sugary drinks / week"
                  options={SUGARY_DRINKS_PER_WEEK}
                  value={form.sugary}
                  onChange={(v) => upd("sugary", v)}
                />
                <Select
                  style={{ margin: 0 }}
                  placeholder="Water intake daily"
                  options={WATER_INTAKE}
                  value={form.water}
                  onChange={(v) => upd("water", v)}
                />
              </div>
              <div className="stress-label">Stress level</div>
              {(() => {
                const zone =
                  form.stress <= 3 ? "low" : form.stress <= 7 ? "med" : "high";
                return (
                  <div className={`stress-block stress-${zone}`}>
                    <div className="stress-row">
                      <span className="smin">1</span>
                      <div className="stress-track-wrap">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={form.stress}
                          onChange={(e) => upd("stress", Number(e.target.value))}
                        />
                        <div className="stress-ticks" aria-hidden>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <span key={i} />
                          ))}
                        </div>
                      </div>
                      <span className="smax">10</span>
                      <span className="sv">{form.stress}</span>
                    </div>
                    <div className="stress-zones">
                      <span className={zone === "low" ? "active" : ""}>Low</span>
                      <span className={zone === "med" ? "active" : ""}>Medium</span>
                      <span className={zone === "high" ? "active" : ""}>High</span>
                    </div>
                  </div>
                );
              })()}
              <button type="button" className="cta" onClick={() => goTo("s19")}>
                Continue
              </button>
            </div>
          )}

          {screen === "s19" && (
            <div className="sc">
              <div className="slabel">Profile</div>
              <div className="q">What is your ethnicity?</div>
              <div className="qs">We ask this to better tailor treatment options to you.</div>
              <Multi
                options={ETHNICITIES}
                values={form.s19}
                onToggle={(v) => toggle("s19", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s19.length === 0}
                onClick={() => goTo("s21")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s20" && (
            <div className="sc">
              <div className="q">Find the right treatment for you</div>
              <div className="qs">
                Enter your email to see options tailored to your goals and health history.
              </div>
              <input
                className="inp"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => upd("email", e.target.value)}
              />
              {form.email.length > 0 && !isValidEmail(form.email) && (
                <div className="field-err">Please enter a valid email address.</div>
              )}
              <div className="opts" style={{ gap: 7 }}>
                <label
                  className={`opt consent ${form.consentH ? "sel" : ""}`}
                  onClick={() => upd("consentH", !form.consentH)}
                >
                  <span className="chk">✓</span>
                  <span className="consent-text">
                    I agree to the <a href="#">HIPAA Authorization</a>
                  </span>
                </label>
                <label
                  className={`opt consent ${form.consentT ? "sel" : ""}`}
                  onClick={() => upd("consentT", !form.consentT)}
                >
                  <span className="chk">✓</span>
                  <span className="consent-text">
                    I agree to the <a href="#">Telehealth Consent</a>,{" "}
                    <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
                  </span>
                </label>
              </div>
              <button
                type="button"
                className="cta"
                disabled={!emailOk}
                onClick={() => goTo("iRoad")}
              >
                Continue
              </button>
              <div className="or-row">
                <div className="line" />
                <span className="or">OR</span>
                <div className="line" />
              </div>
              <button type="button" className="cta2 google-btn">
                <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {screen === "s21" && (
            <div className="sc">
              <div className="slabel">Your profile</div>
              <div className="q">Complete your profile</div>
              <div className="qs">
                Your healthcare team will need this for treatment and prescriptions.
              </div>
              <div className="r2">
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => upd("firstName", e.target.value)}
                />
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => upd("lastName", e.target.value)}
                />
              </div>
              {form.firstName.length > 0 && !isValidName(form.firstName) && (
                <div className="field-err">First name must be at least 2 characters.</div>
              )}
              {form.lastName.length > 0 && !isValidName(form.lastName) && (
                <div className="field-err">Last name must be at least 2 characters.</div>
              )}
              <div className="r2" style={{ marginTop: 8 }}>
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="date"
                  value={form.dob}
                  onChange={(e) => upd("dob", e.target.value)}
                />
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="text"
                  inputMode="numeric"
                  placeholder="ZIP code"
                  maxLength={5}
                  value={form.zip}
                  onChange={(e) => upd("zip", e.target.value)}
                />
              </div>
              <input
                className="inp"
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => upd("phone", e.target.value)}
              />
              {form.phone.length > 0 && !isValidPhone(form.phone) && (
                <div className="field-err">Please enter a valid phone number (at least 10 digits).</div>
              )}
              <input
                className="inp"
                type="text"
                placeholder="Street address"
                value={form.address}
                onChange={(e) => upd("address", e.target.value)}
              />
              <button
                type="button"
                className="cta"
                disabled={!profileOk}
                onClick={() => goTo("s22")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s22" && (
            <div className="sc">
              <div className="slabel">Medications</div>
              <div className="q">Are you currently taking any medications or supplements?</div>
              <div className="qs">Include all prescriptions, OTC medications, and supplements.</div>
              <textarea
                className="inp"
                placeholder="e.g. Metformin 500mg, Fish Oil, Aspirin 81mg — or type None"
                value={form.meds}
                onChange={(e) => upd("meds", e.target.value)}
              />
              <div className="q" style={{ fontSize: 16, marginBottom: 6 }}>
                Do you have any allergies?
              </div>
              <input
                className="inp"
                type="text"
                placeholder="e.g. Penicillin — or type None"
                value={form.allergies}
                onChange={(e) => upd("allergies", e.target.value)}
              />
              <div className="q" style={{ fontSize: 16, marginBottom: 6 }}>
                Which pharmacy would you like to use?
              </div>
              <input
                className="inp"
                type="text"
                placeholder="e.g. CVS, 123 Main St (optional)"
                value={form.pharmacy}
                onChange={(e) => upd("pharmacy", e.target.value)}
              />
              <button type="button" className="cta" onClick={() => goTo("s23")}>
                Continue
              </button>
            </div>
          )}

          {screen === "s23" && (
            <div className="sc">
              <div className="q">When would you like to schedule your consultation?</div>
              <div className="qs">
                Choose a time that works for you. Appointments are 15–20 minutes with a licensed
                physician.
              </div>
              <div className="cal">
                {SLOTS.map((s) => {
                  const id = `${s.d}|${s.t}`;
                  return (
                    <div
                      key={id}
                      className={`cs ${form.slot === id ? "sel" : ""}`}
                      onClick={() => upd("slot", id)}
                    >
                      <div className="csd">{s.d}</div>
                      <div className="cst">{s.t}</div>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="cta"
                disabled={!form.slot}
                onClick={submit}
              >
                Confirm appointment
              </button>
            </div>
          )}

          {screen === "sPlan" && (() => {
            const active = PLANS.find((p) => p.id === form.plan) ?? PLANS[0];
            const fmtSave = (n: number) =>
              n < 0 ? `Save $-${Math.abs(n)}` : `Save $${n}`;
            return (
              <div className="sc">
                <div className="slabel">Choose your plan</div>
                <div className="plan-card">
                  <div className="plan-tabs">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`plan-tab ${active.id === p.id ? "active" : ""}`}
                        onClick={() => upd("plan", p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="plan-price-row">
                    <div className="plan-price-col">
                      <div className="plan-old">${active.oldMonthly}/mo</div>
                      <div className="plan-new">
                        <span className="plan-new-amt">${active.monthly}</span>
                        <span className="plan-new-suffix">/mo</span>
                      </div>
                    </div>
                    <div className="plan-save">{fmtSave(active.save)}</div>
                  </div>

                  <ul className="plan-bullets">
                    {PLAN_BENEFITS.map((b) => (
                      <li key={b}>
                        <span className="plan-tick">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="plan-divider" />

                  <div className="plan-meds-title">Medication options</div>
                  <div className="plan-meds">
                    {MEDICATION_ADDONS.map((m) => (
                      <div key={m.label} className="plan-med-row">
                        <span className={`plan-med-icon ${m.pill ? "pill" : "skin"}`} aria-hidden>
                          {m.pill ? "💊" : "🧴"}
                        </span>
                        <span className="plan-med-label">{m.label}</span>
                        {m.price && <span className="plan-med-price">{m.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="cta cta-plan"
                  onClick={() => goTo("sPay")}
                >
                  Continue
                </button>
              </div>
            );
          })()}

          {screen === "sPay" && (
            <div className="sc">
              <div className="slabel">Payment</div>
              <div className="q">Secure your plan</div>
              <div className="qs">
                Complete your one-time payment to activate your{" "}
                {selectedPlan?.label ?? "plan"}.
              </div>
              <StripePayment
                email={form.email}
                name={`${form.firstName} ${form.lastName}`.trim()}
                zip={form.zip}
                plan={form.plan}
                planLabel={selectedPlan?.label ?? ""}
                onSuccess={() => {
                  upd("paid", true);
                  goTo("iConfirm");
                }}
              />
            </div>
          )}

          {screen === "iConfirm" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic center">
                <div className="ic-body">
                  <div className="iconfirm-tick">✓</div>
                  <div className="ititle" style={{ fontSize: 26, marginBottom: 10 }}>
                    You&apos;re all set!
                  </div>
                  <div className="ibody">
                    Your consultation is booked. Check your email for prep instructions. Your doctor
                    will review your intake before the call.
                  </div>
                  <div className="cbox">
                    <strong>Consultation confirmed</strong>
                    <span>
                      {form.slot ? form.slot.replace("|", " · ") : "Your selected time"} · Video call
                    </span>
                  </div>
                  <div className="cbox">
                    <strong>What to expect</strong>
                    <span>
                      Your doctor will discuss your goals and prescribe a personalised GLP-1 plan if
                      clinically appropriate.
                    </span>
                  </div>
                </div>
                <button type="button" className="icta">
                  Go to your patient portal →
                </button>
              </div>
            </div>
          )}

          {screen === "dHard" && (
            <div className="disq">
              <div className="di">🩺</div>
              <div className="dt">We want to keep you safe</div>
              <div className="db">
                Based on your answers, GLP-1 medications may not be appropriate for you at this
                time. Please speak with your primary care physician for personalised guidance.
              </div>
              <input
                className="inp"
                type="email"
                placeholder="Your email — we'll share helpful resources"
                style={{ maxWidth: 320, textAlign: "center" }}
                value={form.email}
                onChange={(e) => upd("email", e.target.value)}
              />
              <button
                type="button"
                className="cta"
                style={{ maxWidth: 320, marginTop: 10 }}
                disabled={!isValidEmail(form.email)}
                onClick={() => logSubmission("iThanks", "Weight loss onboarding — disqualified lead")}
              >
                Keep me updated
              </button>
            </div>
          )}

          {screen === "iThanks" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic center">
                <div className="ic-body">
                  <div className="iconfirm-tick">✓</div>
                  <div className="ititle" style={{ fontSize: 26, marginBottom: 10 }}>
                    Thanks — you&apos;re on the list
                  </div>
                  <div className="ibody">
                    We&apos;ll send helpful resources to <strong>{form.email}</strong>. In the
                    meantime, please reach out to your primary care provider for personalised
                    guidance.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
