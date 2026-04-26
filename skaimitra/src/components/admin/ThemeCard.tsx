import type { DashboardTheme } from './dashboardThemes'

type ThemeCardProps = {
  theme: DashboardTheme
  isSelected: boolean
  onSelect: () => void
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  const swatches = [
    theme.colors.primary,
    theme.colors.background,
    theme.colors.surface,
    theme.colors.text,
    theme.colors.border,
  ]

  return (
    <button type="button" className={`theme-card ${isSelected ? 'is-selected' : ''}`} onClick={onSelect}>
      <div className="theme-card-swatches">
        {swatches.map((color, index) => (
          <span key={`${theme.id}-${index}`} className="theme-card-swatch" style={{ backgroundColor: color }} />
        ))}
      </div>
      <strong>{theme.name}</strong>
    </button>
  )
}

export default ThemeCard
