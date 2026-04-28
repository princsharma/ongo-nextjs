"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./wlf.css";
import {
  type Form,
  type ScreenId,
  initialForm,
  noBackScreens,
  numberedScreens,
} from "./schema";
import {
  ALCOHOL_FREQUENCY,
  BARIATRIC_PROCEDURES,
  ETHNICITIES,
  EXERCISE_DAYS,
  FAST_FOOD_PER_WEEK,
  GLP_EXPERIENCE,
  INSPIRATIONS,
  MEALS_PER_DAY,
  NO_YES,
  NO_YES_UNSURE,
  OTHER_CONDITIONS,
  PAST_METHODS,
  RECREATIONAL_DRUGS,
  SAFETY_TREATMENTS,
  SEX_OPTIONS,
  SLEEP_HOURS,
  SLOTS,
  STRUGGLE_DURATIONS,
  SUGARY_DRINKS_PER_WEEK,
  TIRZEPATIDE_DOSES,
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

  const bmi = useMemo(() => {
    const ft = parseFloat(form.heightFt) || 0;
    const inch = parseFloat(form.heightIn) || 0;
    const lbs = parseFloat(form.weightLbs) || 0;
    if (ft <= 0 || lbs <= 0) return null;
    const ti = ft * 12 + inch;
    if (ti <= 0) return null;
    return (lbs * 703) / (ti * ti);
  }, [form.heightFt, form.heightIn, form.weightLbs]);

  const idx = numberedScreens.indexOf(screen as (typeof numberedScreens)[number]);

  const logSubmission = (next: ScreenId, label: string) => {
    console.log(label, form);
    goTo(next);
  };

  const submit = () => logSubmission("iConfirm", "Weight loss onboarding submission");

  const emailOk = form.email.includes("@") && form.consentH && form.consentT;

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

          <div className="prog" aria-hidden>
            {numberedScreens.map((_, i) => (
              <div
                key={i}
                className={`prog-seg ${i < idx ? "done" : ""} ${i === idx ? "active" : ""}`}
              />
            ))}
          </div>

          {screen === "s1" && (
            <div className="sc">
              <div className="q">What&apos;s your weight loss goal?</div>
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
              <div className="q">What&apos;s inspiring you to make a change?</div>
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
              <div className="q">What&apos;s your current height and weight?</div>
              <div className="acct" style={{ textAlign: "left", margin: "0 0 16px" }}>
                Already have an account? <a href="#">Log in</a>
              </div>
              <div className="r2">
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="number"
                  inputMode="numeric"
                  placeholder="Height (feet)"
                  value={form.heightFt}
                  onChange={(e) => upd("heightFt", e.target.value)}
                />
                <input
                  className="inp"
                  style={{ margin: 0 }}
                  type="number"
                  inputMode="numeric"
                  placeholder="Height (inches)"
                  value={form.heightIn}
                  onChange={(e) => upd("heightIn", e.target.value)}
                />
              </div>
              <input
                className="inp"
                type="number"
                inputMode="numeric"
                placeholder="Weight (pounds)"
                value={form.weightLbs}
                onChange={(e) => upd("weightLbs", e.target.value)}
              />
              {bmi !== null && (
                <div className="bmi-pill">Your BMI: {bmi.toFixed(1)}</div>
              )}
              <button
                type="button"
                className="cta"
                disabled={bmi === null}
                onClick={() => goTo("iGood")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "iGood" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic">
                <div className="ititle">Good news!</div>
                <div className="ibody">
                  Based on this info, <strong>you may be eligible</strong> for GLP-1
                  treatment. Let&apos;s find the best option for your goals.
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
              <div className="ic">
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
                <button type="button" className="icta" onClick={() => goTo("s4")}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {screen === "s4" && (
            <div className="sc">
              <div className="slabel">Weight history</div>
              <div className="q">Tell us more about your weight history</div>
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
              <div className="q">How long have you struggled with your weight?</div>
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
              <div className="q">What ways have you tried to lose weight in the past?</div>
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
              <div className="q">Are you currently taking, or have you previously taken, a GLP-1 medication?</div>
              <Radio
                options={YES_NO}
                value={form.s7}
                onSelect={(v) => upd("s7", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s7}
                onClick={() => goTo(form.s7 === "Yes" ? "s7a" : "s7e")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s7a" && (
            <div className="sc">
              <div className="slabel">Medication history</div>
              <div className="q">Please describe your past experience with GLP-1 medications.</div>
              <Radio
                options={GLP_EXPERIENCE}
                value={form.glpExperience}
                onSelect={(v) => upd("glpExperience", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.glpExperience}
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
                What is the total dose of Tirzepatide (or similar medication) in mg you are
                currently using?
              </div>
              <Radio
                options={TIRZEPATIDE_DOSES}
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
                onClick={() => goTo("s7c")}
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
                If you have a picture available of your current vial, please upload a picture of
                your prescription (make sure that your name and the dosing instructions are
                visible). If not immediately available, please move on with the intake.
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
              <div className="step-of">Step 1 of 3</div>
              <div className="q">Upload a photo ID</div>
              <div className="qs">
                Take or upload an image of a government-issued photo ID, like a driver&apos;s
                license or passport.
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
                <label className="cta id-btn">
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
                style={{ marginTop: 12 }}
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
              <div className="q">Have you had any of the following bariatric procedures?</div>
              <Radio
                options={BARIATRIC_PROCEDURES}
                value={form.s9}
                onSelect={(v) => upd("s9", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={!form.s9}
                onClick={() => goTo(form.s9 && form.s9 !== "None of these" ? "s9b" : "s10")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s9b" && (
            <div className="sc">
              <div className="q">
                Provide the approximate date of your {form.s9.toLowerCase()} surgery.
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
          )}

          {screen === "s10" && (
            <div className="sc">
              <div className="slabel">Medical history</div>
              <div className="q">
                Have you ever been diagnosed with any of the following conditions related to weight?
              </div>
              <div className="qs">
                This information helps determine whether GLP-1 treatment is appropriate for you.
                Select all that apply.
              </div>
              <Multi
                options={WEIGHT_DIAGNOSES}
                values={form.s10}
                onToggle={(v) => toggle("s10", v)}
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
              <div className="q">Do you have any of these other health conditions?</div>
              <div className="qs">Select all that apply.</div>
              <Multi
                options={OTHER_CONDITIONS}
                values={form.s11}
                onToggle={(v) => toggle("s11", v)}
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
              <div className="q">Are you currently being treated for any of the following?</div>
              <div className="qs">
                This information helps us ensure treatment is safe for you. Select all that apply.
              </div>
              <Multi
                options={SAFETY_TREATMENTS}
                values={form.s12}
                onToggle={(v) => toggle("s12", v)}
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
                Have you or a family member been diagnosed with medullary thyroid cancer or MEN2 syndrome?
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
                onClick={() => goTo(form.s13 === "Yes" ? "dHard" : "s14")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s14" && (
            <div className="sc">
              <div className="slabel">Safety screening</div>
              <div className="q">Are you pregnant, trying to conceive, or currently breastfeeding?</div>
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
              <div className="q">Have you ever been diagnosed with pancreatitis?</div>
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
              <div className="q">How many alcoholic drinks do you consume in an average week?</div>
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
              <div className="q">Do you use any of the following recreational drugs?</div>
              <div className="qs">
                To ensure your safety, please let us know. All your information is confidential — we
                just need it to provide the safest advice.
              </div>
              <Multi
                options={RECREATIONAL_DRUGS}
                values={form.s17}
                onToggle={(v) => toggle("s17", v)}
              />
              <button
                type="button"
                className="cta"
                disabled={form.s17.length === 0}
                onClick={() => goTo("s18")}
              >
                Continue
              </button>
            </div>
          )}

          {screen === "s18" && (
            <div className="sc">
              <div className="slabel">Lifestyle</div>
              <div className="q">Tell us about your daily habits</div>
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
              <div className="stress-label">Stress level (1 = very low, 10 = very high)</div>
              <div className="stress-row">
                <span className="smin">1</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.stress}
                  onChange={(e) => upd("stress", Number(e.target.value))}
                />
                <span className="smax">10</span>
                <span className="sv">{form.stress}</span>
              </div>
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
              <Select
                style={{ marginTop: 8 }}
                placeholder="Sex assigned at birth"
                options={SEX_OPTIONS}
                value={form.sex}
                onChange={(v) => upd("sex", v)}
              />
              <input
                className="inp"
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => upd("phone", e.target.value)}
              />
              <input
                className="inp"
                type="text"
                placeholder="Street address"
                value={form.address}
                onChange={(e) => upd("address", e.target.value)}
              />
              <button type="button" className="cta" onClick={() => goTo("s22")}>
                Continue
              </button>
            </div>
          )}

          {screen === "s22" && (
            <div className="sc">
              <div className="slabel">Medications</div>
              <div className="q">Are you taking any medications or supplements?</div>
              <div className="qs">Include all prescriptions, OTC medications, and supplements.</div>
              <textarea
                className="inp"
                placeholder="e.g. Metformin 500mg, Fish Oil, Aspirin 81mg — or type None"
                value={form.meds}
                onChange={(e) => upd("meds", e.target.value)}
              />
              <div className="q" style={{ fontSize: 16, marginBottom: 6 }}>
                Any known allergies?
              </div>
              <input
                className="inp"
                type="text"
                placeholder="e.g. Penicillin — or type None"
                value={form.allergies}
                onChange={(e) => upd("allergies", e.target.value)}
              />
              <div className="q" style={{ fontSize: 16, marginBottom: 6 }}>
                Preferred pharmacy
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
              <div className="q">Book your consultation</div>
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

          {screen === "iConfirm" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic">
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
                  <span>{form.slot ? form.slot.replace("|", " · ") : "Your selected time"} · Video call</span>
                </div>
                <div className="cbox">
                  <strong>What to expect</strong>
                  <span>
                    Your doctor will discuss your goals and prescribe a personalised GLP-1 plan if
                    clinically appropriate.
                  </span>
                </div>
                <button type="button" className="icta" style={{ marginTop: 10 }}>
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
                disabled={!form.email.includes("@")}
                onClick={() => logSubmission("iThanks", "Weight loss onboarding — disqualified lead")}
              >
                Keep me updated
              </button>
            </div>
          )}

          {screen === "iThanks" && (
            <div className="inter">
              <div className="ibg" />
              <div className="ic">
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
          )}
        </div>
      </div>
    </div>
  );
}
