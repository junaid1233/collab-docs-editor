import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

export const shareDocumentSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ALLOWED_UPLOAD_EXTENSIONS = [".txt", ".md"] as const;
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "text/plain",
  "text/markdown",
  "text/x-markdown",
  "application/octet-stream",
] as const;

export function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot).toLowerCase();
}

export function isAllowedUpload(filename: string): boolean {
  return ALLOWED_UPLOAD_EXTENSIONS.includes(
    getFileExtension(filename) as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number]
  );
}

export function plainTextToTipTapJson(text: string) {
  const paragraphs = text.split(/\r?\n/);
  return {
    type: "doc",
    content: paragraphs.map((line) => ({
      type: "paragraph",
      content: line
        ? [{ type: "text", text: line }]
        : [],
    })),
  };
}

export function markdownToTipTapJson(text: string) {
  const lines = text.split(/\r?\n/);
  const content: Array<Record<string, unknown>> = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) {
      content.push({ type: "paragraph" });
      continue;
    }

    if (trimmed.startsWith("# ")) {
      content.push({
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: trimmed.slice(2) }],
      });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      content.push({
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: trimmed.slice(3) }],
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      content.push({
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: trimmed.replace(/^[-*]\s+/, "") }],
              },
            ],
          },
        ],
      });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      content.push({
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: trimmed.replace(/^\d+\.\s+/, "") }],
              },
            ],
          },
        ],
      });
      continue;
    }

    content.push({
      type: "paragraph",
      content: [{ type: "text", text: trimmed }],
    });
  }

  return { type: "doc", content };
}
