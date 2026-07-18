"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
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

  return (
    <div className={`simple-nav-shell${menuOpen ? " simple-nav--open" : ""}`}>
      <header className="simple-nav" role="banner">
        {/* Left: Brand/Logo in terminal style */}
        <Link href="/" className="simple-nav__logo mono">
          de<span className="simple-nav__logo-x">X</span>cripter<span className="simple-nav__prompt">_</span>
        </Link>

        {/* Right: Navigation Links */}
        <div className="simple-nav__controls">
          <nav className="simple-nav__links" aria-label="Main Navigation">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`simple-nav__link mono${active ? " is-active" : ""}`}
                >
                  <span className="simple-nav__link-prefix">~/</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="simple-nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="simple-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="simple-nav__menu-icon">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          type="button"
          className="simple-nav__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <nav
        className="simple-nav__mobile-menu"
        id="simple-nav-mobile"
        aria-label="Mobile Navigation"
      >
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`simple-nav__mobile-link mono${active ? " is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="simple-nav__mobile-prefix">{active ? "❯" : " "}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
