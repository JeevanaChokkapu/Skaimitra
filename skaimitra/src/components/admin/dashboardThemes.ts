export type DashboardTheme = {
  id: string
  name: string
  colors: {
    primary: string
    background: string
    surface: string
    text: string
    border: string
    muted: string
    accent: string
  }
}

export const dashboardThemes: DashboardTheme[] = [
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#7c3aed',
      background: '#eef1f5',
      surface: '#ffffff',
      text: '#111827',
      border: '#dbe4ec',
      muted: '#64748b',
      accent: '#f8fafc',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#a855f7',
      background: '#0f172a',
      surface: '#111827',
      text: '#f8fafc',
      border: '#334155',
      muted: '#94a3b8',
      accent: '#1f2937',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: {
      primary: '#2563eb',
      background: '#edf4ff',
      surface: '#ffffff',
      text: '#0f172a',
      border: '#bfdbfe',
      muted: '#475569',
      accent: '#eff6ff',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      primary: '#059669',
      background: '#ecfdf5',
      surface: '#ffffff',
      text: '#064e3b',
      border: '#a7f3d0',
      muted: '#047857',
      accent: '#d1fae5',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      border: '#fdba74',
      muted: '#9a3412',
      accent: '#ffedd5',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0891b2',
      background: '#ecfeff',
      surface: '#ffffff',
      text: '#164e63',
      border: '#67e8f9',
      muted: '#0f766e',
      accent: '#cffafe',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#525252',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#171717',
      border: '#d4d4d4',
      muted: '#737373',
      accent: '#fafafa',
    },
  },
]

export const getDashboardThemeById = (themeId: string) =>
  dashboardThemes.find((theme) => theme.id === themeId) || dashboardThemes[0]
