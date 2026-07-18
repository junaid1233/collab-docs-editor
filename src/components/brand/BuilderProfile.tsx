import { SocialLinks } from "@/components/brand/SocialLinks";
import { RaxhaLogo } from "@/components/brand/RaxhaLogo";

export function BuilderProfile({
  ownedCount,
  sharedCount,
}: {
  ownedCount: number;
  sharedCount: number;
}) {
  return (
    <aside className="dashboard-builder-card">
      <div className="dashboard-builder-header">
        <div className="dashboard-builder-avatar" aria-hidden>
          MJ
        </div>
        <div>
          <p className="dashboard-builder-label">Built by</p>
          <h2 className="dashboard-builder-name">Muhammad Junaid</h2>
          <p className="dashboard-builder-role">AI Engineer</p>
        </div>
      </div>

      <p className="dashboard-builder-bio">
        Full-stack developer & AI engineer. Raxha is a lightweight collaborative document editor
        with Word-style formatting, auto-save, and email sharing.
      </p>

      <div className="dashboard-builder-stats">
        <div className="dashboard-stat">
          <span className="dashboard-stat-value">{ownedCount}</span>
          <span className="dashboard-stat-label">My Documents</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-value">{sharedCount}</span>
          <span className="dashboard-stat-label">Shared with Me</span>
        </div>
      </div>

      <div className="dashboard-builder-links">
        <p className="dashboard-builder-links-label">Connect</p>
        <SocialLinks variant="light" />
      </div>

      <div className="dashboard-builder-footer">
        <RaxhaLogo size="sm" href="/" theme="light" />
        <a
          href="https://junaid-portfolio-mu.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-portfolio-link"
        >
          View portfolio →
        </a>
      </div>
    </aside>
  );
}
