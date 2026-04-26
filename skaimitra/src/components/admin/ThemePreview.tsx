import type { CSSProperties } from 'react'
import type { DashboardTheme } from './dashboardThemes'

type ThemePreviewProps = {
  theme: DashboardTheme
}

function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <section className="theme-preview-section">
      <div className="theme-preview-head">
        <h3>Preview</h3>
        <p className="role-muted">See how cards, buttons, and content will look before saving.</p>
      </div>

      <div
        className="theme-preview-shell"
        style={
          {
            '--preview-primary': theme.colors.primary,
            '--preview-bg': theme.colors.background,
            '--preview-surface': theme.colors.surface,
            '--preview-text': theme.colors.text,
            '--preview-border': theme.colors.border,
            '--preview-muted': theme.colors.muted,
            '--preview-accent': theme.colors.accent,
          } as CSSProperties
        }
      >
        <div className="theme-preview-topbar">
          <div>
            <p className="theme-preview-label">Dashboard Header</p>
            <strong>Admin Workspace</strong>
          </div>
          <button type="button" className="theme-preview-secondary-btn">
            Manage
          </button>
        </div>

        <div className="theme-preview-mini-grid">
          <article className="theme-preview-card">
            <p className="theme-preview-label">Dashboard Card</p>
            <strong>Attendance Overview</strong>
            <span>92% students present this week</span>
          </article>

          <article className="theme-preview-card">
            <p className="theme-preview-label">Quick Insight</p>
            <strong>Pending Reviews</strong>
            <span>6 submissions need attention</span>
          </article>
        </div>

        <div className="theme-preview-inline">
          <button type="button" className="theme-preview-primary-btn">
            Primary Button
          </button>
          <button type="button" className="theme-preview-secondary-btn">
            Secondary Button
          </button>
        </div>

        <div className="theme-preview-text-block">
          <h4>Preview Text</h4>
          <p>This preview updates instantly when you choose a theme, so it is easier to compare palettes before saving.</p>
        </div>
      </div>
    </section>
  )
}

export default ThemePreview
