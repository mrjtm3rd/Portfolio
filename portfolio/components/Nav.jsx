"use client";

import { useEffect, useState } from "react";

// Each id must match a <Section id="..."> in app/page.jsx
const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

// Replace these with your own profile links
const SOCIALS = [
  { label: "FB", name: "Facebook", href: "https://www.facebook.com/" },
  { label: "IG", name: "Instagram", href: "https://www.instagram.com/" },
  { label: "LI", name: "LinkedIn", href: "https://www.linkedin.com/" },
];

export default function Nav({ home, name }) {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = [home.id, ...LINKS.map((l) => l.id)];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id === home.id ? null : e.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [home.id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Sections"
        className="mx-auto flex max-w-[1380px] items-center justify-between gap-3 px-[var(--gutter)] pt-[var(--gutter)]"
      >
        {/* name pill */}
        <a
          href={`#${home.id}`}
          onClick={() => setOpen(false)}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-line bg-page/90 px-5 py-3 text-sm font-bold backdrop-blur"
        >
          {name}
        </a>

        {/* main links (wide screens) */}
        <ul className="pointer-events-auto hidden items-center gap-1 rounded-full bg-cream p-1.5 text-page xl:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active === link.id
                    ? "bg-page text-cream"
                    : "hover:bg-black/10"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* social pill */}
          <ul className="pointer-events-auto hidden items-center gap-5 rounded-full border border-line bg-page/90 px-6 py-3 font-mono text-[11px] font-bold tracking-wide backdrop-blur sm:flex">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="transition-colors hover:text-glow"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          {/* menu button (below wide screens) */}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="pointer-events-auto rounded-full bg-cream px-5 py-3 text-sm font-bold text-page xl:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="pointer-events-auto mx-auto mt-3 max-w-[1380px] px-[var(--gutter)] xl:hidden">
          <ul className="rounded-[1.75rem] border border-line bg-page/95 p-3 backdrop-blur">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-2xl font-extrabold tracking-tight hover:bg-white/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
