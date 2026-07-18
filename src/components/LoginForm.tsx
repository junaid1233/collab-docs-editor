"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RaxhaLogo } from "@/components/brand/RaxhaLogo";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@demo.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <RaxhaLogo size="lg" href="/" className="mb-3" />
        <p className="text-sm text-muted">
          Write together. Format like Word. Share in one click.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-muted">
        <p className="font-medium text-foreground">Demo accounts</p>
        <p className="mt-1">alice@demo.com / password123</p>
        <p>bob@demo.com / password123</p>
      </div>
    </div>
  );
}
