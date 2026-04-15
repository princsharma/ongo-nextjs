"use client";

import { useState, useRef } from "react";
import "./onboarding.css";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

import { step1Schema, step2Schema } from "./schema";

export default function Onboarding() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: 25,
    height: "",
    currentWeight: "",
    goalWeight: "",
    photo: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  // STEP 1 VALIDATION
  const validateStep1 = () => {
    const result = step1Schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((e) => {
        const key = e.path[0] as string;
        fieldErrors[key] = e.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // STEP 2 VALIDATION
  const validateStep2 = () => {
    const result = step2Schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((e) => {
        const key = e.path[0] as string;
        fieldErrors[key] = e.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) setStep(2);
  };

  const handleStep2Next = () => {
    if (validateStep2()) setStep(3);
  };

  const submit = () => {
    console.log("FINAL DATA:", form);
    setStep(4);
  };

  return (
    <>
      {step === 1 && (
        <Step1
          form={form}
          updateField={updateField}
          next={handleStep1Next}
          errors={errors}
        />
      )}

      {step === 2 && (
        <Step2
          form={form}
          updateField={updateField}
          fileRef={fileRef}
          next={handleStep2Next}
          errors={errors}
        />
      )}

      {step === 3 && <Step3 next={submit} />}
      {step === 4 && <Step4 />}
    </>
  );
}