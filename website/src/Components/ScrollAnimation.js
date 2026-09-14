"use client";

import { useEffect } from "react";

const useScrollAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 20% of the element is visible
    );

    elements.forEach((el) => observer.observe(el));
  }, []);
};

export default useScrollAnimation;
