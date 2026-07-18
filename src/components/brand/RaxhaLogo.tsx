import Link from "next/link";

const SIZES = {
  sm: { icon: 18, text: "text-base" },
  md: { icon: 22, text: "text-xl" },
  lg: { icon: 28, text: "text-2xl" },
};

export function RaxhaLogo({
  size = "md",
  href,
  theme = "dark",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
  theme?: "dark" | "light";
  className?: string;
}) {
  const { icon, text } = SIZES[size];
  const textClass =
    theme === "light" ? "raxha-logo-text-light" : "raxha-logo-text";

  const content = (
    <>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="raxha-logo-mark shrink-0"
      >
        <rect width="32" height="32" rx="6" fill="#0078d4" />
        <path
          d="M9 10h14v2.5H14.5v9H11.5v-9H9V10zm5.5 5.5h7.5v2.5H14.5v-2.5z"
          fill="#fff"
        />
      </svg>
      <span className={`${textClass} font-semibold tracking-tight ${text}`}>Raxha</span>
    </>
  );

  const classes = `raxha-logo inline-flex items-center gap-2 ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
