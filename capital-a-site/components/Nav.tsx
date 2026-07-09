"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/advisory", label: "Advisory" },
  { href: "/invest", label: "Invest" },
  { href: "/track-record", label: "Track Record" },
  { href: "/insights", label: "Insights" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)",
        }}
      />
      <Link
        href="/"
        className="relative z-10 text-sm tracking-[0.3em] uppercase text-[#c9a84c] font-light"
      >
        Capital A
      </Link>

      {/* Desktop */}
      <nav className="relative z-10 hidden md:flex items-center gap-8">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile toggle */}
      <button
        className="relative z-10 md:hidden text-white/60 text-xs tracking-widest uppercase"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 z-40">
          <Link
            href="/"
            className="text-2xl tracking-[0.3em] uppercase text-[#c9a84c]"
            onClick={() => setOpen(false)}
          >
            Capital A
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xl tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
