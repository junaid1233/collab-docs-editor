import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Document not found</h1>
        <p className="mt-2 text-muted">
          This document does not exist or you do not have access.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
