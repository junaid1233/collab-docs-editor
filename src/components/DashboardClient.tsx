"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type DocumentItem = {
  id: string;
  title: string;
  updatedAt: string;
  owner: { name: string; email: string };
};

type DashboardProps = {
  userName: string;
  owned: DocumentItem[];
  shared: DocumentItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DocumentList({
  documents,
  emptyTitle,
  emptyDescription,
}: {
  documents: DocumentItem[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-slate-50 px-6 py-12 text-center">
        <h3 className="text-lg font-medium text-foreground">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {documents.map((document) => (
        <Link
          key={document.id}
          href={`/documents/${document.id}`}
          className="rounded-xl border border-border bg-card px-5 py-4 transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">{document.title}</h3>
              <p className="mt-1 text-sm text-muted">
                Owner: {document.owner.name} ({document.owner.email})
              </p>
            </div>
            <span className="whitespace-nowrap text-xs text-muted">
              {formatDate(document.updatedAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function DashboardClient({ userName, owned, shared }: DashboardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"owned" | "shared">("owned");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleCreateDocument() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create document");
        return;
      }

      router.push(`/documents/${data.document.id}`);
      router.refresh();
    } catch {
      setError("Failed to create document");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      router.push(`/documents/${data.document.id}`);
      router.refresh();
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Raxha</h1>
            <p className="text-sm text-muted">Welcome, {userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateDocument}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? "Creating..." : "New document"}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload .txt or .md"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            className="hidden"
            onChange={handleUpload}
          />

          <p className="text-sm text-muted">Supported uploads: .txt, .md only</p>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("owned")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              tab === "owned"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            My Documents ({owned.length})
          </button>
          <button
            onClick={() => setTab("shared")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              tab === "shared"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Shared with Me ({shared.length})
          </button>
        </div>

        {tab === "owned" ? (
          <DocumentList
            documents={owned}
            emptyTitle="No documents yet"
            emptyDescription="Create a new document or upload a .txt/.md file to get started."
          />
        ) : (
          <DocumentList
            documents={shared}
            emptyTitle="Nothing shared with you yet"
            emptyDescription="When someone shares a document with your account, it will appear here."
          />
        )}
      </main>
    </div>
  );
}
