"use client";

import type { Editor } from "@tiptap/react";
import { WordRibbon } from "./ribbon/WordRibbon";

export function EditorToolbar({ editor }: { editor: Editor }) {
  return <WordRibbon editor={editor} />;
}
