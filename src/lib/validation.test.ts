import { describe, expect, it } from "vitest";
import {
  getFileExtension,
  isAllowedUpload,
  markdownToTipTapJson,
  plainTextToTipTapJson,
} from "./validation";

describe("file upload validation", () => {
  it("accepts txt and md extensions", () => {
    expect(isAllowedUpload("notes.txt")).toBe(true);
    expect(isAllowedUpload("readme.md")).toBe(true);
    expect(getFileExtension("README.MD")).toBe(".md");
  });

  it("rejects unsupported extensions", () => {
    expect(isAllowedUpload("document.docx")).toBe(false);
    expect(isAllowedUpload("image.png")).toBe(false);
    expect(isAllowedUpload("noextension")).toBe(false);
  });
});

describe("content import helpers", () => {
  it("converts plain text lines into TipTap paragraphs", () => {
    const json = plainTextToTipTapJson("Hello\n\nWorld");
    expect(json.type).toBe("doc");
    expect(json.content).toHaveLength(3);
    expect(json.content[0]).toMatchObject({
      type: "paragraph",
      content: [{ type: "text", text: "Hello" }],
    });
  });

  it("converts basic markdown into TipTap nodes", () => {
    const json = markdownToTipTapJson("# Title\n\n- item one\n\n1. first");
    const types = json.content.map((node) => node.type);
    expect(types).toContain("heading");
    expect(types).toContain("bulletList");
    expect(types).toContain("orderedList");
  });
});

describe("document access rules", () => {
  function canAccess(
    document: { ownerId: string; sharedUserIds: string[] },
    userId: string
  ) {
    if (document.ownerId === userId) return true;
    return document.sharedUserIds.includes(userId);
  }

  it("allows owners and shared users", () => {
    const document = { ownerId: "alice", sharedUserIds: ["bob"] };
    expect(canAccess(document, "alice")).toBe(true);
    expect(canAccess(document, "bob")).toBe(true);
  });

  it("denies users without ownership or share", () => {
    const document = { ownerId: "alice", sharedUserIds: ["bob"] };
    expect(canAccess(document, "charlie")).toBe(false);
  });
});
