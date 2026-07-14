"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/", label: "home" },
  { href: "/chronicle", label: "chronicle" },
  { href: "/blog", label: "blog" },
  { href: "/gallery", label: "gallery" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
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
        <div className="nav__spacer" aria-hidden="true" />
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
