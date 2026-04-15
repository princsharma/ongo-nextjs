export type OnboardingData = {
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";

  age: number;
  height: string;
  currentWeight: string;
  goalWeight: string;

  photo: string | null;
};