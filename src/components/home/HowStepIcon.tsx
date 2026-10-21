/** Step icons for the home “How a START works” cards (matches the START prototype). */

export function HowStepIcon({ index }: { index: number }) {
  const props = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (index) {
    case 1:
      return (
        <svg {...props}>
          <path d="M4 4h10a4 4 0 014 4v12H8a4 4 0 01-4-4z" />
          <path d="M8 9h6M8 13h6" />
        </svg>
      );
    case 2:
      return (
        <svg {...props}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
      );
    case 3:
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 0:
    default:
      return (
        <svg {...props}>
          <path d="M3 8l9-5 9 5v8l-9 5-9-5z" />
          <path d="M3 8l9 5 9-5" />
          <path d="M12 13v8" />
        </svg>
      );
  }
}
