import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Section, { Heading } from "@/components/Section";
import ExpandableText from "@/components/ExpandableText";
import {
  home,
  hero,
  about,
  skills,
  certificates,
  experience,
  projects,
} from "@/data/content";

// ---- Edit these to whatever you want ----
const ABOUT_HEADING = "Learning by building real things.";
const ADDRESS = "Your street, Barangay, City, Philippines"; // <- put your real address here
// -----------------------------------------

// Project overrides: applied automatically by project name, so no need to touch data/content
const SPLP_IMAGE = "proj1.jpg"; // file: public/projects/proj1.jpg
const SPLP_DESCRIPTION =
  "Smart personalized learning pathway system for students to help them acquire learning materials online and generated quizzes for reviewers. It also showcases their strengths and weaknesses between subjects through visual analytics, and dynamically updates their study schedule with bite-sized lessons to bridge knowledge gaps before exams.";
const withOverrides = (p) =>
  p.name.toLowerCase().includes("smart personalized")
    ? { ...p, image: SPLP_IMAGE, description: SPLP_DESCRIPTION }
    : p;
const projectList = projects
  .filter((p) => !p.name.toLowerCase().includes("library management"))
  .map(withOverrides);

// Certificate placed at number 3 (position 3 in the list)
const CERT_THREE = "CITE Research Conference 2026: CRYPHEX";
const certificateList = (() => {
  const list = certificates.filter((c) => c !== CERT_THREE);
  list.splice(2, 0, CERT_THREE);
  return list;
})();


const num = (i) => String(i + 1).padStart(2, "0");
const initials = (text, max = 4) =>
  text
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, max)
    .toUpperCase();

// One numbered line: 01 | title | details on the right
function Row({ n, title, small = false, children }) {
  return (
    <li className="grid gap-3 border-t border-line py-7 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,24rem)] md:items-start md:gap-8 md:py-9">
      <span className="font-mono text-xs font-bold text-glow md:pt-2">{n}</span>
      <p
        className={`font-extrabold tracking-[-0.03em] ${
          small
            ? "text-xl leading-snug md:text-2xl"
            : "text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.05]"
        }`}
      >
        {title}
      </p>
      {children && (
        <div className="space-y-1 text-[15px] leading-relaxed text-dim md:text-right">
          {children}
        </div>
      )}
    </li>
  );
}

export default function Page() {
  return (
    <>
      <Nav home={home} name={hero.name} />
      <Hero />

      <main>
        {/* ABOUT */}
        <Section id="about">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-[#111114]">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center text-[clamp(5rem,16vw,12rem)] font-extrabold tracking-[-0.06em] text-cream/10"
                >
                  {initials(hero.name, 2)}
                </span>
                {/* Your photo: save it as public/ako.jpg */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[url('/ako.jpg')] bg-cover bg-center"
                />
              </div>
            </div>

            <div>
              <Heading label="about" title={ABOUT_HEADING} />
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/80">
                {about.text}
              </p>
            </div>
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" label="projects" title="Recent projects">
          <ul className="grid gap-x-5 gap-y-14 md:grid-cols-2">
            {projectList.map((p, i) => (
              <li key={p.name} className="group">
                {/* Project picture: set "image" in data/content, e.g. "/projects/my-app.jpg" (file in public/projects/) */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-[#111114] bg-[radial-gradient(ellipse_at_30%_20%,rgba(66,84,232,0.28),transparent_60%)] transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center text-[clamp(4rem,12vw,9rem)] font-extrabold tracking-[-0.06em] text-cream/10"
                  >
                    {initials(p.name)}
                  </span>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    />
                  )}
                  <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1.5 font-mono text-xs font-bold backdrop-blur">
                    {num(i)}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">
                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-transparent decoration-2 underline-offset-8 transition-colors hover:decoration-accent"
                    >
                      {p.name} ↗
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                <div className="mt-2 max-w-md">
                  <ExpandableText
                    text={p.description}
                    lines={3}
                    className="font-mono text-sm leading-relaxed text-dim"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* SKILLS */}
        <Section id="skills" label="skills" title="Tools I work with.">
          <div className="rounded-[2rem] border border-line bg-[#111114] p-7 md:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-dim">
              Tools I use
            </p>
            <ul className="mt-6 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 border-t border-line py-4 text-lg"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-dim" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" label="experience" title="Where I've worked.">
          <ul className="border-b border-line">
            {experience.map((job, i) => (
              <Row key={job.role + job.years} n={num(i)} title={job.role}>
                <p className="text-cream/90">{job.org}</p>
                <p>{job.years}</p>
                <p>{job.points.join(" · ")}</p>
              </Row>
            ))}
          </ul>
        </Section>

        {/* CERTIFICATES */}
        <Section id="certificates" label="certificates" title="Certificates I've earned.">
          <ul className="border-b border-line">
            {certificateList.map((c, i) => (
              <Row key={c} n={num(i)} title={c} small />
            ))}
          </ul>
        </Section>

        {/* CONTACT */}
        <Section id="contact" label="contact" title="Say hello.">
          <div className="rounded-[2rem] border border-line p-8 md:p-14">
            <a
              href={`mailto:${hero.email}`}
              className="block break-all text-[clamp(1.5rem,4.6vw,4.25rem)] font-extrabold leading-tight tracking-[-0.04em] underline decoration-accent decoration-4 underline-offset-[0.2em] transition-colors hover:decoration-cream"
            >
              {hero.email}
            </a>
            <a
              href={`tel:${hero.phone.replace(/\s/g, "")}`}
              className="mt-8 block font-mono text-lg text-dim transition-colors hover:text-cream"
            >
              {hero.phone}
            </a>
            
          </div>
        </Section>
      </main>

      <footer className="px-[var(--gutter)] pb-10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between border-t border-line pt-8 font-mono text-xs text-dim">
          <span>{hero.name}, Manila</span>
          <span>© 2026</span>
        </div>
      </footer>
    </>
  );
}
