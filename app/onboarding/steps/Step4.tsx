"use client";

import Obleft from "../components/obleft";

export default function Step4() {
  return (
    <div className="ob-page">
      <Obleft />

      <div className="ob-right">

        <div className="ob-progress">
          <div className="ob-progress-bar done" />
          <div className="ob-progress-bar done" />
          <div className="ob-progress-bar done" />
        </div>

        <div className="ob-step-badge">
          <div className="ob-step-dot" />
          Your Results
        </div>

        <h1 className="ob-title">
          Your <span className="ob-title-grad">transformation</span>
        </h1>

        <p className="ob-sub">
          This could be you in 8–12 weeks with a personalized plan.
        </p>

        <div className="ob-compare">

          <div className="ob-compare-top">

            <div className="ob-fig">
              <div className="ob-fig-lbl">BEFORE</div>
            </div>

            <div className="ob-arrow-circle">→</div>

            <div className="ob-fig">
              <div className="ob-fig-lbl after">AFTER</div>
            </div>

          </div>

          <div className="ob-stats">
            <div className="ob-stat">
              <div className="ob-stat-val">−12kg</div>
              <div className="ob-stat-key">Est. weight loss</div>
            </div>

            <div className="ob-stat">
              <div className="ob-stat-val">+40%</div>
              <div className="ob-stat-key">Skin glow</div>
            </div>

            <div className="ob-stat">
              <div className="ob-stat-val">8 wks</div>
              <div className="ob-stat-key">Timeline</div>
            </div>
          </div>

        </div>

        <button className="ob-cta">
          Get My Plan →
        </button>

      </div>
    </div>
  );
}