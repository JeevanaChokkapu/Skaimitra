import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  Home,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  FolderOpen,
  Mail,
  Phone,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import CommunicationsHub from '../../components/dashboard/CommunicationsHub'
import {
  createCalendarEvent,
  createUser,
  deleteCalendarEvent,
  deleteUser,
  fetchCalendarEvents,
  fetchUsers,
  updateCalendarEvent,
  updateUser,
  type AppUserRole,
  type CalendarEventRecord,
  type SyncedUser,
} from '../../lib/api'
import AIChat from '../../components/dashboard/AIChat'
import AudienceMultiSelect from '../../components/dashboard/AudienceMultiSelect'
import MessageCenter from '../../components/dashboard/MessageCenter'
import ProfileSettingsPanel, { type ProfileSettingsData } from '../../components/dashboard/ProfileSettingsPanel'
import RoleCalendar from '../../components/dashboard/RoleCalendar'
import {
  createFallbackCalendarEvent,
  deleteFallbackCalendarEvent,
  formatAudienceIds,
  getFallbackCalendarEventRecords,
  getInboxMessages,
  loadAnnouncements,
  saveAnnouncements,
  updateFallbackCalendarEvent,
  type AudienceId,
  type DashboardAnnouncement,
} from '../../lib/dashboardData'
import { auth } from '../../lib/firebase'
import '../role-dashboard.css'

type Role = 'student' | 'teacher' | 'admin' | 'parent'
type UserStatus = 'active' | 'inactive'
type ViewMode = 'dashboard' | 'userManagement'

type UserRow = {
  id: number
  name: string
  email: string
  role: Role
  classSubject: string
  phone: string | null
  status: UserStatus
}

const navTabs = [
  { label: 'Home', icon: Home },
  { label: 'Teachers', icon: UserCheck },
  { label: 'Students', icon: Users },
  { label: 'Courses', icon: BookOpen },
  { label: 'Reports', icon: ClipboardList },
  { label: 'Communications', icon: MessageSquare },
  { label: 'Resources', icon: FolderOpen },
  { label: 'System Settings', icon: Settings },
]

const statCards = [
  { title: 'Total Students', value: '120', change: 'Demo data', icon: Users, iconClass: 'role-stat-icon-1' },
  { title: 'Total Teachers', value: '15', change: 'Demo data', icon: UserCheck, iconClass: 'role-stat-icon-2' },
  { title: 'Classes', value: '6 - 12', change: 'Active grades', icon: BookOpen, iconClass: 'role-stat-icon-3' },
  { title: 'Active Courses', value: '10', change: 'Current term', icon: BarChart3, iconClass: 'role-stat-icon-4' },
]

const quickActions = [
  { title: 'User Management', desc: 'Add, edit, or remove users', icon: Users },
  { title: 'Role Permissions', desc: 'Manage user roles and access', icon: Settings },
  { title: 'Course Management', desc: 'Create and manage courses', icon: BookOpen },
  { title: 'View Reports', desc: 'Access analytics and insights', icon: BarChart3 },
]

const teacherOverview = [
  { id: 1, name: 'Anjali Sharma', initials: 'AS', subject: 'Mathematics', email: 'anjali@school.edu', phone: '+91 98765 43211', students: 120, courses: 3 },
  { id: 2, name: 'Ravi Kumar', initials: 'RK', subject: 'Science', email: 'ravi@school.edu', phone: '+91 98765 43213', students: 110, courses: 2 },
  { id: 3, name: 'Meera Joshi', initials: 'MJ', subject: 'English', email: 'meera@school.edu', phone: '+91 98765 43215', students: 115, courses: 3 },
]

const studentOverview = [
  { id: 1, name: 'Rahul Sharma', className: 'Class 6', performance: '91.7%', attendance: '95%' },
  { id: 2, name: 'Priya Reddy', className: 'Class 7', performance: '90%', attendance: '98%' },
  { id: 3, name: 'Arjun Kumar', className: 'Class 8', performance: '82.3%', attendance: '92%' },
]

const courseOverview = [
  { id: 1, name: 'Mathematics - Class 6', teacher: 'Dr. Rajesh Kumar', completion: '75%', students: 40 },
  { id: 2, name: 'Science - Class 7', teacher: 'Ms. Priya Patel', completion: '82%', students: 38 },
  { id: 3, name: 'English - Class 8', teacher: 'Mr. Sharma', completion: '68%', students: 42 },
]

const resourceItems = [
  { id: 1, title: 'Academic Calendar 2026', type: 'Document', owner: 'Administration' },
  { id: 2, title: 'Teacher Handbook', type: 'Guide', owner: 'HR' },
  { id: 3, title: 'Assessment Policy Pack', type: 'Policy', owner: 'Exams Team' },
]

