"use client";

import Obleft from "../components/obleft";

export default function Step1({ form, updateField, next, errors }: any) {
  return (
    <div className="ob-page">
      <Obleft />

      <div className="ob-right">
        <div className="ob-progress">
          <div className="ob-progress-bar active" />
          <div className="ob-progress-bar" />
          <div className="ob-progress-bar" />
        </div>

        <div className="ob-step-badge">
          <div className="ob-step-dot" />
          Step 1 of 3
        </div>

        <h1 className="ob-title">
          Tell us about <span className="ob-title-grad">yourself</span>
        </h1>

        <p className="ob-sub">
          We'll personalize your health transformation plan just for you.
        </p>

        <div className="ob-form">

          <div className="ob-field">
            <label className="ob-label">Full Name</label>
            <input
              className={`ob-input ${errors.name ? "ob-input-error" : ""}`}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            {errors.name && <p className="ob-error">{errors.name}</p>}
          </div>

          <div className="ob-field">
            <label className="ob-label">Email Address</label>
            <input
              className={`ob-input ${errors.email ? "ob-input-error" : ""}`}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {errors.email && <p className="ob-error">{errors.email}</p>}
          </div>

          <div className="ob-field">
            <label className="ob-label">Phone Number</label>
            <input
              className={`ob-input ${errors.phone ? "ob-input-error" : ""}`}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            {errors.phone && <p className="ob-error">{errors.phone}</p>}
          </div>

          <div className="ob-field">
            <label className="ob-label">Gender</label>
            <div className="ob-gender-group">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  className={`ob-gender-btn ${
                    form.gender === g ? "selected" : ""
                  } ${errors.gender ? "error" : ""}`}
                  onClick={() => updateField("gender", g)}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p className="ob-error">{errors.gender}</p>}
          </div>

        </div>

        <button className="ob-cta" onClick={next}>
          Continue →
        </button>
      </div>
    </div>
  );
}