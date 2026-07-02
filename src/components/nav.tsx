"use client";

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

  function isActive(href: string): boolean {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="nav">
      <Link href="/" className="nav__mark">
        de⚡cripter
      </Link>
      <div className="nav__right">
        <nav className="nav__links">
          {links.map((link, i) => (
            <span key={link.href} style={{ display: "contents" }}>
              {i > 0 && <span className="nav__slash">/</span>}
              <Link
                href={link.href}
                className={isActive(link.href) ? "is-active" : ""}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
