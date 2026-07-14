"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Pwd({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      className={`pwd mono${className ? ` ${className}` : ""}`}
      aria-label="Current path"
    >
      <Link href="/" className="pwd__home" title="Home">
        ~
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <span key={href} className="pwd__segment">
            <span className="pwd__slash" aria-hidden="true">
              /
            </span>
            {isLast ? (
              <span className="pwd__current">{decodeURIComponent(segment)}</span>
            ) : (
              <Link href={href}>{decodeURIComponent(segment)}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
