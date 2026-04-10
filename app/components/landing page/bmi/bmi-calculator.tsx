"use client";

import { useState, useEffect } from "react";
import "./bmi-calculator.css";

type Unit = "metric" | "imperial";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(24.2);
  const [category, setCategory] = useState("Normal");

  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  const calculateBMI = () => {
    let htCm = unit === "metric" ? height : height * 2.54;
    let wtKg = unit === "metric" ? weight : weight / 2.20462;

    const value = wtKg / ((htCm / 100) ** 2);
    const rounded = Math.round(value * 10) / 10;

    setBmi(rounded);

    if (value < 18.5) setCategory("Underweight");
    else if (value < 25) setCategory("Normal");
    else if (value < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  return (

<div className="bg-sand-light">
 <div className="wl-section bmi_wrapper">
      {/* ── Hero Block ── */}
      <div className="wl-hero">
         {/* Right column */}
        <div className="wl-hero-right">
          <p className="wl-eyebrow">Let me check my BMI</p>
          <h1 className="wl-headline">
            Check your  {" "}
            <span className="wl-headline-accent">BMI </span>
            and understand your Health
          </h1>

          <div className="wl-image-grid">
            <div className="wl-image-card">
              <img
                src="assets/calc-a.png"
                alt="Happy patient after weight loss"
                className="wl-grid-image"
              />
            </div>
            <div className="wl-image-card">
              <img
                src="assets/calc-b.png"
                alt="GLP-1 injection demonstration"
                className="wl-grid-image"
              />
            </div>
          </div>

          <div className="wl-cta">
            <h2 className="wl-cta-heading">
          Your BMI gives a quick snapshot of your health.
            </h2>
            <p className="wl-cta-body">
           Use the calculator to see where you stand and take the next step with confidence.
            </p>
            <a href="#get-started" className="wl-cta-button">
              Check Your BMI
            </a>
          </div>
        </div>
        {/* Left column */}
        <div className="calculator-wrapper">
      <div className="calculator">
      
      {/* Header */}
      <header className="calculator-header">
        <h2 className="calculator-title">
          Know your <span>BMI</span>
        </h2>
      </header>

      {/* Controls */}
      <div className="calculator-controls">
        <div className="unit-toggle">
          <button
            className={unit === "metric" ? "is-active" : ""}
            onClick={() => setUnit("metric")}
          >
            Metric
          </button>
          <button
            className={unit === "imperial" ? "is-active" : ""}
            onClick={() => setUnit("imperial")}
          >
            Imperial
          </button>
        </div>

        {/* Height */}
        <div className="calculator-input">
          <div className="input-header">
            <span className="input-label">Height</span>
            <span className="input-value">
              {height} {unit === "metric" ? "cm" : "in"}
            </span>
          </div>

          <input
            type="range"
            min={unit === "metric" ? 140 : 55}
            max={unit === "metric" ? 210 : 83}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>

        {/* Weight */}
        <div className="calculator-input">
          <div className="input-header">
            <span className="input-label">Weight</span>
            <span className="input-value">
              {weight} {unit === "metric" ? "kg" : "lbs"}
            </span>
          </div>

          <input
            type="range"
            min={unit === "metric" ? 30 : 66}
            max={unit === "metric" ? 200 : 440}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Result */}
      <div className="calculator-result">
        <div className="result-summary">
          <div className="result-score">
            <span className="bmi-value">{bmi}</span>
            <span className="bmi-text">BMI Score</span>
          </div>

          <div className={`result-badge ${category.toLowerCase()}`}>
            {category}
          </div>
        </div>
      </div>
</div>
        </div>

       
      </div>
    
    </div>

    </div>
  );
}