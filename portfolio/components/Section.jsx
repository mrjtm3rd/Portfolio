// Small mono label + big heading, used at the top of every section
export function Heading({ label, title }) {
  return (
    <div>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-dim">
        ( {label} )
      </p>
      <h2 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,6.2vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
        {title}
      </h2>
    </div>
  );
}

// label + title: shows the heading for you
// aside: optional small mono text on the right of the heading
export default function Section({ id, label, title, aside, children }) {
  return (
    <section id={id} className="px-[var(--gutter)] py-24 md:py-36">
      <div className="mx-auto max-w-[1380px]">
        {title && (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Heading label={label} title={title} />
            {aside && (
              <p className="max-w-sm font-mono text-sm leading-relaxed text-dim md:text-right">
                {aside}
              </p>
            )}
          </div>
        )}
        <div className={title ? "mt-14 md:mt-20" : ""}>{children}</div>
      </div>
    </section>
  );
}
