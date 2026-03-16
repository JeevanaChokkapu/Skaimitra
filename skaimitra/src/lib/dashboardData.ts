export type DashboardRole = 'admin' | 'teacher' | 'student'

export type AudienceOption =
  | 'All Users'
  | 'All Students'
  | 'Teachers'
  | 'Teachers & Students'
  | 'Admins'
  | 'Class 6'
  | 'Class 6A'
  | 'Class 6B'
  | 'Class 6C'
  | 'Class 7'
  | 'Class 7A'
  | 'Class 7B'
  | 'Class 7C'
  | 'Class 8'
  | 'Class 8A'
  | 'Class 8B'
  | 'Class 8C'
  | 'Class 9'
  | 'Class 9A'
  | 'Class 9B'
  | 'Class 9C'
  | 'Class 10'
  | 'Class 10A'
  | 'Class 10B'
  | 'Class 10C'
  | 'Class 11'
  | 'Class 11A'
  | 'Class 11B'
  | 'Class 11C'
  | 'Class 12'
  | 'Class 12A'
  | 'Class 12B'
  | 'Class 12C'

export type AudienceId = string

export type AudienceTreeNode = {
  id: AudienceId
  label: string
  kind: 'group' | 'class' | 'section'
  children?: AudienceTreeNode[]
}

export type DashboardAnnouncement = {
  id: number
  title: string
  date: string
  audienceIds: AudienceId[]
  message: string
  expiresAt: string
  createdBy: 'admin' | 'teacher'
}

export type CalendarEventType = 'Holiday' | 'Parent Teacher Meeting' | 'Reminder' | 'Festival' | 'Celebration'

export type DashboardCalendarEvent = {
  id: number
  title: string
  date: string
  time?: string
  type: CalendarEventType
  description: string
  audience: AudienceOption[]
  createdBy: 'admin' | 'teacher'
}

export type InboxMessage = {
  id: string
  title: string
  description: string
  date: string
  audience: string
  source: 'announcement' | 'event'
}

const ANNOUNCEMENTS_KEY = 'skaimitra_announcements'
const EVENTS_KEY = 'skaimitra_events'
const classNumbers = ['6', '7', '8', '9', '10', '11', '12'] as const
const sectionLetters = ['A', 'B', 'C'] as const

export const audienceOptions: AudienceOption[] = [
  'All Users',
  'All Students',
  'Teachers',
  'Teachers & Students',
  'Admins',
  'Class 6',
  'Class 6A',
  'Class 6B',
  'Class 6C',
  'Class 7',
  'Class 7A',
  'Class 7B',
  'Class 7C',
  'Class 8',
  'Class 8A',
  'Class 8B',
  'Class 8C',
  'Class 9',
  'Class 9A',
  'Class 9B',
  'Class 9C',
  'Class 10',
  'Class 10A',
  'Class 10B',
  'Class 10C',
  'Class 11',
  'Class 11A',
  'Class 11B',
  'Class 11C',
  'Class 12',
  'Class 12A',
  'Class 12B',
  'Class 12C',
]

const generalAudienceNodes: AudienceTreeNode[] = [
  { id: 'all-users', label: 'All Users', kind: 'group' },
  { id: 'all-students', label: 'Select All Students', kind: 'group' },
  { id: 'all-teachers', label: 'Select All Teachers', kind: 'group' },
  { id: 'all-teachers-students', label: 'Teachers & Students', kind: 'group' },
  { id: 'all-admins', label: 'Admins', kind: 'group' },
]

const classAudienceNodes: AudienceTreeNode[] = classNumbers.map((classNumber) => ({
  id: `class-${classNumber}`,
  label: `Class ${classNumber}`,
  kind: 'class',
  children: sectionLetters.map((section) => ({
    id: `class-${classNumber}-${section.toLowerCase()}`,
    label: `${classNumber}${section}`,
    kind: 'section',
  })),
}))

