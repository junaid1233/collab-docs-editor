type IconProps = { className?: string; size?: number };

export function IconPaste({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden>
      <rect x="6" y="2" width="10" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4" y="4" width="10" height="14" rx="1" fill="#3b3b3b" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7" y="7" width="6" height="1.2" fill="currentColor" opacity="0.7" />
      <rect x="7" y="10" width="6" height="1.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function IconCut({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 5.5L13 2M6 10.5L13 14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconCopy({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="5" y="1" width="9" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="4" width="9" height="11" rx="1" fill="#3b3b3b" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconFormatPainter({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M2 14h4l7-7-4-4L2 10v4z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 3l4 4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="12" width="5" height="2" fill="#e81123" />
    </svg>
  );
}

export function IconChevronDown({ className, size = 8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className} aria-hidden>
      <path d="M1 2.5L4 5.5L7 2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconGrowFont({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="1" y="12" fontSize="11" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="600">A</text>
      <path d="M11 10V4M8 7h6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconShrinkFont({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="1" y="12" fontSize="9" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="600">A</text>
      <path d="M8 7h6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconClearFormat({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="1" y="12" fontSize="11" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="600">A</text>
      <path d="M10 3l3 3M11 2l3 3-8 8H5l-1-3" fill="none" stroke="#e81123" strokeWidth="1.2" />
    </svg>
  );
}

export function IconTextEffects({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="2" y="13" fontSize="12" fill="#0078d4" fontFamily="Segoe UI, sans-serif" fontWeight="700">A</text>
    </svg>
  );
}

export function IconHighlight({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 12l4-9 6 6-4 3H3z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2" y="13" width="12" height="2" fill="#fff100" />
    </svg>
  );
}

export function IconFontColor({ className, size = 16, color = "#e81123" }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="2" y="11" fontSize="11" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="700">A</text>
      <rect x="2" y="13" width="12" height="2" fill={color} />
    </svg>
  );
}

export function IconBullets({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="3" cy="4" r="1.2" fill="currentColor" />
      <circle cx="3" cy="8" r="1.2" fill="currentColor" />
      <circle cx="3" cy="12" r="1.2" fill="currentColor" />
      <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconNumbering({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="1" y="5.5" fontSize="5" fill="currentColor" fontFamily="Segoe UI, sans-serif">1</text>
      <text x="1" y="9.5" fontSize="5" fill="currentColor" fontFamily="Segoe UI, sans-serif">2</text>
      <text x="1" y="13.5" fontSize="5" fill="currentColor" fontFamily="Segoe UI, sans-serif">3</text>
      <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconMultilevelList({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="2.5" cy="4" r="1" fill="currentColor" />
      <circle cx="4.5" cy="8" r="1" fill="currentColor" />
      <circle cx="2.5" cy="12" r="1" fill="currentColor" />
      <path d="M6 4h8M8 8h6M6 12h8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function IconDecreaseIndent({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M1 4h12M1 8h12M1 12h12M14 8l-2-2v4l2-2z" fill="currentColor" />
    </svg>
  );
}

export function IconIncreaseIndent({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 4h12M3 8h12M3 12h12M1 8l2-2v4l-2-2z" fill="currentColor" />
    </svg>
  );
}

export function IconSort({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="1" y="8" fontSize="7" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="600">A</text>
      <text x="1" y="14" fontSize="7" fill="currentColor" fontFamily="Segoe UI, sans-serif" fontWeight="600">Z</text>
      <path d="M8 4v8M6 6l2-2 2 2M6 10l2 2 2-2" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

export function IconShowMarks({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <text x="4" y="13" fontSize="13" fill="currentColor" fontFamily="Segoe UI, sans-serif">¶</text>
    </svg>
  );
}

export function IconAlignLeft({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M1 3h10M1 6h14M1 9h8M1 12h12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconAlignCenter({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 3h10M1 6h14M4 9h8M2 12h12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconAlignRight({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M5 3h10M1 6h14M7 9h8M3 12h12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconAlignJustify({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M1 3h14M1 6h14M1 9h14M1 12h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconLineSpacing({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M8 1v14M5 3l3-2 3 2M5 13l3 2 3-2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M1 5h4M1 8h4M1 11h4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function IconShading({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M2 12l5-9 7 7-5 4H2z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2" y="13" width="12" height="2" fill="#808080" />
    </svg>
  );
}

export function IconBorders({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="3" y="3" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

export function IconGroupLauncher({ className, size = 8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className} aria-hidden>
      <path d="M1 6L6 1M6 1h-3M6 1v3" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function UnderlinePreview({ style, thickness = "1px" }: { style: string; thickness?: string }) {
  return (
    <span
      className="block h-0 w-full"
      style={{
        borderBottom:
          style === "double"
            ? `${thickness} double currentColor`
            : `${thickness} ${style} currentColor`,
      }}
    />
  );
}
