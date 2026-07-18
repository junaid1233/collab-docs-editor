"use client";

import dynamic from "next/dynamic";

const DocumentEditor = dynamic(
  () => import("@/components/DocumentEditor").then((mod) => mod.DocumentEditor),
  {
    ssr: false,
    loading: () => <div className="p-8 text-muted">Loading editor...</div>,
  }
);

export { DocumentEditor };
