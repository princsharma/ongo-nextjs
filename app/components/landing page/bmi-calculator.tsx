'use client';

import { useState } from 'react';

type Unit = 'metric' | 'imperial';

interface BMIResult {
  value: string;
  category: string;
  badgeClass: string;
  description: string;
  markerPct: number;
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [shake, setShake] = useState(false);

  const handleUnitSwitch = (u: Unit) => {
    setUnit(u);
    setResult(null);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const calculate = () => {
    let weightKg: number;
    let heightM: number;

    if (unit === 'metric') {
      const w = parseFloat(weight);
      const h = parseFloat(heightCm);
      if (!w || !h) return triggerShake();
      weightKg = w;
      heightM = h / 100;
    } else {
      const w = parseFloat(weight);
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      if (!w || (!ft && !inc)) return triggerShake();
      weightKg = w * 0.453592;
      heightM = (ft * 12 + inc) * 0.0254;
    }

    const bmi = weightKg / (heightM * heightM);
    if (bmi < 5 || bmi > 80) return;

    let category: string;
    let badgeClass: string;
    let description: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      badgeClass = 'badge-underweight';
      description =
        'Your BMI is below the healthy range. Consider consulting a healthcare provider about achieving a healthy weight through balanced nutrition.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      badgeClass = 'badge-normal';
      description =
        'Your BMI is within the healthy range. Maintain your weight with regular physical activity and a balanced diet.';
    } else if (bmi < 30) {
      category = 'Overweight';
      badgeClass = 'badge-overweight';
      description =
        'Your BMI is slightly above the healthy range. Small lifestyle changes in diet and activity can make a meaningful difference.';
    } else {
      category = 'Obese';
      badgeClass = 'badge-obese';
      description =
        'Your BMI is in the obese range. Consulting with a healthcare professional can help you explore safe and effective weight management options.';
    }

    const markerPct = Math.min(Math.max(((bmi - 10) / (45 - 10)) * 100, 2), 98);

    setResult({
      value: bmi.toFixed(1),
      category,
      badgeClass,
      description,
      markerPct,
    });
  };

  return (
    <div className="bmi-wrap wl-section">
        <div className="wl-hero-right">
          <p className="wl-eyebrow">CHECK YOUR HEALTH STATUS</p>
          <h1 className="wl-headline">
            Know your {" "}
            <span className="wl-headline-accent">BMI.</span>
            <br />
          </h1>

          <div className="wl-image-grid">
            <div className="wl-image-card">
              <img
                src="assets/bmi-a.png"
                alt="Happy patient after weight loss"
                className="wl-grid-image"
              />
            </div>
            <div className="wl-image-card">
              <img
                src="assets/bmi-b.png"
                alt="GLP-1 injection demonstration"
                className="wl-grid-image"
              />
            </div>
          </div>

          <div className="wl-cta">
            <h2 className="wl-cta-heading">
             Your BMI is just the start.
            </h2>
            <p className="wl-cta-body">
             BMI helps you understand where you stand, but it doesn't tell the full story. 
Get a clearer picture of your health and what steps can actually work for you.
            </p>
            <a href="#get-started" className="wl-cta-button">
              See what works for your body
            </a>
          </div>
        </div>
      <div className="bmi-card">

        {/* Header */}
        <div className="bmi-header">
          <h1>BMI Calculator</h1>
          <p>Body Mass Index — your health baseline</p>
        </div>

        {/* Body */}
        <div className="bmi-body">

          {/* Unit Toggle */}
          <div className="toggle-row">
            <span className="toggle-label">Unit system</span>
            <div className="toggle-pill">
              <button
                className={`toggle-btn ${unit === 'metric' ? 'active' : ''}`}
                onClick={() => handleUnitSwitch('metric')}
              >
                Metric
              </button>
              <button
                className={`toggle-btn ${unit === 'imperial' ? 'active' : ''}`}
                onClick={() => handleUnitSwitch('imperial')}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Weight + Age */}
          <div className="fields-grid">
            <div className="field-block">
              <label>Weight</label>
              <div className="field-wrap">
                <input
                  type="number"
                  placeholder={unit === 'metric' ? '70' : '154'}
                  min={1}
                  max={999}
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <span className="unit-tag">{unit === 'metric' ? 'kg' : 'lbs'}</span>
              </div>
            </div>
            <div className="field-block">
              <label>
                Age <span className="optional-label">(optional)</span>
              </label>
              <div className="field-wrap">
                <input
                  type="number"
                  placeholder="30"
                  min={2}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <span className="unit-tag">yrs</span>
              </div>
            </div>
          </div>

          {/* Height */}
          <div className="field-block height-field">
            <label>Height</label>
            {unit === 'metric' ? (
              <div className="field-wrap">
                <input
                  type="number"
                  placeholder="170"
                  min={50}
                  max={300}
                  step={0.1}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
                <span className="unit-tag">cm</span>
              </div>
            ) : (
              <div className="height-split">
                <div className="field-wrap">
                  <input
                    type="number"
                    placeholder="5"
                    min={1}
                    max={9}
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                  />
                  <span className="unit-tag">ft</span>
                </div>
                <div className="field-wrap">
                  <input
                    type="number"
                    placeholder="10"
                    min={0}
                    max={11}
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                  />
                  <span className="unit-tag">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            className={`calc-btn ${shake ? 'shake' : ''}`}
            onClick={calculate}
          >
            Calculate BMI
          </button>

          {/* Result */}
          {result && (
            <div className="result-box">
              <div className="result-top">
                <div>
                  <div className="result-label">Your BMI</div>
                  <div className="result-val">
                    {result.value}
                    <span>kg/m²</span>
                  </div>
                </div>
                <div className={`result-badge ${result.badgeClass}`}>
                  {result.category}
                </div>
              </div>

              <div className="bmi-bar-wrap">
                <div className="bmi-bar-track">
                  <div
                    className="bmi-bar-marker"
                    style={{ left: `${result.markerPct.toFixed(1)}%` }}
                  />
                </div>
                <div className="bmi-bar-labels">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
              </div>

              <p className="result-desc">{result.description}</p>

              <div className="range-grid">
                {[
                  { val: '<18.5', lbl: 'Underweight' },
                  { val: '18.5–24.9', lbl: 'Normal' },
                  { val: '25–29.9', lbl: 'Overweight' },
                  { val: '≥30', lbl: 'Obese' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="range-chip">
                    <div className="rc-val">{val}</div>
                    <div className="rc-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}