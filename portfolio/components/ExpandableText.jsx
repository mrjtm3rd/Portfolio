"use client";

import { useEffect, useRef, useState } from "react";

// Shows `lines` lines of text. If the text is longer, a "See more" button appears.
export default function ExpandableText({ text, lines = 3, className = "" }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (expanded) return;
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, lines, expanded]);

  const clampStyle = expanded
    ? undefined
    : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
      };

  return (
    <div>
      <p ref={ref} style={clampStyle} className={className}>
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-glow transition-colors hover:text-cream"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