const roleOptions: Role[] = ['parent', 'teacher', 'admin', 'student']
const gradeOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const toTitle = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const ADMIN_SEEN_MESSAGES_KEY = 'skaimitra_seen_messages_admin'
const mapSyncedUser = (user: SyncedUser): UserRow => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  role: user.role as Role,
  classSubject: user.classGrade || 'N/A',
  phone: user.phone,
  status: user.status as UserStatus,
})
const includesSearch = (value: string | number | null | undefined, query: string) =>
  String(value ?? '')
    .toLowerCase()
    .includes(query.trim().toLowerCase())

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const createProfileAvatar = (name: string, colorA = '#2563eb', colorB = '#7c3aed') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#g)" />
      <text x="48" y="56" text-anchor="middle" font-size="32" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${getInitials(name)}</text>
    </svg>
  `)}`

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Home')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [users, setUsers] = useState<UserRow[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('')
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [reportSearchTerm, setReportSearchTerm] = useState('')
  const [resourceSearchTerm, setResourceSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'All' | Role>('All')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userError, setUserError] = useState('')
  const [userInfo, setUserInfo] = useState('')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [adminName, setAdminName] = useState('Admin')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [adminProfile, setAdminProfile] = useState<ProfileSettingsData>({
    name: 'Admin',
    email: 'admin@skaimitra.com',
    phone: '+91 98765 40000',
    subject: 'Administration',
    role: 'Admin',
  })
  const [announcements, setAnnouncements] = useState<DashboardAnnouncement[]>(() => loadAnnouncements())
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([])
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [seenMessageIds, setSeenMessageIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(ADMIN_SEEN_MESSAGES_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null)
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    date: '',
    audienceIds: ['all-teachers-students'] as AudienceId[],
    message: '',
    expiresAt: '',
  })
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    eventType: 'Holiday',
    audienceIds: ['all-users'] as AudienceId[],
    description: '',
  })
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student' as Role,
    classGrade: 'Class 6',
    status: 'active' as UserStatus,
  })
  const [dashboardCounts, setDashboardCounts] = useState({ students: 120, teachers: 15 })
  const [uiNotice, setUiNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const savedName = localStorage.getItem('skaimitra_name')?.trim()
    if (savedName) setAdminName(savedName)
    setAdminProfile((current) => ({
      ...current,
      name: savedName || current.name,
      email: localStorage.getItem('skaimitra_admin_email')?.trim() || current.email,
      phone: localStorage.getItem('skaimitra_admin_phone')?.trim() || current.phone,
      subject: localStorage.getItem('skaimitra_admin_subject')?.trim() || current.subject,
    }))
  }, [])

  useEffect(() => {
    if (!uiNotice) return
    const timeoutId = window.setTimeout(() => setUiNotice(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [uiNotice])

  useEffect(() => {
    const syncSharedData = () => {
      setAnnouncements(loadAnnouncements())
      const nextMessages = getInboxMessages('admin')
      if (nextMessages.length && !selectedMessageId) {
        setSelectedMessageId(nextMessages[0].id)
      }
    }

    syncSharedData()
    window.addEventListener('skaimitra-dashboard-data', syncSharedData)
    return () => window.removeEventListener('skaimitra-dashboard-data', syncSharedData)
  }, [selectedMessageId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ADMIN_SEEN_MESSAGES_KEY, JSON.stringify(seenMessageIds))
  }, [seenMessageIds])

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const token = localStorage.getItem('skaimitra_token') || undefined
        const response = await fetchCalendarEvents({ role: 'admin' }, token)
        setCalendarEvents(response.events)
      } catch {
        setCalendarEvents(getFallbackCalendarEventRecords('admin'))
      }
    }

    void loadCalendar()
    window.addEventListener('skaimitra-calendar-refresh', loadCalendar)
    return () => window.removeEventListener('skaimitra-calendar-refresh', loadCalendar)
  }, [])

  const userStats = useMemo(() => {
    const totalUsers = users.length
    const students = users.filter((u) => u.role === 'student').length
    const teachers = users.filter((u) => u.role === 'teacher').length
    const activeUsers = users.filter((u) => u.status === 'active').length

    return { totalUsers, students, teachers, activeUsers }
  }, [users])

  const classPerformanceData = useMemo(() => {
    const rawByClass = new Map<string, number[]>()

    const add = (className: string, score: number) => {
      const key = className.trim()
      if (!rawByClass.has(key)) rawByClass.set(key, [])
      rawByClass.get(key)?.push(score)
    }

    studentOverview.forEach((student) => {
      const score = Number(String(student.performance).replace('%', ''))
      if (!Number.isNaN(score)) add(student.className, score)
    })

    users.forEach((user) => {
      if (user.role === 'student' && user.classSubject.startsWith('Class')) {
        const userPerf = studentOverview.find((item) => item.name === user.name && item.className === user.classSubject)
        if (userPerf) {
          const score = Number(String(userPerf.performance).replace('%', ''))
          if (!Number.isNaN(score)) add(user.classSubject, score)
        }
      }
    })

    return gradeOptions.map((className) => {
      const scores = rawByClass.get(className) || []
      const avg = scores.length ? scores.reduce((sum, current) => sum + current, 0) / scores.length : 0
      return { className, score: Number(avg.toFixed(1)) }
    })
  }, [users])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      const matchesSearch =
        !normalizedSearch ||
        includesSearch(user.id, normalizedSearch) ||
        includesSearch(user.name, normalizedSearch) ||
        includesSearch(user.email, normalizedSearch) ||
        includesSearch(user.classSubject, normalizedSearch) ||
        includesSearch(user.phone, normalizedSearch) ||
        includesSearch(user.role, normalizedSearch)

      return matchesRole && matchesSearch
    })
  }, [roleFilter, searchTerm, users])

  const filteredTeachers = useMemo(
    () =>
      teacherOverview.filter((teacher) => {
        const query = teacherSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(teacher.id, query) ||
          includesSearch(teacher.name, query) ||
          includesSearch(teacher.initials, query) ||
          includesSearch(teacher.subject, query) ||
          includesSearch(teacher.email, query) ||
          includesSearch(teacher.phone, query) ||
          includesSearch(teacher.students, query) ||
          includesSearch(teacher.courses, query)
        )
      }),
    [teacherSearchTerm],
  )

  const filteredStudents = useMemo(
    () =>
      studentOverview.filter((student) => {
        const query = studentSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(student.id, query) ||
          includesSearch(student.name, query) ||
          includesSearch(student.className, query) ||
          includesSearch(student.performance, query) ||
          includesSearch(student.attendance, query)
        )
      }),
    [studentSearchTerm],
  )

  const filteredCourses = useMemo(
    () =>
      courseOverview.filter((course) => {
        const query = courseSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(course.id, query) ||
          includesSearch(course.name, query) ||
          includesSearch(course.teacher, query) ||
          includesSearch(course.completion, query) ||
          includesSearch(course.students, query)
        )
      }),
    [courseSearchTerm],
  )

  const communicationItems = useMemo(() => {
    const announcementMessages = announcements.map((announcement) => ({
      id: `announcement-${announcement.id}`,
      title: announcement.title,
      description: announcement.message,
      date: announcement.date,
      audience: formatAudienceIds(announcement.audienceIds),
      source: 'announcement' as const,
      relatedAnnouncement: announcement,
      relatedEvent: null,
    }))

    const eventMessages = calendarEvents.map((event) => ({
      id: `event-${event.eventId}`,
      title: event.title,
      description: event.description,
      date: event.date,
      audience:
        event.classSections.length > 0
          ? event.classSections.join(', ')
          : event.visibilityType === 'school'
            ? 'All Users'
            : event.visibilityType === 'teacher'
              ? 'Teachers'
              : 'Students',
      source: 'event' as const,
      relatedAnnouncement: null,
      relatedEvent: event,
    }))

    return [...announcementMessages, ...eventMessages].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
    )
  }, [announcements, calendarEvents])

  const filteredResourceItems = useMemo(
    () =>
      resourceItems.filter((item) => {
        const query = resourceSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.type, query) ||
          includesSearch(item.owner, query)
        )
      }),
    [resourceSearchTerm],
  )

  const recentMessages = useMemo(() => communicationItems.slice(0, 2), [communicationItems])
  const unseenMessages = useMemo(
    () => communicationItems.filter((message) => !seenMessageIds.includes(message.id)),
    [communicationItems, seenMessageIds],
  )

  const saveAdminProfile = (nextProfile: ProfileSettingsData) => {
    setAdminProfile(nextProfile)
    setAdminName(nextProfile.name)
    localStorage.setItem('skaimitra_name', nextProfile.name)
    localStorage.setItem('skaimitra_admin_email', nextProfile.email)
    localStorage.setItem('skaimitra_admin_phone', nextProfile.phone)
    localStorage.setItem('skaimitra_admin_subject', nextProfile.subject)
  }

  const getAuthToken = useCallback(async () => {
    const storedToken = localStorage.getItem('skaimitra_token')
    if (storedToken) return storedToken

    const firebaseUser = auth?.currentUser
    if (!firebaseUser) return null

    const freshToken = await firebaseUser.getIdToken()
    localStorage.setItem('skaimitra_token', freshToken)
    return freshToken
  }, [])

  const loadUsers = useCallback(async () => {
    const token = await getAuthToken()
    if (!token) {
      setUsers([])
      setUserError('Session missing. Please login again.')
      return
    }

    try {
      setIsUsersLoading(true)
      setUserError('')
      const response = await fetchUsers(token, {
        role: roleFilter === 'All' ? undefined : roleFilter,
      })
      setUsers(response.users.map(mapSyncedUser))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load users.'
      setUserError(msg)
    } finally {
      setIsUsersLoading(false)
    }
  }, [getAuthToken, roleFilter])

  const loadDashboardCounts = useCallback(async () => {
    const token = await getAuthToken()
    if (!token) return

    try {
      const response = await fetchUsers(token)
      const all = response.users
      setDashboardCounts({
        students: all.filter((u) => u.role === 'student').length,
        teachers: all.filter((u) => u.role === 'teacher').length,
      })
    } catch {
      // Keep existing values on failure to avoid blocking dashboard.
    }
  }, [getAuthToken])

  useEffect(() => {
    if (viewMode !== 'dashboard') return
    void loadDashboardCounts()
  }, [viewMode, loadDashboardCounts])

  useEffect(() => {
    if (viewMode !== 'userManagement') return
    void loadUsers()
  }, [viewMode, loadUsers])

  const handleBackToDashboard = () => {
    setViewMode('dashboard')
    setUserError('')
    setUserInfo('')
  }

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = await getAuthToken()
    if (!token) {
      setUserError('Session missing. Please login again.')
      return
    }

    try {
      setUserError('')
      if (editingUserId) {
        const updated = await updateUser(token, editingUserId, {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          role: formData.role as AppUserRole,
          classGrade: formData.role === 'admin' ? '' : formData.classGrade,
          status: formData.status,
        })
        setUsers((prev) => prev.map((u) => (u.id === editingUserId ? mapSyncedUser(updated.user) : u)))
        setUserInfo('User updated successfully.')
      } else {
        const created = await createUser(token, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role as AppUserRole,
          classGrade: formData.role === 'admin' ? '' : formData.classGrade,
          status: formData.status,
        })
        setUsers((prev) => [mapSyncedUser(created.user), ...prev])
        setUserInfo(created.defaultPassword ? `User created. Default password: ${created.defaultPassword}` : 'User created.')
      }

      await loadUsers()
      await loadDashboardCounts()

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'student',
        classGrade: 'Class 6',
        status: 'active',
      })
      setEditingUserId(null)
      setIsAddUserOpen(false)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to add user.'
      setUserError(msg)
    }
  }

  const handleOpenAddModal = () => {
    setEditingUserId(null)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'student',
      classGrade: 'Class 6',
      status: 'active',
    })
    setIsAddUserOpen(true)
  }

  const handleOpenEditModal = (user: UserRow) => {
    setEditingUserId(user.id)
    setFormData({
      fullName: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      classGrade: user.role === 'admin' ? '' : user.classSubject === 'N/A' ? 'Class 6' : user.classSubject,
      status: user.status,
    })
    setIsAddUserOpen(true)
  }

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm('Delete this user?')
    if (!confirmed) return

    const token = await getAuthToken()
    if (!token) {
      setUserError('Session missing. Please login again.')
      return
    }

    try {
      await deleteUser(token, userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      await loadUsers()
      await loadDashboardCounts()
      setUserInfo('User deleted successfully.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete user.'
      setUserError(msg)
    }
  }

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      date: '',
      audienceIds: ['all-teachers-students'],
      message: '',
      expiresAt: '',
    })
    setEditingAnnouncementId(null)
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      date: '',
      time: '',
      eventType: 'Holiday',
      audienceIds: ['all-users'],
      description: '',
    })
    setEditingEventId(null)
  }

  const handleSaveAnnouncement = () => {
    if (
      !announcementForm.title.trim() ||
      !announcementForm.date.trim() ||
      !announcementForm.message.trim() ||
      !announcementForm.expiresAt.trim() ||
      announcementForm.audienceIds.length === 0
    ) {
      setUiNotice({ type: 'error', message: 'Please fill all required announcement fields.' })
      return
    }

    const nextAnnouncements = editingAnnouncementId
      ? announcements.map((item) =>
          item.id === editingAnnouncementId
            ? {
                ...item,
                title: announcementForm.title.trim(),
                date: announcementForm.date.trim(),
                audienceIds: announcementForm.audienceIds,
                message: announcementForm.message.trim(),
                expiresAt: announcementForm.expiresAt.trim(),
              }
            : item,
        )
      : [
          {
            id: Date.now(),
            title: announcementForm.title.trim(),
            date: announcementForm.date.trim(),
            audienceIds: announcementForm.audienceIds,
            message: announcementForm.message.trim(),
            expiresAt: announcementForm.expiresAt.trim(),
            createdBy: 'admin' as const,
          },
          ...announcements,
        ]

    setAnnouncements(nextAnnouncements)
    saveAnnouncements(nextAnnouncements)
    setIsAnnouncementOpen(false)
    resetAnnouncementForm()
    setUiNotice({
      type: 'success',
      message: editingAnnouncementId ? 'Announcement updated successfully.' : 'Announcement posted successfully.',
    })
  }

  const markMessagesSeen = useCallback((messageIds: string[]) => {
    if (messageIds.length === 0) return
    setSeenMessageIds((prev) => Array.from(new Set([...prev, ...messageIds])))
  }, [])

  const handleOpenEventModal = () => {
    resetEventForm()
    setIsEventOpen(true)
    setUiNotice(null)
  }

  const handleEditEvent = (eventItem: CalendarEventRecord) => {
    setEditingEventId(eventItem.eventId)
    setEventForm({
      title: eventItem.title,
      date: eventItem.date,
      time: eventItem.time,
      eventType: eventItem.eventType,
      audienceIds: eventItem.classSections.length
        ? eventItem.classSections.map((item) =>
            item.replace(/^Class\s+(\d{1,2})([A-C])?$/i, (_match, classNum: string, section?: string) =>
              section ? `class-${classNum}-${section.toLowerCase()}` : `class-${classNum}`,
            ),
          )
        : eventItem.audienceRoles.includes('admin')
          ? ['all-users']
          : eventItem.audienceRoles.includes('teacher') && eventItem.audienceRoles.includes('student')
            ? ['all-teachers-students']
            : eventItem.audienceRoles.includes('teacher')
              ? ['all-teachers']
              : eventItem.audienceRoles.includes('student')
                ? ['all-students']
                : [],
      description: eventItem.description,
    })
    setIsEventOpen(true)
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.description.trim() || eventForm.audienceIds.length === 0) {
      setUiNotice({ type: 'error', message: 'Please fill all required event fields.' })
      return
    }

    const token = await getAuthToken()
    const applyLocalCalendarSave = () => {
      if (editingEventId) {
        updateFallbackCalendarEvent(editingEventId, {
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
        })
      } else {
        createFallbackCalendarEvent({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
          createdBy: 'admin',
        })
      }

      setCalendarEvents(getFallbackCalendarEventRecords('admin'))
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setIsEventOpen(false)
      resetEventForm()
      setUiNotice({
        type: 'success',
        message: editingEventId ? 'Calendar event updated locally.' : 'Calendar event added locally.',
      })
    }

    try {
      if (!token) {
        applyLocalCalendarSave()
        return
      }

      if (editingEventId) {
        await updateCalendarEvent(token, editingEventId, {
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          date: eventForm.date.trim(),
          time: eventForm.time.trim(),
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
        })
      } else {
        await createCalendarEvent(token, {
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          date: eventForm.date.trim(),
          time: eventForm.time.trim(),
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
        })
      }

      const response = await fetchCalendarEvents({ role: 'admin' }, token)
      setCalendarEvents(response.events)
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setIsEventOpen(false)
      resetEventForm()
      setUiNotice({
        type: 'success',
        message: editingEventId ? 'Calendar event updated successfully.' : 'Calendar event added successfully.',
      })
    } catch (error) {
      console.error(error)
      applyLocalCalendarSave()
    }
  }

  const handleDeleteEvent = async (event: CalendarEventRecord) => {
    const token = await getAuthToken()
    const applyLocalCalendarDelete = () => {
      deleteFallbackCalendarEvent(event.eventId)
      setCalendarEvents(getFallbackCalendarEventRecords('admin'))
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setUiNotice({ type: 'success', message: 'Calendar event deleted locally.' })
    }

    try {
      if (!token) {
        applyLocalCalendarDelete()
        return
      }

      await deleteCalendarEvent(token, event.eventId)
      const response = await fetchCalendarEvents({ role: 'admin' }, token)
      setCalendarEvents(response.events)
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setUiNotice({ type: 'success', message: 'Calendar event deleted successfully.' })
    } catch {
      applyLocalCalendarDelete()
    }
  }

  const handleOpenNotifications = () => {
    const targetMessages = unseenMessages.length ? unseenMessages : communicationItems
    setSelectedMessageId(targetMessages[0]?.id || null)
    setIsMessagesOpen(true)
  }

  const handleCloseNotifications = () => {
    markMessagesSeen((unseenMessages.length ? unseenMessages : communicationItems).map((message) => message.id))
    setIsMessagesOpen(false)
  }

  const handleSelectNotification = (messageId: string) => {
    setSelectedMessageId(messageId)
    markMessagesSeen([messageId])
  }

  const renderDashboardHome = () => (
    <main className="role-main role-main-admin">
      <section className="role-primary">
        <div className="role-stat-grid">
          {statCards.map((card) => {
            const value =
              card.title === 'Total Students'
                ? String(dashboardCounts.students || 120)
                : card.title === 'Total Teachers'
                ? String(dashboardCounts.teachers || 15)
                : card.value

            return (
              <article key={card.title} className="role-card role-stat-card">
                <span className={`role-stat-icon ${card.iconClass}`}>
                  <card.icon size={18} />
                </span>
                <h2 className="role-muted">{card.title}</h2>
                <p className="role-big">{value}</p>
                <p className="role-positive">{card.change}</p>
              </article>
            )
          })}
        </div>

        <section className="role-card role-quick-actions-card">
          <h3 className="role-section-title">Quick Actions</h3>
          <div className="role-action-grid">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                className="role-action-tile"
                onClick={() => {
                  if (action.title === 'User Management') setViewMode('userManagement')
                  if (action.title === 'Role Permissions') setActiveTab('System Settings')
                  if (action.title === 'Course Management') setActiveTab('Courses')
                  if (action.title === 'View Reports') setActiveTab('Reports')
                }}
              >
                <div className="role-action-content">
                  <div className="role-action-head">
                    <action.icon size={16} />
                    <span className="role-action-title">{action.title}</span>
                  </div>
                  <p className="role-action-desc">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="role-card">
          <h3 className="role-section-title">Class Performance Overview</h3>
          <p className="role-muted">Average performance metrics for Class 6 to Class 12</p>
          <div className="role-vertical-chart role-vertical-chart-admin">
            {classPerformanceData.map((item) => (
              <div key={item.className} className="role-vbar-item">
                <div className="role-vbar-track">
                  <div className="role-vbar-fill" style={{ height: `${item.score}%` }} />
                </div>
                <strong>{item.score}%</strong>
                <span>{item.className}</span>
              </div>
            ))}
          </div>
        </section>

      </section>

      <aside className="role-secondary">
        <RoleCalendar
          title="School Calendar"
          events={calendarEvents}
          addButtonLabel="+"
          onAddEvent={handleOpenEventModal}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          emptyMessage="No school events scheduled for this date."
        />

        <section className="role-card role-admin-recent-messages-card">
          <div className="role-section-head">
            <h3 className="role-section-title">Recent Communications</h3>
          </div>
          <div className="role-admin-announcement-list">
            {recentMessages.length ? (
              recentMessages.map((message) => (
                <article key={message.id} className="role-admin-announcement-row">
                  <div className="role-admin-announcement-copy">
                    <h4>{message.title}</h4>
                    <p className="role-muted">{`${message.date} - ${message.audience}`}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="role-muted">No recent communications yet.</p>
            )}
          </div>
        </section>

        <AIChat role="admin" />

      </aside>
    </main>
  )

  const renderOverviewCards = (
    title: string,
    description: string,
    items: Array<{ id: number; title: string; meta: string; submeta?: string; metric?: string; action?: () => void; actionLabel?: string }>,
    searchValue?: string,
    onSearchChange?: (value: string) => void,
    searchPlaceholder?: string,
  ) => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-card role-detail-card">
          <div className="role-section-head">
            <div>
              <h2>{title}</h2>
              <p className="role-muted">{description}</p>
            </div>
          </div>
          {onSearchChange ? (
            <div className="role-user-toolbar role-user-toolbar-search-only">
              <div className="role-user-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
          ) : null}
          <div className="role-detail-grid">
            {items.length ? (
              items.map((item) => (
                <article key={item.id} className="role-card role-mini-card">
                  <div className="role-mini-card-head">
                    <h3>{item.title}</h3>
                    {item.metric ? <span className="role-pill role-pill-student">{item.metric}</span> : null}
                  </div>
                  <p className="role-muted">{item.meta}</p>
                  {item.submeta ? <p className="role-muted">{item.submeta}</p> : null}
                  {item.action ? (
                    <button type="button" className="role-inline-action" onClick={item.action}>
                      {item.actionLabel || 'Open'}
                    </button>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="role-muted">No results found.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  )

  const renderTeachersTab = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Teachers Management</h2>
            <p className="role-muted">Manage teaching staff and their courses</p>
          </div>
          <button type="button" className="role-primary-btn" onClick={() => setViewMode('userManagement')}>
            View All Users
          </button>
        </section>

        <section className="role-admin-summary-grid">
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">{dashboardCounts.teachers || 89}</p>
            <p className="role-muted">Total Teachers</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">156</p>
            <p className="role-muted">Active Courses</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">14:1</p>
            <p className="role-muted">Student-Teacher Ratio</p>
          </article>
        </section>

        <section className="role-card role-admin-staff-card">
          <div className="role-section-head role-admin-communications-head">
            <h3 className="role-section-title">Teaching Staff</h3>
            <div className="role-user-search-wrap role-user-search-inline">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search teachers by name, subject, email, or ID..."
                value={teacherSearchTerm}
                onChange={(e) => setTeacherSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="role-admin-staff-list">
            {filteredTeachers.length ? (
              filteredTeachers.map((teacher) => (
              <article key={teacher.id} className="role-admin-staff-row">
                <div className="role-admin-staff-main">
                  <div className="role-admin-avatar">{teacher.initials}</div>
                  <div className="role-admin-staff-copy">
                    <h4>{teacher.name}</h4>
                    <p className="role-admin-staff-subject">{teacher.subject}</p>
                    <div className="role-admin-contact-row">
                      <span>
                        <Mail size={14} />
                        {teacher.email}
                      </span>
                      <span>
                        <Phone size={14} />
                        {teacher.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="role-admin-staff-load">
                  <strong>{teacher.students} Students</strong>
                  <span>{teacher.courses} Courses</span>
                </div>

                <div className="role-admin-staff-actions">
                  <button type="button" className="role-icon-square-btn" aria-label={`Edit ${teacher.name}`}>
                    <Pencil size={16} />
                  </button>
                  <button type="button" className="role-secondary-btn">
                    View
                  </button>
                </div>
              </article>
              ))
            ) : (
              <p className="role-muted">No teachers match your search.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  )

  const renderStudentsTab = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Students Management</h2>
            <p className="role-muted">Monitor student enrolment and performance</p>
          </div>
          <button type="button" className="role-primary-btn" onClick={() => setViewMode('userManagement')}>
            View All Users
          </button>
        </section>

        <section className="role-admin-summary-grid role-admin-summary-grid-students">
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">1,247</p>
            <p className="role-muted">Total Students</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">420</p>
            <p className="role-muted">Class 6</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">410</p>
            <p className="role-muted">Class 7</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">417</p>
            <p className="role-muted">Class 8</p>
          </article>
        </section>

        <section className="role-admin-student-layout">
          <section className="role-card role-admin-student-card">
            <div className="role-section-head role-admin-communications-head">
              <h3 className="role-section-title">Top Performing Students</h3>
              <div className="role-user-search-wrap role-user-search-inline">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search students by name, class, score, or ID..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="role-admin-student-list">
              {filteredStudents.length ? (
                filteredStudents.map((student) => (
                <article key={student.id} className="role-admin-student-row">
                  <div>
                    <h4>{student.name}</h4>
                    <p className="role-muted">{`${student.className} • ${student.name.split(' ')[0].toLowerCase()}@school.edu`}</p>
                  </div>
                  <div className="role-admin-student-performance">
                    <span className="role-admin-score-pill">{student.performance}</span>
                    <span>{student.attendance} attendance</span>
                  </div>
                </article>
                ))
              ) : (
                <p className="role-muted">No students match your search.</p>
              )}
            </div>
          </section>

          <section className="role-card role-admin-student-card">
            <h3 className="role-section-title">Class Distribution</h3>
            <div className="role-admin-distribution-chart">
              {[
                { name: 'Class 6', value: 420 },
                { name: 'Class 7', value: 410 },
                { name: 'Class 8', value: 417 },
              ].map((item) => (
                <div key={item.name} className="role-admin-distribution-item">
                  <div className="role-admin-distribution-track">
                    <div className="role-admin-distribution-fill" style={{ height: `${Math.round((item.value / 450) * 100)}%` }} />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  )

  const renderCoursesTab = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Course Management</h2>
            <p className="role-muted">Manage courses and curriculum</p>
          </div>
          <button type="button" className="role-primary-btn">
            Create New Course
          </button>
        </section>

        <section className="role-admin-summary-grid">
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">156</p>
            <p className="role-muted">Active Courses</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">1,247</p>
            <p className="role-muted">Enrolled Students</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">78.5%</p>
            <p className="role-muted">Avg Completion</p>
          </article>
        </section>

        <section className="role-card role-admin-course-card">
          <div className="role-section-head role-admin-communications-head">
            <h3 className="role-section-title">All Courses</h3>
            <div className="role-user-search-wrap role-user-search-inline">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search courses by title, teacher, student count, or ID..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="role-admin-course-list">
            {filteredCourses.length ? (
              filteredCourses.map((course) => (
              <article key={course.id} className="role-admin-course-row">
                <div className="role-admin-course-copy">
                  <h4>{course.name}</h4>
                  <p className="role-muted">{`Teacher: ${course.teacher}`}</p>
                  <p className="role-muted">{`${course.students} students enrolled`}</p>
                </div>

                <div className="role-admin-course-progress">
                  <div className="role-admin-course-progress-head">
                    <strong>{course.completion}</strong>
                    <span>completion</span>
                  </div>
                  <div className="role-admin-course-track">
                    <div className="role-admin-course-fill" style={{ width: course.completion }} />
                  </div>
                </div>

                <span className="role-status-badge status-active">active</span>
              </article>
              ))
            ) : (
              <p className="role-muted">No courses match your search.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  )

  const renderCommunicationsTab = () => <CommunicationsHub role="admin" />

  const renderTabContent = () => {
    if (activeTab === 'Home') return renderDashboardHome()
    if (activeTab === 'Teachers') {
      return renderTeachersTab()
    }
    if (activeTab === 'Students') {
      return renderStudentsTab()
    }
    if (activeTab === 'Courses') {
      return renderCoursesTab()
    }
    if (activeTab === 'Reports') {
      return renderOverviewCards(
        'Reports',
        'Access academic, attendance, and system-level reporting views.',
        [
          { id: 1, title: 'Academic Performance Report', meta: 'Class-wise score trends and benchmarks', submeta: 'Updated today' },
          { id: 2, title: 'Attendance Summary', meta: 'Monthly attendance by class and section', submeta: 'Updated yesterday' },
          { id: 3, title: 'Usage Analytics', meta: 'Logins, active courses, and platform activity', submeta: 'Updated 2 hours ago' },
        ].filter(
          (item) =>
            !reportSearchTerm.trim() ||
            includesSearch(item.id, reportSearchTerm) ||
            includesSearch(item.title, reportSearchTerm) ||
            includesSearch(item.meta, reportSearchTerm) ||
            includesSearch(item.submeta, reportSearchTerm),
        ),
        reportSearchTerm,
        setReportSearchTerm,
        'Search reports by title, summary, or ID...',
      )
    }
    if (activeTab === 'Communications') {
      return renderCommunicationsTab()
    }
    if (activeTab === 'Resources') {
      return renderOverviewCards(
        'Resources',
        'Open institutional documents, policy packs, and reusable admin assets.',
        filteredResourceItems.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.type,
          submeta: item.owner,
        })),
        resourceSearchTerm,
        setResourceSearchTerm,
        'Search resources by title, owner, type, or ID...',
      )
    }
    return (
      <main className="role-main role-main-detail">
        <section className="role-primary">
          <section className="role-card role-detail-card">
            <ProfileSettingsPanel
              title="System Settings"
              subtitle="Review and update your admin profile details."
              profile={adminProfile}
              onSave={saveAdminProfile}
              isInline
            />
          </section>
        </section>
      </main>
    )
  }

  return (
    <div className="role-page admin-dashboard-page">
      <section className="role-topbar">
        <header className="role-header">
          <div className="role-brand-block">
            <span className="role-kicker-icon admin-logo-icon" aria-hidden>
              <img src="/SkaiMitra_LogoV2.0.jpg" alt="SkaiMitra logo" className="admin-logo-image" />
            </span>
            <div>
              <h1 className="role-brand-title">SkaiMitra</h1>
              <p className="role-brand-subtitle">
                {viewMode === 'userManagement' ? 'User Management' : `Welcome back, ${adminName}`}
              </p>
            </div>
          </div>
          <div className="role-header-actions">
            <button
              type="button"
              className="role-icon-btn role-icon-btn-bell"
              aria-label="Notifications"
              onClick={handleOpenNotifications}
            >
              <Bell size={20} />
              {unseenMessages.length > 0 ? <span className="role-dot" /> : null}
            </button>
            <button type="button" className="role-icon-btn" aria-label="Settings" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={20} />
            </button>
            <button type="button" className="role-logout-btn" onClick={() => navigate('/')}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {viewMode === 'dashboard' && (
          <nav className="role-tabs admin-role-tabs">
            {navTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={activeTab === tab.label ? 'is-active' : ''}
                onClick={() => setActiveTab(tab.label)}
              >
                <tab.icon size={18} strokeWidth={2.4} className="role-tab-icon" />
                <span className="role-tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        )}
      </section>

      {uiNotice ? (
        <div className={`role-floating-notice ${uiNotice.type === 'success' ? 'is-success' : 'is-error'}`}>
          {uiNotice.message}
        </div>
      ) : null}

      {viewMode === 'dashboard' ? (
        renderTabContent()
      ) : (
        <main className="role-main role-user-main">
          <section className="role-user-back-row">
            <button type="button" className="role-user-back-btn" onClick={handleBackToDashboard}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </section>

          {userError && <p className="role-user-error">{userError}</p>}
          {userInfo && <p className="role-user-info">{userInfo}</p>}

          <section className="role-user-stats">
            <article className="role-card role-user-stat-card">
              <div>
                <p className="role-muted">Total Users</p>
                <p className="role-user-stat-value">{userStats.totalUsers}</p>
              </div>
              <Users size={28} className="role-user-stat-icon icon-blue" />
            </article>
            <article className="role-card role-user-stat-card">
              <div>
                <p className="role-muted">Students</p>
                <p className="role-user-stat-value">{userStats.students}</p>
              </div>
              <UserPlus size={28} className="role-user-stat-icon icon-green" />
            </article>
            <article className="role-card role-user-stat-card">
              <div>
                <p className="role-muted">Teachers</p>
                <p className="role-user-stat-value">{userStats.teachers}</p>
              </div>
              <UserPlus size={28} className="role-user-stat-icon icon-purple" />
            </article>
            <article className="role-card role-user-stat-card">
              <div>
                <p className="role-muted">Active</p>
                <p className="role-user-stat-value">{userStats.activeUsers}</p>
              </div>
              <span className="role-status-badge status-active">Active</span>
            </article>
          </section>

          <section className="role-card role-user-toolbar">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search users by name, email, role, class, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'All' | Role)}>
              <option value="All">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {toTitle(role)}
                </option>
              ))}
            </select>
            <button type="button" className="role-user-add-btn" onClick={handleOpenAddModal}>
              <Plus size={16} />
              Add User
            </button>
          </section>

          <section className="role-card">
            <h2>All Users ({filteredUsers.length})</h2>
            {isUsersLoading && <p className="role-muted">Loading users...</p>}
            <div className="role-table-wrap">
              <table className="role-table role-user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Class/Subject</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-pill role-pill-${user.role}`}>{toTitle(user.role)}</span>
                      </td>
                      <td>{user.classSubject}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {toTitle(user.status)}
                        </span>
                      </td>
                      <td>
                        <div className="role-user-actions">
                          <button type="button" aria-label="Edit user" onClick={() => handleOpenEditModal(user)}>
                            <Pencil size={15} />
                          </button>
                          <button type="button" aria-label="Delete user" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!isUsersLoading && filteredUsers.length === 0 ? <p className="role-muted">No users match your search.</p> : null}
            </div>
          </section>
        </main>
      )}

      {isAddUserOpen && (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setIsAddUserOpen(false)}>
          <section className="role-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-head">
              <h2>{editingUserId ? 'Edit User' : 'Add New User'}</h2>
              <button type="button" onClick={() => setIsAddUserOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form className="role-modal-form" onSubmit={handleCreateUser}>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={Boolean(editingUserId)}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </label>

              <label>
                Role
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value as Role,
                      classGrade: e.target.value === 'admin' ? '' : prev.classGrade || 'Class 6',
                    }))
                  }
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {toTitle(role)}
                    </option>
                  ))}
                </select>
              </label>

              {formData.role !== 'admin' && (
                <label>
                  Class/Grade
                  <select
                    value={formData.classGrade}
                    onChange={(e) => setFormData((prev) => ({ ...prev, classGrade: e.target.value }))}
                  >
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label>
                Status
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as UserStatus }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <div className="role-modal-actions">
                <button type="submit" className="primary">
                  {editingUserId ? 'Save Changes' : 'Add User'}
                </button>
                <button type="button" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isAnnouncementOpen && (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setIsAnnouncementOpen(false)}>
          <section className="role-modal role-announcement-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-head">
              <h2>{editingAnnouncementId ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button
                type="button"
                onClick={() => {
                  setIsAnnouncementOpen(false)
                  resetAnnouncementForm()
                }}
                aria-label="Close announcement modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="role-modal-form">
              <label>
                <span>Title <span className="required-asterisk">*</span></span>
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                <span>Date <span className="required-asterisk">*</span></span>
                <input
                  type="date"
                  value={announcementForm.date}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>

              <label>
                <span>Audience <span className="required-asterisk">*</span></span>
                <AudienceMultiSelect
                  value={announcementForm.audienceIds}
                  onChange={(audienceIds) => setAnnouncementForm((prev) => ({ ...prev, audienceIds }))}
                  placeholder="Search classes, sections, or groups"
                />
                <small className="role-field-hint">Select full classes, specific sections, or broad audience groups.</small>
              </label>

              <label>
                <span>Expiry Date <span className="required-asterisk">*</span></span>
                <input
                  type="date"
                  value={announcementForm.expiresAt}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                />
              </label>

              <label>
                <span>Message <span className="required-asterisk">*</span></span>
                <textarea
                  className="role-announcement-textarea"
                  placeholder="Write the message to be posted to the selected audience."
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={5}
                />
              </label>

              <p className="role-announcement-note">Posted announcements will appear immediately in the communications list.</p>

              <div className="role-modal-actions">
                <button type="button" className="primary" onClick={handleSaveAnnouncement}>
                  {editingAnnouncementId ? 'Save Announcement' : 'Post Announcement'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnnouncementOpen(false)
                    resetAnnouncementForm()
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {isEventOpen && (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setIsEventOpen(false)}>
          <section className="role-modal role-announcement-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-head">
              <h2>{editingEventId ? 'Edit Event' : 'Add Calendar Event'}</h2>
              <button
                type="button"
                onClick={() => {
                  setIsEventOpen(false)
                  resetEventForm()
                }}
                aria-label="Close event modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="role-modal-form">
              <label>
                <span>Event Title <span className="required-asterisk">*</span></span>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                <span>Date <span className="required-asterisk">*</span></span>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>

              <label>
                <span>Time</span>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))}
                />
              </label>

              <label>
                <span>Event Type <span className="required-asterisk">*</span></span>
                <select
                  value={eventForm.eventType}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, eventType: e.target.value }))}
                >
                  <option value="Holiday">Holiday</option>
                  <option value="Parent Teacher Meeting">Parent Teacher Meeting</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Festival">Festival</option>
                  <option value="Celebration">Celebration</option>
                </select>
              </label>

              <label>
                <span>Audience <span className="required-asterisk">*</span></span>
                <AudienceMultiSelect
                  value={eventForm.audienceIds}
                  onChange={(audienceIds) => setEventForm((prev) => ({ ...prev, audienceIds }))}
                  placeholder="Search classes, sections, or groups"
                />
                <small className="role-field-hint">Select multiple classes or sections with checkboxes.</small>
              </label>

              <label>
                <span>Description <span className="required-asterisk">*</span></span>
                <textarea
                  className="role-announcement-textarea"
                  placeholder="Enter event description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </label>

              <div className="role-modal-actions">
                <button type="button" className="primary" onClick={handleSaveEvent}>
                  {editingEventId ? 'Save Event' : '+'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEventOpen(false)
                    resetEventForm()
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <MessageCenter
        isOpen={isMessagesOpen}
        messages={unseenMessages.length ? unseenMessages : communicationItems}
        selectedMessageId={selectedMessageId}
        onClose={handleCloseNotifications}
        onSelect={handleSelectNotification}
      />
      {isSettingsOpen ? (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setIsSettingsOpen(false)}>
          <section className="role-modal teacher-lesson-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-head">
              <h2>System Settings</h2>
              <button type="button" onClick={() => setIsSettingsOpen(false)} aria-label="Close system settings">
                <X size={18} />
              </button>
            </div>
            <ProfileSettingsPanel
              title="Admin Profile"
              subtitle="Review and update your admin profile details."
              profile={adminProfile}
              onSave={saveAdminProfile}
            />
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default AdminDashboard
