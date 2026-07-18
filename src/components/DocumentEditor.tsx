"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
        active
          ? "bg-primary text-white"
          : "bg-white text-foreground hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

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
    extensions: [StarterKit, Underline],
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-4">
          <Link href="/dashboard" className="text-sm text-primary hover:underline">
            ← Dashboard
          </Link>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaveState("unsaved");
            }}
            className="min-w-[240px] flex-1 rounded-lg border border-border px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">
              {saveState === "saved" && "Saved"}
              {saveState === "saving" && "Saving..."}
              {saveState === "unsaved" && "Unsaved changes"}
              {saveState === "error" && "Save failed"}
            </span>
            <button
              onClick={() => void saveDocument()}
              className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Save now
            </button>
            {isOwner ? (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  Share
                </button>
                <button
                  onClick={() => void handleDelete()}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-danger hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            ) : (
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-muted">
                Shared by {ownerEmail}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </ToolbarButton>
          <ToolbarButton
            title="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <div className="rounded-xl border border-border bg-card shadow-sm">
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
