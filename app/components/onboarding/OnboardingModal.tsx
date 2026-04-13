"use client";

import { useState, useEffect, useRef } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOADER_LABELS = [
  "Analyzing body shape…",
  "Mapping facial features…",
  "Calculating glow score…",
  "Finalizing your preview…",
  "Almost done…",
];

const PRIVACY_ITEMS = [
  "Your photo is processed securely on-device",
  "Used only for your preview — never stored",
  "Never shared with third parties",
];

const STATS = [
  { val: "−12kg", key: "Est. weight loss" },
  { val: "+40%", key: "Skin glow" },
  { val: "8 wks", key: "Timeline" },
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loaderLabel, setLoaderLabel] = useState(LOADER_LABELS[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === 4) {
      setProgress(0);
      setLoaderLabel(LOADER_LABELS[0]);
      let p = 0;
      let li = 0;
      intervalRef.current = setInterval(() => {
        p += Math.random() * 2.5 + 0.8;
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          setProgress(100);
          setLoaderLabel("Ready!");
        } else {
          setProgress(p);
          const ni = Math.min(Math.floor(p / 20), LOADER_LABELS.length - 1);
          if (ni > li) { li = ni; setLoaderLabel(LOADER_LABELS[li]); }
        }
      }, 55);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [step]);

  if (!isOpen) return null;

  const TOTAL = 5;

  return (
    <>
      <div className="om-scene">
        <div className="om-card" role="dialog" aria-modal="true">

          {/* Close */}
          <button className="om-close" onClick={onClose} aria-label="Close">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 1l7 7M8 1L1 8" stroke="#5C4A2A" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Stepper dots */}
          <div className="om-dots">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div
                key={i}
                className={`om-dot ${i + 1 === step ? "active" : i + 1 < step ? "done" : ""}`}
                style={{ width: i + 1 === step ? "22px" : "8px" }}
              />
            ))}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div className="om-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="11" r="5" fill="url(#s1a)" />
                  <path d="M7 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="url(#s1a)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="22" cy="7" r="3.5" fill="#FEF3C7" stroke="#EDD9C0" strokeWidth="1.2" />
                  <path d="M20.7 7h2.6M22 5.7v2.6" stroke="#D97706" strokeWidth="1.1" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="s1a" x1="7" y1="7" x2="23" y2="26" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#C2622B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="om-badge">AI Health Preview</p>
              <h1 className="om-title">See your future<br /><span className="om-title-grad">transformation</span></h1>
              <p className="om-sub">AI will show your weight loss &amp; glow results instantly — personalized to your body.</p>
              <button className="om-cta" onClick={() => setStep(2)}>
                Start Scan <span className="om-arr">→</span>
              </button>
              <p className="om-fn">No account needed · 100% private</p>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <div className="om-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <rect x="7" y="3" width="16" height="22" rx="4" fill="#FEF3C7" stroke="#EDD9C0" strokeWidth="1.3" />
                  <rect x="11" y="16" width="5" height="7" rx="1.5" fill="url(#s2a)" />
                  <circle cx="16" cy="16" r="2" fill="url(#s2a)" />
                  <path d="M10 11h10M10 14h6" stroke="#D97706" strokeWidth="1.1" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="s2a" x1="11" y1="14" x2="16" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#C2622B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="om-badge">Privacy First</p>
              <h1 className="om-title">Your privacy<br /><span className="om-title-grad">matters</span></h1>
              <div className="om-privacy">
                {PRIVACY_ITEMS.map((item) => (
                  <div key={item} className="om-privacy-row">
                    <span className="om-tick">
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2L7.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <button className="om-cta" onClick={() => setStep(3)}>
                Continue <span className="om-arr">→</span>
              </button>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <>
              <div className="om-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <rect x="3" y="6" width="24" height="18" rx="4" fill="#FEF3C7" stroke="#EDD9C0" strokeWidth="1.3" />
                  <circle cx="15" cy="15" r="5" stroke="url(#s3a)" strokeWidth="1.4" fill="none" />
                  <circle cx="15" cy="15" r="2" fill="url(#s3a)" />
                  <circle cx="21" cy="8" r="1.8" fill="url(#s3a)" />
                  <defs>
                    <linearGradient id="s3a" x1="10" y1="10" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#C2622B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="om-badge">Step 3 of 5</p>
              <h1 className="om-title">Upload your photo</h1>
              <p className="om-sub">Take a clear front-facing photo in good lighting for best results.</p>
              <label className="om-upload" htmlFor="om-file">
                <div className="om-upload-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13V4M6 7l4-4 4 4" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontSize: ".85rem", color: "#5C4A2A" }}>
                  <strong style={{ color: "#D97706" }}>Tap to upload</strong> or drag &amp; drop
                </p>
                <p style={{ fontSize: ".72rem", color: "#C2622B", opacity: .7 }}>JPG, PNG — max 10MB</p>
                <input type="file" id="om-file" accept="image/*" hidden />
              </label>
              <button className="om-cta" onClick={() => setStep(4)}>
                Use Photo <span className="om-arr">→</span>
              </button>
            </>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <>
              <div className="om-icon" style={{ overflow: "hidden", padding: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="18" stroke="#EDD9C0" strokeWidth="3" />
                  <path d="M32 14a18 18 0 0118 18" stroke="url(#s4a)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="s4a" x1="32" y1="14" x2="50" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#C2622B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="om-badge">Processing</p>
              <h1 className="om-title">Generating your<br /><span className="om-title-grad">results…</span></h1>
              <p className="om-sub">Our AI is analyzing your photo and crafting your transformation preview.</p>
              <div className="om-loader">
                <div className="om-track">
                  <div className="om-fill" style={{ width: `${Math.round(progress)}%` }} />
                </div>
                <div className="om-loader-row">
                  <span className="om-loader-lbl">{loaderLabel}</span>
                  <span className="om-loader-pct">{Math.round(progress)}%</span>
                </div>
              </div>
              <button className="om-cta" onClick={() => setStep(5)} disabled={progress < 100}>
                {progress < 100 ? "Please wait…" : "Continue"} <span className="om-arr">→</span>
              </button>
            </>
          )}

          {/* ── STEP 5 ── */}
          {step === 5 && (
            <>
              <p className="om-badge">Your Results</p>
              <h1 className="om-title">Your <span className="om-title-grad">transformation</span></h1>
              <p className="om-sub">This could be you in 8–12 weeks with a personalized plan.</p>
              <div className="om-compare">
                <div className="om-compare-top">
                  {/* Before figure */}
                  <div className="om-fig">
                    <svg width="52" height="88" viewBox="0 0 52 88" fill="none">
                      <ellipse cx="26" cy="12" rx="10" ry="10" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                      <path d="M12 30c0-7.7 6.3-14 14-14s14 6.3 14 14v18H12V30z" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                      <rect x="6" y="30" width="10" height="28" rx="5" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                      <rect x="36" y="30" width="10" height="28" rx="5" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                      <rect x="13" y="48" width="11" height="34" rx="5.5" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                      <rect x="28" y="48" width="11" height="34" rx="5.5" fill="#F5CBA7" stroke="#EDD9C0" strokeWidth="1.2" />
                    </svg>
                    <span className="om-fig-lbl">Before</span>
                  </div>
                  {/* Arrow */}
                  <div className="om-arrow-circle">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {/* After figure */}
                  <div className="om-fig">
                    <svg width="52" height="88" viewBox="0 0 52 88" fill="none">
                      <defs>
                        <linearGradient id="af1" x1="17" y1="3" x2="35" y2="21" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F59E0B" /><stop offset="1" stopColor="#C2622B" />
                        </linearGradient>
                        <linearGradient id="af2" x1="14" y1="18" x2="38" y2="82" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FAC775" /><stop offset="1" stopColor="#C2622B" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="26" cy="12" rx="9" ry="9" fill="url(#af1)" stroke="#EDD9C0" strokeWidth="1" />
                      <path d="M14 30c0-6.6 5.4-12 12-12s12 5.4 12 12v16H14V30z" fill="url(#af2)" stroke="#EDD9C0" strokeWidth="1" />
                      <rect x="7" y="30" width="9" height="26" rx="4.5" fill="url(#af2)" stroke="#EDD9C0" strokeWidth="1" />
                      <rect x="36" y="30" width="9" height="26" rx="4.5" fill="url(#af2)" stroke="#EDD9C0" strokeWidth="1" />
                      <rect x="14" y="46" width="10" height="36" rx="5" fill="url(#af2)" stroke="#EDD9C0" strokeWidth="1" />
                      <rect x="28" y="46" width="10" height="36" rx="5" fill="url(#af2)" stroke="#EDD9C0" strokeWidth="1" />
                    </svg>
                    <span className="om-fig-lbl after">After</span>
                  </div>
                </div>
                <div className="om-stats">
                  {STATS.map((s) => (
                    <div key={s.key} className="om-stat">
                      <div className="om-stat-val">{s.val}</div>
                      <div className="om-stat-key">{s.key}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="om-cta" onClick={onClose}>
                Get My Plan <span className="om-arr">→</span>
              </button>
              <p className="om-fn">Personalized just for you · No commitment</p>
            </>
          )}

        </div>
      </div>
    </>
  );
}