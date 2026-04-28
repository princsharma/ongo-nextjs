export const WEIGHT_GOALS = [
  "1–15 lbs.",
  "16–50 lbs.",
  "51 or more lbs.",
  "I'm not sure yet — I just want to get started",
] as const;

export const INSPIRATIONS = [
  "I want to feel more confident",
  "I want to have more energy",
  "I want to improve my health",
  "I want to reduce my cravings",
  "I want to prevent diabetes",
  "I want to improve my lab results",
  "I want to feel good every day",
] as const;

export const STRUGGLE_DURATIONS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "More than 5 years",
] as const;

export const PAST_METHODS = [
  "Counting calories",
  "Commercial weight loss programs or apps",
  "Low-carb, keto, or similar diets",
  "Intermittent fasting",
  "Exercise",
  "Prescription weight loss medication",
  "Other",
] as const;

export const YES_NO = ["Yes", "No"] as const;

export const GLP_EXPERIENCE = [
  "I tolerated a GLP-1 well with no or minimal side effects",
  "I tolerated a GLP-1 okay with moderate side effects",
  "I had significant side effects",
] as const;

export const TIRZEPATIDE_DOSES = [
  "0.25mg",
  "0.5mg",
  "1mg",
  "1.7mg",
  "2.4mg",
  "2.5mg",
  "5mg",
  "7.5mg",
  "Other",
] as const;
export const NO_YES = ["No", "Yes"] as const;
export const NO_YES_UNSURE = ["No", "Yes", "I'm not sure"] as const;

export const BARIATRIC_PROCEDURES = [
  "Lap band",
  "Gastric sleeve",
  "Gastric bypass",
  "None of these",
] as const;

export const WEIGHT_DIAGNOSES = [
  "High blood pressure (hypertension)",
  "High cholesterol (hyperlipidemia)",
  "Type 2 diabetes",
  "Pre-diabetes",
  "Metabolic syndrome",
  "Sleep apnea",
  "Osteoarthritis / joint pain",
  "Cardiovascular disease (ASCVD)",
  "None of the above",
] as const;

export const OTHER_CONDITIONS = [
  "PCOS",
  "Thyroid disorder",
  "GERD / acid reflux",
  "Fatty liver disease",
  "Heart disease",
  "Anxiety or depression",
  "Kidney disease",
  "None of the above",
] as const;

export const SAFETY_TREATMENTS = [
  "Eating disorder in the last 12 months",
  "Suicidal thoughts or suicide attempts in the last 12 months",
  "Active gallbladder disease",
  "Allergy or hypersensitivity to GLP-1 medication",
  "Bowel obstruction or severe GI issues",
  "Severe gastroparesis",
  "Kidney disease requiring dialysis",
  "None of these",
] as const;

export const ALCOHOL_FREQUENCY = [
  "None",
  "0–1 drinks",
  "1–6 drinks",
  "More than 6 drinks",
] as const;

export const RECREATIONAL_DRUGS = [
  "Marijuana / cannabis",
  "Cocaine or crack",
  "Amyl nitrate or butyl nitrite",
  "Other",
  "I don't use recreational drugs",
] as const;

export const MEALS_PER_DAY = ["1–2", "3", "4+"] as const;
export const EXERCISE_DAYS = ["0", "1–2", "3–4", "5+"] as const;
export const SLEEP_HOURS = ["Less than 5", "5–6", "7–8", "9+"] as const;
export const FAST_FOOD_PER_WEEK = ["0", "1–2", "3–4", "5+"] as const;
export const SUGARY_DRINKS_PER_WEEK = ["0", "1–3", "4–7", "8+"] as const;
export const WATER_INTAKE = [
  "Less than 4 cups",
  "4–6 cups",
  "7–8 cups",
  "More than 8 cups",
] as const;

export const ETHNICITIES = [
  "Asian or South Asian",
  "African American",
  "Caucasian",
  "Hispanic or Latin",
  "Native American or Alaskan",
  "Pacific Islander",
  "Prefer not to say",
] as const;

export const SEX_OPTIONS = ["Male", "Female", "Prefer not to say"] as const;

export type Slot = { d: string; t: string };

export const SLOTS: readonly Slot[] = [
  { d: "Mon Apr 28", t: "9:00 AM" },
  { d: "Mon Apr 28", t: "11:00 AM" },
  { d: "Tue Apr 29", t: "10:00 AM" },
  { d: "Tue Apr 29", t: "2:00 PM" },
  { d: "Wed Apr 30", t: "9:30 AM" },
  { d: "Thu May 1", t: "3:00 PM" },
];
