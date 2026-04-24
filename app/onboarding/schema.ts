import { z } from "zod";

export const step1Schema = z.object({
  name: z.string().min(2, "Name is required"),

  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email"),

  phone: z.string().min(8, "Phone number is required"),

  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
});

export const step2Schema = z.object({
  age: z.number().min(16, "Minimum age is 16"),

  height: z
    .string()
    .min(1, "Height is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Height must be a number",
    }),

  currentWeight: z
    .string()
    .min(1, "Current weight required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Weight must be a number",
    }),

  goalWeight: z
    .string()
    .min(1, "Goal weight required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Weight must be a number",
    }),

  photo: z.string().min(1, "Please upload your photo"),
});