export const announcementAudienceTree: AudienceTreeNode[] = [...generalAudienceNodes, ...classAudienceNodes]

const audienceIdToLabel = new Map<AudienceId, string>()
const labelToAudienceId = new Map<string, AudienceId>()

function registerAudienceNodes(nodes: AudienceTreeNode[]) {
  nodes.forEach((node) => {
    audienceIdToLabel.set(node.id, node.label)
    labelToAudienceId.set(node.label, node.id)
    if (node.children?.length) registerAudienceNodes(node.children)
  })
}

registerAudienceNodes(announcementAudienceTree)

export const teacherAnnouncementAllowedIds = [
  'all-users',
  'all-admins',
  'all-students',
  'all-teachers',
  'class-6',
  'class-6-a',
  'class-6-b',
  'class-6-c',
  'class-7',
  'class-7-a',
  'class-7-b',
  'class-7-c',
  'class-8',
  'class-8-a',
  'class-8-b',
  'class-8-c',
  'class-9',
  'class-9-a',
  'class-9-b',
  'class-9-c',
  'class-10',
  'class-10-a',
  'class-10-b',
  'class-10-c',
  'class-11',
  'class-11-a',
  'class-11-b',
  'class-11-c',
  'class-12',
  'class-12-a',
  'class-12-b',
  'class-12-c',
]

const teacherAnnouncementAllowedIdSet = new Set<AudienceId>(teacherAnnouncementAllowedIds)

export const classAttendanceData = [
  { className: 'Class 6', attendance: 94 },
  { className: 'Class 7', attendance: 92 },
  { className: 'Class 8', attendance: 95 },
  { className: 'Class 9', attendance: 90 },
  { className: 'Class 10', attendance: 93 },
  { className: 'Class 11', attendance: 89 },
  { className: 'Class 12', attendance: 91 },
]

export const teacherAudienceScope: AudienceOption[] = [
  'All Users',
  'Teachers',
  'Teachers & Students',
  'Class 6',
  'Class 6A',
  'Class 6B',
  'Class 6C',
  'Class 7',
  'Class 7A',
  'Class 7B',
  'Class 7C',
  'Class 8',
  'Class 8A',
  'Class 8B',
  'Class 8C',
]

const defaultAnnouncements: DashboardAnnouncement[] = [
  {
    id: 1,
    title: 'Mid-term Examinations Schedule',
    date: '2026-03-18',
    audienceIds: ['all-students'],
    message: 'Mid-term examinations begin next week. Check the latest timetable and reporting time.',
    expiresAt: '2026-03-25',
    createdBy: 'admin',
  },
  {
    id: 2,
    title: 'Yoga Day Practice',
    date: '2026-03-20',
    audienceIds: ['class-6-a'],
    message: 'Yoga practice for Class 6A will be held in the main ground at 7:30 AM.',
    expiresAt: '2026-03-21',
    createdBy: 'teacher',
  },
  {
    id: 3,
    title: 'Parent Orientation',
    date: '2026-03-22',
    audienceIds: ['all-teachers-students'],
    message: 'Orientation material is now available. Please review the schedule before the meeting.',
    expiresAt: '2026-03-24',
    createdBy: 'admin',
  },
]

const defaultEvents: DashboardCalendarEvent[] = [
  {
    id: 101,
    title: 'School Holiday',
    date: '2026-03-19',
    time: '',
    type: 'Holiday',
    description: 'School remains closed for the local festival holiday.',
    audience: ['All Users'],
    createdBy: 'admin',
  },
  {
    id: 102,
    title: 'Parent Teacher Meeting',
    date: '2026-03-21',
    time: '',
    type: 'Parent Teacher Meeting',
    description: 'Parents and teachers will meet in the main auditorium to review student progress.',
    audience: ['All Students', 'Teachers'],
    createdBy: 'admin',
  },
  {
    id: 103,
    title: 'Class 6A Science Reminder',
    date: '2026-03-23',
    time: '',
    type: 'Reminder',
    description: 'Bring lab coat and observation journal for the science practical.',
    audience: ['Class 6A'],
    createdBy: 'admin',
  },
]

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('skaimitra-dashboard-data'))
}

