"use client";

import { useEffect, useState } from "react";
import Obleft from "../components/obleft";

export default function Step3({ next }: any) {
  const [progress, setProgress] = useState(0);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // ✅ SAFE TRANSITION (THIS FIXES YOUR ERROR)
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        next(); // move to step 4
      }, 500); // small UX delay

      return () => clearTimeout(timeout);
    }
  }, [progress, next]);

  return (
    <div className="ob-page">
      <Obleft />

      <div className="ob-right">

        <div className="ob-progress">
          <div className="ob-progress-bar done" />
          <div className="ob-progress-bar done" />
          <div className="ob-progress-bar active" />
        </div>

        <div className="ob-step-badge">
          <div className="ob-step-dot" />
          Processing
        </div>

        <h1 className="ob-title">
          Generating your <span className="ob-title-grad">results…</span>
        </h1>

        <p className="ob-sub">
          Our AI is analyzing your photo and crafting your personalized transformation preview.
        </p>

        <div className="ob-loader">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="ob-loader-row">
            <span className="ob-loader-lbl">Finalizing your preview…</span>
            <span className="ob-loader-pct">{progress}%</span>
          </div>
        </div>

        <button className="ob-cta" disabled>
          Please wait…
        </button>

      </div>
    </div>
  );
}