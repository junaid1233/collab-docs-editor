import Link from "next/link";
import { RaxhaLogo } from "@/components/brand/RaxhaLogo";
import { SocialLinks } from "@/components/brand/SocialLinks";

const FEATURES = [
  {
    title: "Word-style ribbon",
    description: "Familiar dark toolbar with font, paragraph, and formatting controls — zero learning curve.",
  },
  {
    title: "Auto-save",
    description: "Your work saves every 3 seconds automatically. Focus on writing, not saving.",
  },
  {
    title: "Share by email",
    description: "Invite teammates with one email address. Owner and shared access built in.",
  },
  {
    title: "Rich text formatting",
    description: "Bold, italic, underline, headings, lists, colors, alignment, and more.",
  },
  {
    title: "Import files",
    description: "Upload .txt or .md files and continue editing with full formatting support.",
  },
  {
    title: "Organized dashboard",
    description: "My Documents and Shared with Me tabs keep everything easy to find.",
  },
];

const STEPS = [
  { step: "1", title: "Sign in", description: "Create an account or use the demo to get started in seconds." },
  { step: "2", title: "Write & format", description: "Use the Word-style editor with auto-save and rich formatting." },
  { step: "3", title: "Share with anyone", description: "Send documents to teammates by email — they edit instantly." },
];

export function LandingPage() {
  return (
    <div className="raxha-landing">
      <header className="raxha-nav">
        <div className="raxha-container raxha-nav-inner">
          <RaxhaLogo size="md" href="/" />
          <nav className="raxha-nav-links" aria-label="Landing navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </nav>
          <div className="raxha-nav-actions">
            <Link href="/login" className="raxha-btn raxha-btn-ghost">
              Sign In
            </Link>
            <Link href="/login" className="raxha-btn raxha-btn-primary">
              Start Writing
            </Link>
          </div>
        </div>
      </header>

      <section className="raxha-hero">
        <div className="raxha-container raxha-hero-inner">
          <p className="raxha-hero-badge">Collaborative document editor</p>
          <h1 className="raxha-hero-title">
            Documents that feel like Word.
            <br />
            Collaboration that feels simple.
          </h1>
          <p className="raxha-hero-subtitle">
            Write together. Format like Word. Share in one click.
            <br />
            Auto-save, email sharing, and a familiar ribbon toolbar — all in one lightweight app.
          </p>
          <div className="raxha-hero-cta">
            <Link href="/login" className="raxha-btn raxha-btn-primary raxha-btn-lg">
              Start Writing Free
            </Link>
            <Link href="/login" className="raxha-btn raxha-btn-outline raxha-btn-lg">
              Try Demo
            </Link>
          </div>
          <p className="raxha-demo-hint">
            Demo: <code>alice@demo.com</code> / <code>password123</code>
          </p>
        </div>
      </section>

      <section id="features" className="raxha-section">
        <div className="raxha-container">
          <h2 className="raxha-section-title">Everything you need to write together</h2>
          <p className="raxha-section-subtitle">
            Professional editing without enterprise complexity.
          </p>
          <div className="raxha-features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="raxha-feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="raxha-section raxha-section-alt">
        <div className="raxha-container">
          <h2 className="raxha-section-title">How it works</h2>
          <div className="raxha-steps">
            {STEPS.map((item) => (
              <article key={item.step} className="raxha-step-card">
                <span className="raxha-step-num">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="raxha-cta-band">
        <div className="raxha-container raxha-cta-inner">
          <h2>Ready to write?</h2>
          <p>Start your first document in under a minute.</p>
          <Link href="/login" className="raxha-btn raxha-btn-primary raxha-btn-lg">
            Start Writing Free
          </Link>
        </div>
      </section>

      <footer className="raxha-footer">
        <div className="raxha-container raxha-footer-inner">
          <div className="raxha-footer-brand">
            <RaxhaLogo size="sm" />
            <p className="raxha-footer-tagline">
              Write together. Format like Word. Share in one click.
            </p>
          </div>
          <div className="raxha-footer-founder">
            <p className="raxha-footer-built">Built by Muhammad Junaid</p>
            <SocialLinks variant="dark" />
          </div>
          <div className="raxha-footer-bottom">
            <p>© 2026 Raxha. All rights reserved.</p>
            <div className="raxha-footer-links">
              <Link href="/login">Login</Link>
              <a
                href="https://github.com/junaid1233"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
