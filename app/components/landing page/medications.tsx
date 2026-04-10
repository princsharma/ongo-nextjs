"use client";
import { useState } from "react";

type Unit = "all" | "weight" | "diabetes";

export default function MedicationsSection() {
  const [activeTab, setActiveTab] = useState<Unit>("all");

  const handleTabClick = (tab: Unit) => {
    setActiveTab(tab);
  };

  // ✅ Centralized Data (No repetition)
  const medications = [
    {
      name: "Wegovy®",
      generic: "Semaglutide",
      category: "weight",
      image: "/assets/wegovy.webp",
      tag: "Weight Management · Once-weekly",
      description:
        "An FDA-approved GLP-1 medication for chronic weight management, similar to Ozempic®. For adults with BMI 30+, or BMI 27–29.9 with related health conditions.",
      features: [
        "Once-weekly injection — fits your routine",
        "Clinically studied for sustainable weight loss",
        "Reduces appetite and food cravings",
        "Provider-guided lifestyle program included",
      ],
    },
    {
      name: "Zepbound®",
      generic: "Tirzepatide",
      category: "weight",
      image: "/assets/zepbound.webp",
      tag: "Weight Management · Dual-action",
      description:
        "Tirzepatide's dual GLP-1/GIP mechanism makes it among the most clinically effective FDA-approved options for chronic weight management.",
      features: [
        "Once-weekly injection",
        "Dual mechanism: GLP-1 + GIP action",
        "Clinically studied for weight management",
        "Online care with licensed medical supervision",
      ],
    },
    {
      name: "Ozempic®",
      generic: "Semaglutide",
      category: "diabetes",
      image: "/assets/ozempic.webp",
      tag: "Diabetes Care · Once-weekly",
      description:
        "FDA-approved for adults with type 2 diabetes, used alongside a healthy diet and physical activity to help improve blood sugar control.",
      features: [
        "Convenient once-a-week injection",
        "Clinically studied to help lower A1C levels",
        "Shown to support cardiometabolic health",
        "Part of a comprehensive diabetes care plan",
      ],
    },
    {
      name: "Mounjaro®",
      generic: "Tirzepatide",
      category: "diabetes",
      image: "/assets/mounjaro.webp",
      tag: "Diabetes Care · Once-weekly",
      description:
        "FDA-approved for adults with type 2 diabetes, combining a healthy diet and physical activity to support comprehensive diabetes management.",
      features: [
        "Convenient once-weekly injection",
        "Clinically studied to help lower A1C levels",
        "Supports cardiometabolic health",
        "Comprehensive diabetes care plan",
      ],
    },
    {
      name: "Rybelsus®",
      generic: "Semaglutide (oral)",
      category: "diabetes",
      image: "/assets/rybelsus.webp",
      tag: "Diabetes Care · Daily oral tablet",
      description:
        "The only oral semaglutide approved for type 2 diabetes. Taken once daily, it provides an injection-free path to improved blood sugar control.",
      features: [
        "Taken once daily as an oral tablet",
        "No injection required",
        "Clinically studied to help lower A1C levels",
        "Supports cardiometabolic health",
      ],
    },
    {
      name: "Liraglutide",
      generic: "Victoza® / Saxenda®",
      category: "diabetes",
      image: "/assets/liraglutide.webp",
      tag: "Diabetes Care & Weight Management",
      description:
        "FDA-approved for both type 2 diabetes (Victoza®) and chronic weight management (Saxenda®) alongside diet and lifestyle changes.",
      features: [
        "Once-daily injection",
        "GLP-1 mechanism of action",
        "Dual-use: diabetes and weight management",
        "Online care with licensed supervision",
      ],
    },
  ];

  return (
    <section className="meds-section" id="medications">
      <div className="meds-inner">
        
        {/* Header */}
        <div className="meds-header reveal">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Treatments
          </div>
          <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>
            FDA-Approved GLP-1 Medications
          </h2>
          <p
            className="section-sub"
            style={{
              margin: "0 auto 1.5rem",
              textAlign: "center",
            }}
          >
            Prescribed by licensed physicians when clinically appropriate for
            your health needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="tab-bar reveal">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabClick("all")}
          >
            All Medications
          </button>

          <button
            className={`tab-btn ${activeTab === "weight" ? "active" : ""}`}
            onClick={() => handleTabClick("weight")}
          >
            Weight Loss
          </button>

          <button
            className={`tab-btn ${activeTab === "diabetes" ? "active" : ""}`}
            onClick={() => handleTabClick("diabetes")}
          >
            Diabetes Care
          </button>
        </div>

        {/* Cards (Dynamic Rendering) */}
     <div className="meds-grid" id="medsGrid">
  {medications
    .filter((med) =>
      activeTab === "all"
        ? true
        : med.category.toLowerCase().trim() === activeTab
    )
    .map((med, index) => (
      <div key={index} className="med-full-card">
        <div className="med-card-image">
          <img src={med.image} alt={med.name} />
        </div>

        <div className="med-card-top">
          <div>
            <div className="med-card-name">{med.name}</div>
            <div className="med-card-generic">{med.generic}</div>
          </div>
          <span className="med-approved-badge">FDA Approved</span>
        </div>

        <div className="med-card-body">
          <span className="med-card-tag">{med.tag}</span>
          {/* <p className="med-card-desc">{med.description}</p> */}

          <ul className="med-features">
            {med.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="med-card-footer">
          <a href="#" className="btn-primary">
            Start Consultation
          </a>
        </div>
      </div>
    ))}
</div>

        {/* Footer Note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.78rem",
            color: "var(--text-light)",
            marginTop: "2rem",
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: "1.65",
          }}
        >
          All medications require a prescription by a licensed provider based
          on medical necessity. GLP-1 medications are only given to patients
          when it falls within FDA approval guidelines.
        </p>
      </div>
    </section>
  );
}