function ensureDateEnd(dateValue: string) {
  if (!dateValue) return Number.MAX_SAFE_INTEGER
  return new Date(`${dateValue}T23:59:59`).getTime()
}

function normalizeEventType(value: string): CalendarEventType {
  if (value === 'Holiday') return 'Holiday'
  if (value === 'Parent Teacher Meeting') return 'Parent Teacher Meeting'
  if (value === 'Reminder') return 'Reminder'
  if (value === 'Festival') return 'Festival'
  if (value === 'Celebration') return 'Celebration'
  if (value === 'Yoga Day') return 'Celebration'
  if (value === 'Exam') return 'Reminder'
  if (value === 'School Event') return 'Celebration'
  return 'Reminder'
}

function audienceLabelFromClassId(id: string): string | null {
  const classMatch = id.match(/^class-(\d{1,2})$/)
  if (classMatch) return `Class ${classMatch[1]}`

  const sectionMatch = id.match(/^class-(\d{1,2})-([abc])$/)
  if (sectionMatch) return `Class ${sectionMatch[1]}${sectionMatch[2].toUpperCase()}`

  return null
}

function audienceIdFromLegacyLabel(label: string): AudienceId | null {
  return labelToAudienceId.get(label) ?? null
}

function normalizeAnnouncementAudienceIds(item: {
  audienceIds?: AudienceId | AudienceId[]
  audience?: AudienceOption | AudienceOption[] | string | string[]
}) {
  const rawAudiences =
    item.audienceIds !== undefined
      ? Array.isArray(item.audienceIds)
        ? item.audienceIds
        : [item.audienceIds]
      : item.audience !== undefined
        ? Array.isArray(item.audience)
          ? item.audience
          : [item.audience]
        : []

  const normalized = rawAudiences
    .map((audience) => {
      if (typeof audience !== 'string') return null
      if (audienceIdToLabel.has(audience)) return audience

      const mappedLegacyId = audienceIdFromLegacyLabel(audience)
      if (mappedLegacyId) return mappedLegacyId

      const mappedFromClassId = audienceLabelFromClassId(audience)
      if (mappedFromClassId) return audienceIdFromLegacyLabel(mappedFromClassId)

      return null
    })
    .filter((value): value is AudienceId => Boolean(value))

  return Array.from(new Set(normalized))
}

function normalizeAnnouncements(
  items: Array<
    DashboardAnnouncement & {
      audienceIds?: AudienceId | AudienceId[]
      audience?: AudienceOption | AudienceOption[] | string | string[]
    }
  >,
) {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    audienceIds: normalizeAnnouncementAudienceIds(item),
    message: item.message,
    expiresAt: item.expiresAt || '',
    createdBy: item.createdBy,
  }))
}

function normalizeCalendarEvents(items: Array<DashboardCalendarEvent & { audience: AudienceOption | AudienceOption[]; type: string }>) {
  return items.map((item) => ({
    ...item,
    type: normalizeEventType(item.type),
    audience: Array.isArray(item.audience) ? item.audience : [item.audience],
    time: item.time || '',
  }))
}

function getAudienceContext(classGroup: string) {
  const match = classGroup.match(/^Class (\d{1,2})([A-C])?$/i)
  if (!match) return { classId: '', sectionId: '' }

  const classId = `class-${match[1]}`
  const sectionId = match[2] ? `${classId}-${match[2].toLowerCase()}` : ''
  return { classId, sectionId }
}

