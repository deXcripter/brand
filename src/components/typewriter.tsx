"use client";

import { useEffect, useRef } from "react";

export default function Typewriter() {
  const elRef = useRef<HTMLSpanElement>(null);
  const text = "whoami";

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      el.textContent = text;
      return;
    }

    let i = 0;
    function type() {
      if (i <= text.length) {
        el!.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 90);
      }
    }
    type();
  }, []);

  return (
    <p className="hero__prompt mono">
      <span className="prompt-symbol">$</span>{" "}
      <span ref={elRef} id="typed"></span>
      <span className="cursor-blink">_</span>
    </p>
  );
}
