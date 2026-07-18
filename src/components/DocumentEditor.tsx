"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorToolbar } from "@/components/EditorToolbar";
import { FontSize } from "@/lib/tiptap/extensions";
import {
  CustomBulletList,
  CustomOrderedList,
  LineHeight,
  UnderlineStyle,
} from "@/lib/tiptap/custom-extensions";

type ShareUser = {
  id: string;
  name: string;
  email: string;
};

type DocumentEditorProps = {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  isOwner: boolean;
  ownerEmail: string;
  initialShares: ShareUser[];
};

type SaveState = "saved" | "saving" | "unsaved" | "error";

export function DocumentEditor({
  documentId,
  initialTitle,
  initialContent,
  isOwner,
  ownerEmail,
  initialShares,
}: DocumentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [error, setError] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [shares, setShares] = useState<ShareUser[]>(initialShares);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return { type: "doc", content: [] };
    }
  }, [initialContent]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        heading: { levels: [1, 2, 3, 4] },
      }),
      CustomBulletList,
      CustomOrderedList,
      Underline,
      UnderlineStyle,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LineHeight,
    ],
    content: parsedContent,
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none",
      },
    },
    onUpdate: () => {
      setSaveState("unsaved");
    },
  });

  const saveDocument = useCallback(async () => {
    if (!editor) return;

    setSaveState("saving");
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: JSON.stringify(editor.getJSON()),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setSaveState("error");
        setError(data.error ?? "Failed to save document");
        return;
      }

      setSaveState("saved");
      router.refresh();
    } catch {
      setSaveState("error");
      setError("Failed to save document");
    }
  }, [documentId, editor, title, router]);

  useEffect(() => {
    if (saveState !== "unsaved") return;

    const timer = setTimeout(() => {
      void saveDocument();
    }, 3000);

    return () => clearTimeout(timer);
  }, [saveState, saveDocument, title, editor]);

  async function handleShare(event: React.FormEvent) {
    event.preventDefault();
    setShareLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to share document");
        return;
      }

      setShares((current) => [...current, data.share.user]);
      setShareEmail("");
    } catch {
      setError("Failed to share document");
    } finally {
      setShareLoading(false);
    }
  }

  async function handleUnshare(userId: string) {
    setShareLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/documents/${documentId}/share?userId=${userId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to remove share");
        return;
      }

      setShares((current) => current.filter((share) => share.id !== userId));
    } catch {
      setError("Failed to remove share");
    } finally {
      setShareLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this document? This cannot be undone.")) return;

    const response = await fetch(`/api/documents/${documentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.error ?? "Failed to delete document");
    }
  }

  if (!editor) {
    return <div className="p-8 text-muted">Loading editor...</div>;
  }

  return (
    <div className="word-editor-root min-h-screen">
      <header className="word-editor-header">
        <div className="word-editor-header-inner">
          <Link href="/dashboard" className="word-header-link">
            ← Dashboard
          </Link>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaveState("unsaved");
            }}
            className="word-title-input"
          />
          <div className="word-header-actions">
            <span className="word-save-status">
              {saveState === "saved" && "Saved"}
              {saveState === "saving" && "Saving..."}
              {saveState === "unsaved" && "Unsaved changes"}
              {saveState === "error" && "Save failed"}
            </span>
            <button
              onClick={() => void saveDocument()}
              className="word-header-btn"
            >
              Save now
            </button>
            {isOwner ? (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="word-header-btn word-header-btn-primary"
                >
                  Share
                </button>
                <button
                  onClick={() => void handleDelete()}
                  className="word-header-btn word-header-btn-danger"
                >
                  Delete
                </button>
              </>
            ) : (
              <span className="word-header-shared">
                Shared by {ownerEmail}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="word-editor-workspace">
        <EditorToolbar editor={editor} />

        {error ? (
          <p className="word-editor-error">{error}</p>
        ) : null}

        <div className="word-document-page">
          <EditorContent editor={editor} />
        </div>
      </div>

      {showShareModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Share document</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShare} className="space-y-3">
              <input
                type="email"
                placeholder="user@demo.com"
                value={shareEmail}
                onChange={(event) => setShareEmail(event.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                disabled={shareLoading}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {shareLoading ? "Sharing..." : "Grant access"}
              </button>
            </form>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-muted">People with access</h3>
              {shares.length === 0 ? (
                <p className="text-sm text-muted">Not shared with anyone yet.</p>
              ) : (
                <ul className="space-y-2">
                  {shares.map((share) => (
                    <li
                      key={share.id}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <span>
                        {share.name} ({share.email})
                      </span>
                      <button
                        onClick={() => void handleUnshare(share.id)}
                        className="text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