function matchesAnnouncementAudienceId(audienceId: AudienceId, role: DashboardRole, classGroup: string) {
  if (role === 'admin') return true
  if (audienceId === 'all-users') return true
  if (audienceId === 'all-admins') return false
  if (audienceId === 'all-teachers') return role === 'teacher'
  if (audienceId === 'all-students') return role === 'student'
  if (audienceId === 'all-teachers-students') return role === 'teacher' || role === 'student'

  if (role === 'teacher') {
    return teacherAnnouncementAllowedIdSet.has(audienceId)
  }

  const { classId, sectionId } = getAudienceContext(classGroup)
  if (audienceId === classId) return true
  if (audienceId === sectionId) return true
  return false
}

function isClassAudienceMatch(audience: AudienceOption, classGroup: string) {
  if (!audience.startsWith('Class ')) return false
  if (audience === classGroup) return true

  const [audienceClass] = audience.split(/[A-Z]$/)
  const [userClass] = classGroup.split(/[A-Z]$/)
  return audienceClass.trim() === userClass.trim()
}

function matchesAudience(audience: AudienceOption, role: DashboardRole, classGroup: string) {
  if (role === 'admin') return true
  if (audience === 'All Users') return true
  if (audience === 'Admins') return false
  if (audience === 'Teachers') return role === 'teacher'
  if (audience === 'All Students') return role === 'student'
  if (audience === 'Teachers & Students') return role === 'teacher' || role === 'student'
  if (role === 'student') return isClassAudienceMatch(audience, classGroup)
  if (role === 'teacher') return teacherAudienceScope.includes(audience)
  return false
}

function matchesAnyAudience(audiences: AudienceOption[], role: DashboardRole, classGroup: string) {
  return audiences.some((audience) => matchesAudience(audience, role, classGroup))
}

function matchesAnyAnnouncementAudienceIds(audienceIds: AudienceId[], role: DashboardRole, classGroup: string) {
  return audienceIds.some((audienceId) => matchesAnnouncementAudienceId(audienceId, role, classGroup))
}

export function loadAnnouncements() {
  return normalizeAnnouncements(
    readJson<
      Array<
        DashboardAnnouncement & {
          audienceIds?: AudienceId | AudienceId[]
          audience?: AudienceOption | AudienceOption[] | string | string[]
        }
      >
    >(ANNOUNCEMENTS_KEY, defaultAnnouncements),
  )
}

export function saveAnnouncements(value: DashboardAnnouncement[]) {
  writeJson(ANNOUNCEMENTS_KEY, value)
}

export function loadCalendarEvents() {
  return normalizeCalendarEvents(
    readJson<Array<DashboardCalendarEvent & { audience: AudienceOption | AudienceOption[]; type: string }>>(
      EVENTS_KEY,
      defaultEvents,
    ),
  )
}

export function saveCalendarEvents(value: DashboardCalendarEvent[]) {
  writeJson(EVENTS_KEY, value)
}

function audienceLabelForStorage(id: AudienceId): AudienceOption {
  switch (id) {
    case 'all-users':
      return 'All Users'
    case 'all-students':
      return 'All Students'
    case 'all-teachers':
      return 'Teachers'
    case 'all-teachers-students':
      return 'Teachers & Students'
    case 'all-admins':
      return 'Admins'
    default: {
      const label = getAudienceLabel(id)
      return (label.startsWith('Class ') ? label : `Class ${label}`) as AudienceOption
    }
  }
}

export function createFallbackCalendarEvent(input: {
  title: string
  description: string
  date: string
  time?: string
  eventType: CalendarEventType | string
  audienceIds: AudienceId[]
  createdBy: 'admin' | 'teacher'
}) {
  const nextEvents = [
    {
      id: Date.now(),
      title: input.title.trim(),
      date: input.date.trim(),
      time: input.time?.trim() || '',
      type: normalizeEventType(input.eventType),
      description: input.description.trim(),
      audience: input.audienceIds.map(audienceLabelForStorage),
      createdBy: input.createdBy,
    },
    ...loadCalendarEvents(),
  ]

  saveCalendarEvents(nextEvents)
  return nextEvents
}

