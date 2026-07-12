"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const HIDE_DELAY_MS = 220;

export default function RouteProgress() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeRef = useRef(false);
  const settleTimeoutRef = useRef<number | null>(null);
  const trickleIntervalRef = useRef<number | null>(null);

  function clearTimers() {
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
    if (trickleIntervalRef.current !== null) {
      window.clearInterval(trickleIntervalRef.current);
      trickleIntervalRef.current = null;
    }
  }

  function startProgress() {
    if (activeRef.current) return;
    activeRef.current = true;

    clearTimers();
    setVisible(true);
    setProgress(12);

    trickleIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 86) return prev;
        const step = prev < 40 ? 9 : prev < 70 ? 5 : 2;
        return Math.min(86, prev + step);
      });
    }, 140);
  }

  function finishProgress() {
    if (!activeRef.current) return;

    activeRef.current = false;
    if (trickleIntervalRef.current !== null) {
      window.clearInterval(trickleIntervalRef.current);
      trickleIntervalRef.current = null;
    }

    setProgress(100);
    settleTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
      settleTimeoutRef.current = null;
    }, HIDE_DELAY_MS);
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const nextUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      // Only show progress for same-origin route changes that should trigger Next navigation.
      if (nextUrl.origin !== currentUrl.origin) return;
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search
      ) {
        return;
      }

      startProgress();
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Any route update means navigation settled.
  useEffect(() => {
    finishProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      className={`route-progress${visible ? " is-visible" : ""}`}
      aria-hidden="true"
    >
      <span
        className="route-progress__bar"
        style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }}
      />
    </div>
  );
}
