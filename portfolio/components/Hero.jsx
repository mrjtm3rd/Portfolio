import { hero, home } from "@/data/content";

// ---- Edit this text to whatever you want ----
const EYEBROW = "IT student — Manila";
const TAGLINE = "Building simple, useful systems & websites.";
const ACTIONS = [
  { label: "Finished Projects", button: "Projects", href: "#projects" },
  { label: "Where I've worked", button: "Experience", href: "#experience" },
  { label: "Tools I use", button: "Skills", href: "#skills" },
  { label: "Let’s work together", button: "Contact", href: "#contact" },
];
// ---------------------------------------------

function Arrow() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M2 10 10 2M4 2h6v6" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id={home.id}
      className="relative flex min-h-[100svh] flex-col px-[var(--gutter)] pb-[var(--gutter)] pt-[calc(var(--gutter)+76px)]"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1380px] flex-1 gap-4 lg:grid-cols-[1.02fr_1fr]">
        {/* left: your picture (save it as public/ako.jpg) */}
        <div
          className="hero-in relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line bg-page sm:min-h-[460px]"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(66,84,232,0.22),transparent_62%)]"
          />
          {/* initials show until the photo is added */}
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-[clamp(6rem,18vw,14rem)] font-extrabold tracking-[-0.06em] text-cream/10"
          >
            {hero.name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div
            role="img"
            aria-label={hero.name}
            className="absolute inset-0 bg-[url('/1.jpg')] bg-cover bg-center"
          />
        </div>

        {/* right: intro panel */}
        <div
          className="hero-in flex flex-col rounded-[2rem] border border-line bg-page p-7 sm:p-10 lg:p-12"
          style={{ animationDelay: "0.25s" }}
        >
          <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-dim">
            {EYEBROW}
          </p>

          <h1 className="mt-8 text-[clamp(3rem,7.2vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            {hero.name}
          </h1>
          <p className="mt-4 max-w-[18ch] text-[clamp(1.75rem,3.6vw,3.5rem)] font-light leading-[1.02] tracking-[-0.03em] text-cream/90">
            {TAGLINE}
          </p>

          <ul className="mt-12 lg:mt-auto lg:pt-12">
            {ACTIONS.map((a) => (
              <li
                key={a.label}
                className="flex items-center justify-between gap-4 border-t border-line py-5 last:border-b"
              >
                <span className="text-lg font-bold tracking-tight md:text-xl">{a.label}</span>
                <a
                  href={a.href}
                  className="flex items-center gap-2 bg-cream px-4 py-2 text-sm font-semibold text-page transition-colors hover:bg-white"
                >
                  {a.button}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
