import ThemeCard from './ThemeCard'
import type { DashboardTheme } from './dashboardThemes'

type ThemeGridProps = {
  themes: DashboardTheme[]
  selectedThemeId: string
  onSelectTheme: (themeId: string) => void
}

function ThemeGrid({ themes, selectedThemeId, onSelectTheme }: ThemeGridProps) {
  return (
    <div className="theme-grid" role="listbox" aria-label="Theme options">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} isSelected={selectedThemeId === theme.id} onSelect={() => onSelectTheme(theme.id)} />
      ))}
    </div>
  )
}

export default ThemeGrid
