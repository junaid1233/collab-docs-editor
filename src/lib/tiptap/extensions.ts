import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

export const FONT_SIZES = [
  "8pt",
  "9pt",
  "10pt",
  "11pt",
  "12pt",
  "14pt",
  "16pt",
  "18pt",
  "20pt",
  "24pt",
  "28pt",
  "32pt",
  "36pt",
  "48pt",
  "72pt",
] as const;

export const FONT_FAMILIES = [
  { label: "Aptos (Body)", value: "Aptos, 'Segoe UI', sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { label: "Impact", value: "Impact, sans-serif" },
] as const;

export const TEXT_COLORS = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#b7b7b7",
  "#cccccc",
  "#d9ead3",
  "#fce5cd",
  "#cfe2f3",
  "#d9d2e9",
  "#980000",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
] as const;

export const HIGHLIGHT_COLORS = [
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#ff00ff",
  "#ff0000",
  "#0000ff",
  "#fce5cd",
  "#d9ead3",
  "#cfe2f3",
  "#d9d2e9",
  "#ffffff",
  "transparent",
] as const;

export const LINE_SPACINGS = [
  { label: "1.0", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "2.0", value: "2" },
  { label: "2.5", value: "2.5" },
  { label: "3.0", value: "3" },
] as const;

export const HEADING_STYLES = [
  { label: "Normal", level: 0 },
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
  { label: "Heading 4", level: 4 },
  { label: "Title", level: 1 },
  { label: "Subtitle", level: 2 },
] as const;

export const BULLET_STYLES = [
  { label: "Disc", style: "disc" as const },
  { label: "Circle", style: "circle" as const },
  { label: "Square", style: "square" as const },
] as const;

export const NUMBER_STYLES = [
  { label: "1. 2. 3.", type: "decimal" as const },
  { label: "a. b. c.", type: "lower-alpha" as const },
  { label: "A. B. C.", type: "upper-alpha" as const },
  { label: "i. ii. iii.", type: "lower-roman" as const },
  { label: "I. II. III.", type: "upper-roman" as const },
] as const;

export const UNDERLINE_STYLES = [
  { label: "Single", value: "solid" },
  { label: "Double", value: "double" },
  { label: "Dotted", value: "dotted" },
  { label: "Dashed", value: "dashed" },
  { label: "Wavy", value: "wavy" },
] as const;
