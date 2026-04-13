"use client";

import useOnboarding from "./useOnboarding";
import OnboardingModal from "./OnboardingModal";

export default function OnboardingProvider() {
  const { isOpen, closeOnboarding } = useOnboarding();

  console.log("Provider Rendered", isOpen); // debug

  return (
    <OnboardingModal
    isOpen={isOpen}
    onClose={closeOnboarding}
  />
  );
}