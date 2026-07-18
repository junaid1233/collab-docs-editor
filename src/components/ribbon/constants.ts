export const RIBBON_TABS = [
  "File",
  "Home",
  "Insert",
  "Draw",
  "Design",
  "Layout",
  "References",
  "Mailings",
  "Review",
  "View",
  "Help",
] as const;

export const WORD_UNDERLINE_STYLES = [
  { id: "solid", label: "Single", style: "solid", thickness: "1px" },
  { id: "double", label: "Double", style: "double", thickness: "1px" },
  { id: "thick", label: "Thick", style: "solid", thickness: "3px" },
  { id: "dotted", label: "Dotted", style: "dotted", thickness: "1px" },
  { id: "dashed", label: "Dashed", style: "dashed", thickness: "1px" },
  { id: "dot-dash", label: "Dot dash", style: "dashed", thickness: "1px" },
  { id: "dot-dot-dash", label: "Dot dot dash", style: "dotted", thickness: "1px" },
  { id: "wavy", label: "Wavy", style: "wavy", thickness: "1px" },
] as const;

export const UNDERLINE_COLOR_SWATCHES = [
  "#ffffff",
  "#000000",
  "#e81123",
  "#ff8c00",
  "#fff100",
  "#107c10",
  "#0078d4",
  "#5c2d91",
] as const;
