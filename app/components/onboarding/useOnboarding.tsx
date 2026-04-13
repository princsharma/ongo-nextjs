"use client";

import { useEffect, useState } from "react";

export default function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem("onboarding_done", "true");
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, closeOnboarding };
}