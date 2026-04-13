"use client";
// import Benefits from "./components/landing page/benifits";
// import CTA from "./components/landing page/cta";
// import Doctors from "./components/landing page/doctors";
// import FAQ from "./components/landing page/faq";
import Hero from "./components/landing page/hero";
import HowItWorks from "./components/landing page/howitworks";
import Medications from "./components/landing page/medications";
import Scrollingbar from "./components/landing page/scrollingbar";
import Glplanding from "./components/landing page/GlpLanding";
import BMICalculator from "./components/landing page/bmi/bmi-calculator";
import useOnboarding from "./components/onboarding/useOnboarding";
import OnboardingProvider from "./components/onboarding/OnboardingProvider";


export default function Home() {
  const { isOpen, closeOnboarding } = useOnboarding();
  return (
    <>
      <Hero />
      <Scrollingbar />
      <Glplanding />
      <BMICalculator />
      {/* <Benefits /> */}
      <Medications />
      <HowItWorks />
      {/* <Doctors /> */}
      {/* <FAQ /> */}
      {/* <CTA /> */}
       {/* ONBOARDING */}
      <OnboardingProvider />

     
    </>
  );
}