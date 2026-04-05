export type AppUserRole = 'admin' | 'teacher' | 'student' | 'parent'

export type SyncedUser = {
  id: number
  firebaseUid: string
  fullName: string
  email: string
  phone: string | null
  role: AppUserRole
  classGrade: string | null
  status: 'active' | 'inactive'
}

export type AssistantRole = 'admin' | 'teacher' | 'student'
export type CalendarVisibilityType = 'teacher' | 'student' | 'school'

export type CalendarEventRecord = {
  eventId: number
  title: string
  description: string
  date: string
  time: string
  eventType: string
  createdById: number
  createdByName: string
  audienceRoles: string[]
  classSections: string[]
  visibilityType: CalendarVisibilityType
  canEdit: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const fallbackMessage = `Request failed (${response.status})`
    let message = fallbackMessage

    try {
      const errData = (await response.json()) as { error?: string; message?: string }
      if (errData?.error) message = errData.error
      else if (errData?.message) message = errData.message
    } catch {
      try {
        const text = await response.text()
        if (text?.trim()) message = text.trim()
      } catch {
        message = fallbackMessage
      }
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

export async function syncUser(token: string): Promise<{ user: SyncedUser }> {
  return apiRequest('/api/auth/sync-user', { method: 'POST' }, token)
}

export async function fetchUsers(
  token: string,
  params: { search?: string; role?: string } = {},
): Promise<{ users: SyncedUser[] }> {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.role && params.role !== 'All') query.set('role', params.role)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest(`/api/users${suffix}`, { method: 'GET' }, token)
}

export async function createUser(
  token: string,
  body: {
    fullName: string
    email: string
    phone: string
    role: AppUserRole
    classGrade: string
    status: 'active' | 'inactive'
  },
): Promise<{ user: SyncedUser; defaultPassword?: string }> {
  return apiRequest('/api/users', { method: 'POST', body: JSON.stringify(body) }, token)
}

export async function updateUser(
  token: string,
  userId: number,
  body: {
    fullName: string
    phone: string
    role: AppUserRole
    classGrade: string
    status: 'active' | 'inactive'
  },
): Promise<{ user: SyncedUser }> {
  return apiRequest(`/api/users/${userId}`, { method: 'PATCH', body: JSON.stringify(body) }, token)
}

export async function deleteUser(token: string, userId: number): Promise<{ ok: true }> {
  return apiRequest(`/api/users/${userId}`, { method: 'DELETE' }, token)
}

export async function askAssistant(
  role: AssistantRole,
  question: string,
): Promise<{ answer: string }> {
  return apiRequest('/api/assistant/query', {
    method: 'POST',
    body: JSON.stringify({ role, question }),
  })
}

export async function fetchCalendarEvents(
  params: { role: AssistantRole; classSection?: string },
  token?: string,
): Promise<{ events: CalendarEventRecord[] }> {
  const query = new URLSearchParams({ role: params.role })
  if (params.classSection) query.set('classSection', params.classSection)
  return apiRequest(`/api/calendar-events?${query.toString()}`, { method: 'GET' }, token)
}

export async function createCalendarEvent(
  token: string,
  body: {
    title: string
    description: string
    date: string
    time?: string
    eventType: string
    audienceIds: string[]
  },
): Promise<{ event: CalendarEventRecord }> {
  return apiRequest('/api/calendar-events', { method: 'POST', body: JSON.stringify(body) }, token)
}

export async function updateCalendarEvent(
  token: string,
  eventId: number,
  body: {
    title: string
    description: string
    date: string
    time?: string
    eventType: string
    audienceIds: string[]
  },
): Promise<{ event: CalendarEventRecord }> {
  return apiRequest(`/api/calendar-events/${eventId}`, { method: 'PATCH', body: JSON.stringify(body) }, token)
}

export async function deleteCalendarEvent(
  token: string,
  eventId: number,
): Promise<{ ok: true }> {
  return apiRequest(`/api/calendar-events/${eventId}`, { method: 'DELETE' }, token)
}

export async function createLessonPlan(
  body: {
    title: string
    course: string
    module: string
    className: string
    grade: string
    type: string
    status: string
    description: string
    complianceCode: string
    standards: string
    objectives: string
    materials: string
    activities: string
    assessment: string
    source: string
  },
  token?: string,
): Promise<{ lessonPlan: any }> {
  return apiRequest('/api/lesson-plan/create', { method: 'POST', body: JSON.stringify(body) }, token)
}

export async function fetchLessonPlans(token?: string): Promise<{ lessonPlans: any[] }> {
  return apiRequest('/api/lesson-plans', { method: 'GET' }, token)
}
