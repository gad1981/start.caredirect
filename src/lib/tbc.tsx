import type { ReactNode } from "react";

const BRACKET = /(\[[^\]]+\])/g;

export function withTbc(text: string): ReactNode[] {
  return text.split(BRACKET).map((part, i) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span key={i} className="tbc">
          {part}
        </span>
      );
    }
    return part;
  });
}
