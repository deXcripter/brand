"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/#about", label: "about" },
  { href: "/chronicle", label: "chronicle" },
  { href: "/gallery", label: "gallery" },
  { href: "/blog", label: "blog" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className={`nav-shell${menuOpen ? " nav-shell--open" : ""}`}>
      <header className="nav">
        <Link href="/" className="nav__mark" aria-label="Johnpaul Nnaji home">
          <svg
            className="nav__mark-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="navBoltGradient" x1="174" y1="88" x2="332" y2="414" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#63F4DF" />
                <stop offset="35%" stopColor="#29C8E6" />
                <stop offset="70%" stopColor="#397AF5" />
                <stop offset="100%" stopColor="#3040B8" />
              </linearGradient>
            </defs>
            <path d="M298 86L182 268H252L216 426L332 220H265L298 86Z" fill="url(#navBoltGradient)" />
          </svg>
        </Link>
        <div className="nav__right">
          <button
            type="button"
            className="nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav__menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="nav__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <nav className="nav__links" id="nav-menu" aria-label="Main">
        {links.map((link, i) => (
          <Fragment key={link.href}>
            {i > 0 && <span className="nav__slash">/</span>}
            <Link
              href={link.href}
              className={isActive(link.href) ? "is-active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