export function updateFallbackCalendarEvent(
  eventId: number,
  input: {
    title: string
    description: string
    date: string
    time?: string
    eventType: CalendarEventType | string
    audienceIds: AudienceId[]
  },
) {
  const nextEvents = loadCalendarEvents().map((event) =>
    event.id === eventId
      ? {
          ...event,
          title: input.title.trim(),
          date: input.date.trim(),
          time: input.time?.trim() || '',
          type: normalizeEventType(input.eventType),
          description: input.description.trim(),
          audience: input.audienceIds.map(audienceLabelForStorage),
        }
      : event,
  )

  saveCalendarEvents(nextEvents)
  return nextEvents
}

export function deleteFallbackCalendarEvent(eventId: number) {
  const nextEvents = loadCalendarEvents().filter((event) => event.id !== eventId)
  saveCalendarEvents(nextEvents)
  return nextEvents
}

export function getAudienceLabel(id: AudienceId) {
  return audienceIdToLabel.get(id) ?? id
}

export function getAudienceIdsFromLabels(labels: string[]) {
  return labels
    .map((label) => audienceIdFromLegacyLabel(label))
    .filter((value): value is AudienceId => Boolean(value))
}

export function getAudienceLabels(ids: AudienceId[]) {
  return ids.map(getAudienceLabel)
}

export function formatAudienceIds(ids: AudienceId[]) {
  return getAudienceLabels(ids).join(', ')
}

export function getVisibleAnnouncements(role: DashboardRole, classGroup = 'Class 6A') {
  const now = Date.now()
  return loadAnnouncements()
    .filter((item) => ensureDateEnd(item.expiresAt) >= now)
    .filter((item) => matchesAnyAnnouncementAudienceIds(item.audienceIds, role, classGroup))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getVisibleCalendarEvents(role: DashboardRole, classGroup = 'Class 6A') {
  return loadCalendarEvents()
    .filter((item) => matchesAnyAudience(item.audience, role, classGroup))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getFallbackCalendarEventRecords(
  role: DashboardRole,
  classGroup = 'Class 6A',
  currentRole: DashboardRole = role,
) {
  return getVisibleCalendarEvents(role, classGroup).map((item) => ({
    eventId: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    time: item.time || '',
    eventType: item.type,
    createdById: 0,
    createdByName: item.createdBy === 'admin' ? 'Admin' : 'Teacher',
    audienceRoles:
      item.audience.includes('All Users')
        ? ['admin', 'teacher', 'student', 'parent']
        : item.audience.includes('Teachers & Students')
          ? ['teacher', 'student']
          : item.audience.includes('Teachers')
            ? ['teacher']
            : item.audience.includes('All Students')
              ? ['student']
              : item.audience.includes('Admins')
                ? ['admin']
                : item.audience.some((aud) => aud.startsWith('Class '))
                  ? ['student']
                  : [],
    classSections: item.audience.filter((aud) => aud.startsWith('Class ')),
    visibilityType: (
      item.audience.includes('All Users') || item.audience.includes('Teachers & Students')
        ? 'school'
        : item.audience.includes('Teachers')
          ? 'teacher'
          : 'student'
    ) as 'teacher' | 'student' | 'school',
    canEdit: currentRole === 'admin' || item.createdBy === currentRole,
  }))
}

export function getInboxMessages(role: DashboardRole, classGroup = 'Class 6A'): InboxMessage[] {
  const announcementMessages = getVisibleAnnouncements(role, classGroup).map((item) => ({
    id: `announcement-${item.id}`,
    title: item.title,
    description: item.message,
    date: item.date,
    audience: formatAudienceIds(item.audienceIds),
    source: 'announcement' as const,
  }))

  const eventMessages = getVisibleCalendarEvents(role, classGroup).map((item) => ({
    id: `event-${item.id}`,
    title: item.title,
    description: item.description,
    date: item.date,
    audience: item.audience.join(', '),
    source: 'event' as const,
  }))

  return [...announcementMessages, ...eventMessages].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
