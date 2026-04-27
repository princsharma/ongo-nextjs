import { z } from "zod";

export const screenIds = [
  "s1", "s2", "s3", "iGood", "iRoad",
  "s4", "s5", "s6", "s7", "s8", "s9", "s9b",
  "s10", "s11", "s12", "s13", "s14", "s15",
  "s16", "s17", "s18", "s19", "s20",
  "s21", "s22", "s23",
  "iConfirm", "iThanks", "dHard", "dSoft",
] as const;

export type ScreenId = (typeof screenIds)[number];

export const numberedScreens = [
  "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9",
  "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17",
  "s18", "s19", "s20", "s21", "s22", "s23",
] as const satisfies readonly ScreenId[];

export const noBackScreens: ReadonlySet<ScreenId> = new Set([
  "s1", "iGood", "iRoad", "dHard", "dSoft", "iConfirm", "iThanks",
]);

export const formSchema = z.object({
  s1: z.string(),
  s2: z.array(z.string()),

  heightFt: z.string(),
  heightIn: z.string(),
  weightLbs: z.string(),

  wtHigh: z.string(),
  wtLow: z.string(),
  wtGoal: z.string(),
  waist: z.string(),

  s5: z.string(),
  s6: z.array(z.string()),

  s7: z.string(),
  s8: z.string(),
  s9: z.string(),
  bariDate: z.string(),

  s10: z.array(z.string()),
  s11: z.array(z.string()),
  s11Other: z.string(),
  s12: z.array(z.string()),
  s13: z.string(),
  s14: z.string(),
  s15: z.string(),

  s16: z.string(),
  s17: z.array(z.string()),

  meals: z.string(),
  exercise: z.string(),
  sleep: z.string(),
  fastFood: z.string(),
  sugary: z.string(),
  water: z.string(),
  stress: z.number().int().min(1).max(10),

  s19: z.array(z.string()),

  email: z.string(),
  consentH: z.boolean(),
  consentT: z.boolean(),

  firstName: z.string(),
  lastName: z.string(),
  dob: z.string(),
  zip: z.string(),
  sex: z.string(),
  phone: z.string(),
  address: z.string(),

  meds: z.string(),
  allergies: z.string(),
  pharmacy: z.string(),

  slot: z.string(),
});

export type Form = z.infer<typeof formSchema>;

export const initialForm: Form = {
  s1: "",
  s2: [],
  heightFt: "",
  heightIn: "",
  weightLbs: "",
  wtHigh: "",
  wtLow: "",
  wtGoal: "",
  waist: "",
  s5: "",
  s6: [],
  s7: "",
  s8: "",
  s9: "",
  bariDate: "",
  s10: [],
  s11: [],
  s11Other: "",
  s12: [],
  s13: "",
  s14: "",
  s15: "",
  s16: "",
  s17: [],
  meals: "",
  exercise: "",
  sleep: "",
  fastFood: "",
  sugary: "",
  water: "",
  stress: 5,
  s19: [],
  email: "",
  consentH: false,
  consentT: false,
  firstName: "",
  lastName: "",
  dob: "",
  zip: "",
  sex: "",
  phone: "",
  address: "",
  meds: "",
  allergies: "",
  pharmacy: "",
  slot: "",
};
