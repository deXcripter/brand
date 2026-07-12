"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 420;
const HIDE_DELAY_MS = 280;

export default function RouteProgress() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const pathnameRef = useRef(pathname);
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
    clearTimers();
    activeRef.current = true;
    startedAtRef.current = Date.now();
    setVisible(true);
    setProgress(18);

    trickleIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const step = prev < 40 ? 10 : prev < 70 ? 6 : 2;
        return Math.min(88, prev + step);
      });
    }, 120);
  }

  function finishProgress() {
    if (!activeRef.current) return;

    activeRef.current = false;
    if (trickleIntervalRef.current !== null) {
      window.clearInterval(trickleIntervalRef.current);
      trickleIntervalRef.current = null;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    settleTimeoutRef.current = window.setTimeout(() => {
      setProgress(100);
      settleTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        settleTimeoutRef.current = null;
      }, HIDE_DELAY_MS);
    }, wait);
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let nextUrl: URL;
      try {
        nextUrl = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      const currentUrl = new URL(window.location.href);
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

    // Capture phase so we start before Next.js handles the click.
    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;
    finishProgress();
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
        style={{
          transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})`,
        }}
      />
    </div>
  );
}
