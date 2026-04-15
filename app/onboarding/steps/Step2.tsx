"use client";

import { useState } from "react";
import Obleft from "../components/obleft";
import Image from "next/image";

export default function Step2({
  form,
  updateField,
  fileRef,
  next,
  errors,
}: any) {
  const [uploading, setUploading] = useState(false);

const validateImage = async (url: string) => {
  const res = await fetch("/api/validate-image", {
    method: "POST",
    body: JSON.stringify({ imageUrl: url }),
  });

  const data = await res.json();

  console.log("FULL RESPONSE:", data);

  // ✅ Safe guard
  if (!data || !data.success || !data.raw) {
    console.error("Invalid Gemini response:", data);
    return null;
  }

  try {
    const clean = String(data.raw)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^[^{]*/, "") // 🔥 remove junk before JSON
      .trim();

    const parsed = JSON.parse(clean);

    return parsed;
  } catch (err) {
    console.error("Parse error:", err);
    return null;
  }
};
const handlePhoto = async (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset!);

  try {
    // ✅ Upload to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    const optimizedUrl = data.secure_url.replace(
      "/upload/",
      "/upload/w_512,h_768,c_fill,q_auto,f_auto/"
    );

    // 🔥 Gemini validation
    const validation = await validateImage(optimizedUrl);

    console.log("VALIDATION:", validation);

    if (!validation) {
      alert("AI validation failed. Try again.");
      return;
    }

    // ✅ Smart validation logic
    const isValid =
      validation.peopleCount === 1 &&
      validation.confidence > 0.5;

    if (!isValid) {
      alert("Please upload a clear single-person image");
      return;
    }

    // ✅ Save only valid image
    updateField("photo", optimizedUrl);

  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="ob-page">
      <Obleft />

      <div className="ob-right">

        {/* PROGRESS */}
        <div className="ob-progress">
          <div className="ob-progress-bar done" />
          <div className="ob-progress-bar active" />
          <div className="ob-progress-bar" />
        </div>

        <div className="ob-step-badge">
          <div className="ob-step-dot" />
          Step 2 of 3
        </div>

        <h1 className="ob-title">
          Your <span className="ob-title-grad">body stats</span>
        </h1>

        <p className="ob-sub">
          This helps us calculate your personalized transformation preview.
        </p>

        <div className="ob-form">

          {/* AGE */}
          <div className="ob-field">
            <label className="ob-label">Age</label>

            <div className="ob-slider-row">
              <span></span>
              <span className="ob-slider-val">{form.age} yrs</span>
            </div>

            <input
              type="range"
              min={16}
              max={80}
              value={form.age}
              className="ob-slider"
              onChange={(e) => updateField("age", Number(e.target.value))}
            />

            <div className="ob-slider-range">
              <span>16</span>
              <span>80</span>
            </div>
          </div>

          {/* HEIGHT + CURRENT WEIGHT */}
          <div className="ob-row">

            <div className="ob-field">
              <label className="ob-label">Height (cm)</label>
              <input
                className={`ob-input ${errors.height ? "ob-input-error" : ""}`}
                value={form.height}
                onChange={(e) => updateField("height", e.target.value)}
                placeholder="170"
              />
              {errors.height && <p className="ob-error">{errors.height}</p>}
            </div>

            <div className="ob-field">
              <label className="ob-label">Current Weight (kg)</label>
              <input
                className={`ob-input ${
                  errors.currentWeight ? "ob-input-error" : ""
                }`}
                value={form.currentWeight}
                onChange={(e) =>
                  updateField("currentWeight", e.target.value)
                }
                placeholder="75"
              />
              {errors.currentWeight && (
                <p className="ob-error">{errors.currentWeight}</p>
              )}
            </div>

          </div>

          {/* GOAL WEIGHT */}
          <div className="ob-field">
            <label className="ob-label">Goal Weight (kg)</label>
            <input
              className={`ob-input ${
                errors.goalWeight ? "ob-input-error" : ""
              }`}
              value={form.goalWeight}
              onChange={(e) => updateField("goalWeight", e.target.value)}
              placeholder="65"
            />
            {errors.goalWeight && (
              <p className="ob-error">{errors.goalWeight}</p>
            )}
          </div>

          {/* PHOTO UPLOAD */}
          <div className="ob-field">
            <label className="ob-label">Your Photo *</label>

            <div
              className={`ob-upload ${
                form.photo ? "has-photo" : ""
              } ${errors.photo ? "ob-input-error" : ""}`}
              onClick={() => fileRef.current.click()}
            >
              {form.photo ? (
                <Image
                  src={form.photo}
                  className="ob-upload-preview"
                  alt="preview"
                  width={200}
                  height={200}

                />
              ) : (
                <>
                  <div className="ob-upload-icon">⬆</div>
                  <p className="ob-upload-text">
                    <strong>Tap to upload</strong> or drag & drop
                  </p>
                  <p className="ob-upload-hint">
                    JPG, PNG — max 10MB · Front-facing for best results
                  </p>
                </>
              )}
            </div>

            <input
              type="file"
              hidden
              ref={fileRef}
              onChange={handlePhoto}
            />

            {errors.photo && <p className="ob-error">{errors.photo}</p>}
          </div>

        </div>

        {/* CTA */}
        <button
          className="ob-cta"
          onClick={next}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Generate My Preview →"}
        </button>

      </div>
    </div>
  );
}