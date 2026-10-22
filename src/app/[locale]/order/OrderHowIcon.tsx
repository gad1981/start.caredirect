/** Graphic icons for the order “How it works” one-line rail. */

export function OrderHowIcon({ index }: { index: number }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (index % 5) {
    case 0: // program / stages
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h16M4 17h10" />
          <circle cx="18" cy="17" r="2.2" />
        </svg>
      );
    case 1: // country / map pin
      return (
        <svg {...props}>
          <path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.2" />
        </svg>
      );
    case 2: // register / form
      return (
        <svg {...props}>
          <path d="M7 3.5h7l3.5 3.5V20a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 20V5A1.5 1.5 0 017 3.5z" />
          <path d="M14 3.5V7h3.5M8.5 11h7M8.5 14.5h7M8.5 18h4.5" />
        </svg>
      );
    case 3: // confirm / mail
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 8l9 6 9-6" />
        </svg>
      );
    case 4: // receive box
    default:
      return (
        <svg {...props}>
          <path d="M3 8.5l9-4.5 9 4.5v7l-9 4.5-9-4.5z" />
          <path d="M3 8.5l9 4.5 9-4.5M12 13v7" />
        </svg>
      );
  }
}
