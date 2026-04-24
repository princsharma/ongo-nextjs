"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import "./wlo.css";

type Step = "hero" | "goal" | "inspire" | "measure" | "result";

const GOALS = [
  "1–15 lbs.",
  "16–50 lbs.",
  "51 or more lbs.",
  "I'm not sure yet—I just want to get started",
];

const INSPIRATIONS = [
  "I want to feel more confident",
  "I want to have more energy",
  "I want to improve my health",
  "I want to be more active",
  "I want to feel good every day",
];

function LoginLink() {
  return (
    <p className="wlo-login-row">
      Already have an account? <a href="#">Log in</a>
    </p>
  );
}

export default function WeightLossOnboard() {
  const [step, setStep] = useState<Step>("hero");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  const [goal, setGoal] = useState("");
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");

  const toggleInspiration = (item: string) => {
    setInspirations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const canContinueMeasure = heightFt && heightIn && weight;

  const bmi = (() => {
    const ft = Number(heightFt);
    const inches = Number(heightIn);
    const lbs = Number(weight);
    if (!ft || !lbs) return 0;
    const totalInches = ft * 12 + inches;
    const heightCm = totalInches * 2.54;
    const weightKg = lbs / 2.20462;
    const value = weightKg / (heightCm / 100) ** 2;
    return Math.round(value * 10) / 10;
  })();

  const category =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese";

  const eligible = bmi >= 27;
  const fullyEligible = bmi >= 30;

  /* ── HERO ── */
  if (step === "hero") {
    return (
      <div className="wlo-hero">
        <div className="wlo-hero-body">
          <h1 className="wlo-hero-title">
           1 in 8 Americans use GLP-1s to lose weight
          </h1>
          <p className="wlo-hero-sub">
            We'll help you get started with proven medications and online care.
          </p>

          <div className="wlo-meds-wrap">
              <Image
                src="/assets/graphic_medications.webp"
                alt="Zepbound"
                width={500}
                height={200}
                className="wlo-med-img"
              />
          </div>

          <button className="wlo-btn-dark" onClick={() => setStep("goal")}>
            See if you're eligible
          </button>

          <LoginLink />

          <p className="wlo-disclaimer">
            By continuing, you agree to the <a href="#">Ongo Terms of Use</a>,{" "}
            <a href="#">Ongo Care Direct Terms and Conditions</a>, and{" "}
            <a href="#">Privacy Policy</a>.
          </p>
          <p className="wlo-source">
            Source: <a href="#">RAND study (2025)</a>
          </p>
        </div>
      </div>
    );
  }

  /* ── GOAL ── */
  if (step === "goal") {
    return (
      <div className="wlo-step-wrap">
        <div className="wlo-step-body">
          <h2 className="wlo-question">What's your weight loss goal?</h2>
          <div className="wlo-options">
            {GOALS.map((g) => (
              <button
                key={g}
                className={`wlo-option ${goal === g ? "selected" : ""}`}
                onClick={() => {
                  setGoal(g);
                  setStep("inspire");
                }}
              >
                {g}
              </button>
            ))}
          </div>
          <LoginLink />
        </div>
      </div>
    );
  }

  /* ── INSPIRE ── */
  if (step === "inspire") {
    return (
      <div className="wlo-step-wrap">
        <div className="wlo-step-body">
          <h2 className="wlo-question">
            What's inspiring you to make a change?
          </h2>
          <p className="wlo-question-sub">Select all that apply.</p>

          <div className="wlo-checks">
            {INSPIRATIONS.map((item) => {
              const checked = inspirations.includes(item);
              return (
                <div
                  key={item}
                  className={`wlo-check-item ${checked ? "checked" : ""}`}
                  onClick={() => toggleInspiration(item)}
                >
                  <div className={`wlo-checkbox ${checked ? "checked" : ""}`}>
                    {checked && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="wlo-check-label">{item}</span>
                </div>
              );
            })}
          </div>

          <LoginLink />

          <button
            className={`wlo-btn-continue ${
              inspirations.length > 0 ? "active" : "inactive"
            }`}
            onClick={() => inspirations.length > 0 && setStep("measure")}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ── MEASURE ── */
  if (step === "measure") {
    return (
      <div className="wlo-step-wrap">
        <div className="wlo-step-body">
          <h2 className="wlo-question">
            What's your current height and weight?
          </h2>

          <div className="wlo-measure-grid">
            <input
              className="wlo-input"
              type="number"
              placeholder="Height (feet)"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
            />
            <input
              className="wlo-input"
              type="number"
              placeholder="Height (inches)"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
            />
          </div>

          <div className="wlo-measure-full">
            <input
              className="wlo-input"
              type="number"
              placeholder="Weight (pounds)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <LoginLink />

          <button
            className={`wlo-btn-continue ${
              canContinueMeasure ? "active" : "inactive"
            }`}
            onClick={() => {
              if (!canContinueMeasure) return;
              console.log("Weight Loss Onboard — Submission", {
                goal,
                inspirations,
                height: `${heightFt}ft ${heightIn}in`,
                weight: `${weight} lbs`,
                bmi,
                category,
                eligible,
                fullyEligible,
              });
              setStep("result");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  return (
    <div className="wlo-result">
      <div className="wlo-result-body">
        <h1 className="wlo-result-title">
          {eligible ? "Good news!" : "Thanks for sharing."}
        </h1>

        <div className="wlo-bmi-card">
          <div className="wlo-bmi-row">
            <div>
              <div className="wlo-bmi-label">Your BMI</div>
              <div className="wlo-bmi-value">{bmi}</div>
            </div>
            <div className={`wlo-bmi-badge ${category.toLowerCase()}`}>
              {category}
            </div>
          </div>
        </div>

        <p className="wlo-result-desc">
          {fullyEligible ? (
            <>
              Based on your BMI of <strong>{bmi}</strong>,{" "}
              <strong>you&apos;re eligible</strong> for GLP-1 treatment.
              Let&apos;s find the best option for your goals.
            </>
          ) : eligible ? (
            <>
              Based on your BMI of <strong>{bmi}</strong>,{" "}
              <strong>you may be eligible</strong> for GLP-1 treatment.
              Let&apos;s find the best option for your goals.
            </>
          ) : (
            <>
              Based on your BMI of <strong>{bmi}</strong>, GLP-1 treatment may
              not be the right fit right now. Our team can help you explore
              other options that match your goals.
            </>
          )}
        </p>

        <button className="wlo-btn-dark">
          {eligible ? "Continue" : "Talk to our team"}
        </button>
      </div>

      <div className="wlo-result-woman">
        <Image
          src="/assets/happy-women.png"
          alt=""
          width={420}
          height={520}
          className="wlo-woman-img"
          priority
        />
      </div>
    </div>
  );
}
