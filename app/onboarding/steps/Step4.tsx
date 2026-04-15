"use client";

import { useEffect, useState } from "react";
import Obleft from "../components/obleft";

export default function Step4({ form }: any) {
  const [afterImage, setAfterImage] = useState<string | null>(null);

  useEffect(() => {
    if (!form?.photo) return;

    generateAfterImage(form.photo, form.goals || []);
  }, [form.photo]);

const generateAfterImage = (url: string, goals: string[]) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    const w = img.width;
    const h = img.height;

    // 🔥 Background fill
    ctx.filter = "blur(20px)";
    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = "none";

    let scaleX = 1;

    // -------------------------
    // 🎯 BODY GOALS
    // -------------------------

    if (goals.includes("Lose Weight")) {
      scaleX *= 0.9;
    }

    if (goals.includes("Gain Weight")) {
      scaleX *= 1.08;
    }

    const newWidth = w * scaleX;
    const offsetX = (w - newWidth) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      w,
      h,
      offsetX,
      0,
      newWidth,
      h
    );

    // -------------------------
    // 🎨 SKIN GOAL
    // -------------------------

    if (goals.includes("Improve Skin")) {
      ctx.globalAlpha = 0.25;
      ctx.filter = "brightness(1.1) contrast(1.1) saturate(1.2) blur(2px)";
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = 1;
      ctx.filter = "none";
    }

    const result = canvas.toDataURL("image/jpeg", 0.9);
    setAfterImage(result);
  };
};

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
          {form.goals?.includes("Lose Weight") && "A slimmer version of you in weeks. "}
          {form.goals?.includes("Gain Weight") && "A stronger, fuller build. "}
          {form.goals?.includes("Improve Skin") && "Healthier, glowing skin. "}
        </p>

        <div className="ob-compare">

          <div className="ob-compare-top">

            {/* BEFORE */}
            <div className="ob-fig">
              <div className="ob-fig-lbl">BEFORE</div>
              {form?.photo && (
                <img src={form.photo} className="ob-img" />
              )}
            </div>

            <div className="ob-arrow-circle">→</div>

            {/* AFTER */}
            <div className="ob-fig">
              <div className="ob-fig-lbl after">AFTER</div>

              {afterImage ? (
                <img src={afterImage} className="ob-img" />
              ) : (
                <div style={{ padding: 20 }}>Generating...</div>
              )}
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