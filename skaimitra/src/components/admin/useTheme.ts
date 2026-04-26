import { useEffect, useMemo, useState } from 'react'
import { dashboardThemes, getDashboardThemeById } from './dashboardThemes'

const applyThemeVariables = (themeId: string) => {
  if (typeof document === 'undefined') return

  const theme = getDashboardThemeById(themeId)
  const root = document.documentElement

  root.style.setProperty('--admin-theme-primary', theme.colors.primary)
  root.style.setProperty('--admin-theme-bg', theme.colors.background)
  root.style.setProperty('--admin-theme-surface', theme.colors.surface)
  root.style.setProperty('--admin-theme-text', theme.colors.text)
  root.style.setProperty('--admin-theme-border', theme.colors.border)
  root.style.setProperty('--admin-theme-muted', theme.colors.muted)
  root.style.setProperty('--admin-theme-accent', theme.colors.accent)
}

export const useTheme = (initialThemeId: string, storageKey: string) => {
  const [themeId, setThemeId] = useState(initialThemeId)

  useEffect(() => {
    applyThemeVariables(themeId)
  }, [themeId])

  const activeTheme = useMemo(() => getDashboardThemeById(themeId), [themeId])

  const saveTheme = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, themeId)
    }
  }

  return {
    themes: dashboardThemes,
    themeId,
    activeTheme,
    setThemeId,
    saveTheme,
  }
}
