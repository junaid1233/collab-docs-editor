import Link from "next/link";
import { RaxhaLogo } from "@/components/brand/RaxhaLogo";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <LoginForm />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted">Built by Muhammad Junaid</p>
        <SocialLinks variant="light" className="mt-3 justify-center" />
        <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to Raxha home
        </Link>
      </div>
    </main>
  );
}
