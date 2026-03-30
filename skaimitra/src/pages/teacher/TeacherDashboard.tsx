import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BarChart,
  BookOpen,
  ClipboardList,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Pencil,
  PenLine,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import {
  askAssistant,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvents,
  updateCalendarEvent,
  type CalendarEventRecord,
} from '../../lib/api'
import AudienceMultiSelect from '../../components/dashboard/AudienceMultiSelect'
import MessageCenter from '../../components/dashboard/MessageCenter'
import RoleCalendar from '../../components/dashboard/RoleCalendar'
import {
  createFallbackCalendarEvent,
  deleteFallbackCalendarEvent,
  formatAudienceIds,
  getFallbackCalendarEventRecords,
  teacherAnnouncementAllowedIds,
  type AudienceId,
  getInboxMessages,
  loadAnnouncements,
  saveAnnouncements,
  updateFallbackCalendarEvent,
  type DashboardAnnouncement,
  type InboxMessage,
} from '../../lib/dashboardData'
import '../role-dashboard.css'

type TeacherTab =
  | 'Home'
  | 'Lesson Planning'
  | 'Lab Activity Designer'
  | 'Assignments'
  | 'Grades'
  | 'Reports'
  | 'Content Upload'
  | 'Content Library'
  | 'Resources'

type TeacherAnnouncement = {
  title: string
  audienceIds: AudienceId[]
  message: string
  expiresAt: string
}

const navTabs: Array<{ label: TeacherTab; icon: typeof Home }> = [
  { label: 'Home', icon: Home },
  { label: 'Lesson Planning', icon: BookOpen },
  { label: 'Lab Activity Designer', icon: FlaskConical },
  { label: 'Assignments', icon: ClipboardList },
  { label: 'Grades', icon: PenLine },
  { label: 'Reports', icon: BarChart },
  { label: 'Content Library', icon: Upload },
  { label: 'Resources', icon: FolderOpen },
]

// Data needed for Reports tab (student performance details)
const submissionData = [
  { name: 'Class 6', onTime: 80, late: 10, missing: 10 },
  { name: 'Class 7', onTime: 70, late: 15, missing: 15 },
  { name: 'Class 8', onTime: 85, late: 8, missing: 7 },
]

const performanceTrend = [
  { week: 'Week 1', score: 72 },
  { week: 'Week 2', score: 75 },
  { week: 'Week 3', score: 68 },
  { week: 'Week 4', score: 78 },
  { week: 'Week 5', score: 76 },
  { week: 'Week 6', score: 80 },
]

const statCards = [
  { title: 'My Courses', value: '4', icon: BookOpen, iconClass: 'role-stat-icon-1' },
  { title: 'Total Students', value: '145', icon: Users, iconClass: 'role-stat-icon-2' },
  { title: 'Pending Submissions', value: '23', icon: ClipboardList, iconClass: 'role-stat-icon-3' },
  { title: 'Avg. Performance', value: '82%', icon: GraduationCap, iconClass: 'role-stat-icon-4' },
]

const pendingGrading = [
  { assignment: 'Algebra Quiz - Chapter 4', dueDate: '20 Feb 2026', course: 'Mathematics', assignmentType: 'Quiz', className: 'Class 6', section: 'A' },
  { assignment: 'Geometry Assignment', dueDate: '22 Feb 2026', course: 'Mathematics', assignmentType: 'Assignment', className: 'Class 7', section: 'B' },
]

const recentActivity = [
  { title: 'New submission', desc: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
  { title: 'Assignment graded', desc: 'Completed grading for 5 students', time: '4 hours ago' },
]

type LessonPlanStatus = 'Draft' | 'Active' | 'Inactive' | 'Deleted'

type LessonPlanCreator = 'teacher' | 'external'

type LessonPlanSource = 'Custom' | 'External' | 'AI'

type LessonPlanAsset = {
  id: string
  name: string
  size: number
  uploadedAt: string
}

type LessonPlan = {
  id: number
  course: string
  module: string
  source: LessonPlanSource
  externalUrl?: string
  aiPrompt?: string
  assets: LessonPlanAsset[]
  shareOption: 'None' | 'Global' | 'Users'
  sharedWithUserEmails: string[]
  className: string
  classNames: string[]
  classSections: string[]
  grade: string
  title: string
  subject: string
  date: string
  status: LessonPlanStatus
  type: 'Lesson' | 'Project' | 'Discussion' | 'Custom'
  complianceCode: string
  objectives: string
  materials: string
  activities: string
  assessment: string
  standards: string
  author: string
  createdBy: LessonPlanCreator
  assignedApprover?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

const initialLessonPlans: LessonPlan[] = [
  {
    id: 1,
    course: 'Mathematics',
    module: 'Algebra',
    className: 'Class 6',
    classNames: ['Class 6'],
    classSections: ['A'],
    grade: 'Grade 6',
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    date: '2026-02-18',
    status: 'Active',
    type: 'Lesson',
    source: 'Custom',
    externalUrl: '',
    aiPrompt: '',
    complianceCode: 'CBSE901A',
    objectives: 'Understand variables, expressions, and solving basic equations.',
    assets: [],
    shareOption: 'None',
    sharedWithUserEmails: [],
    materials: 'Textbook, whiteboard, markers, practice worksheet.',
    activities: 'Warm-up quiz, guided practice, independent practice, peer review.',
    assessment: 'Exit ticket quiz + homework problems.',
    standards: 'CBSE Math 6.1, 6.2, 6.3',
    author: 'Mr. Sharma',
    createdBy: 'teacher',
    assignedApprover: 'Mrs. Agarwal',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-18T09:00:00Z',
    publishedAt: '2026-02-18T09:15:00Z',
  },
  {
    id: 2,
    course: 'Science',
    module: 'Biology',
    className: 'Class 7',
    classNames: ['Class 7'],
    classSections: ['B'],
    grade: 'Grade 7',
    title: 'Photosynthesis Process',
    subject: 'Science',
    date: '2026-02-19',
    status: 'Draft',
    type: 'Lesson',
    source: 'External',
    externalUrl: 'https://example.com/photosynthesis-plan',
    aiPrompt: '',
    complianceCode: 'CBSE417',
    objectives: 'Explain the process of photosynthesis and identify reactants/products.',
    assets: [],
    shareOption: 'Users',
    sharedWithUserEmails: ['student@school.edu'],
    materials: 'Plant samples, sunlight, lab journal, videos.',
    activities: 'Lab observation, group discussion, diagram labeling.',
    assessment: 'Short quiz and lab report.',
    standards: 'CBSE Science 7.4',
    author: 'External Contributor',
    createdBy: 'external',
    assignedApprover: 'Mr. Sharma',
    createdAt: '2026-02-17T14:00:00Z',
    updatedAt: '2026-02-18T15:30:00Z',
  },
  {
    id: 3,
    course: 'English',
    module: 'Grammar',
    className: 'Class 6',
    classNames: ['Class 6'],
    classSections: ['A'],
    grade: 'Grade 6',
    title: 'English Grammar Basics',
    subject: 'English',
    date: '2026-02-20',
    status: 'Active',
    type: 'Lesson',
    source: 'AI',
    externalUrl: '',
    aiPrompt: 'Generate a 45-minute grammar lesson plan for grade 6 focused on nouns, verbs, and adjectives.',
    complianceCode: 'CBSE901B',
    objectives: 'Identify nouns, verbs, adjectives, and build simple sentences.',
    assets: [],
    shareOption: 'Global',
    sharedWithUserEmails: [],
    materials: 'Worksheets, flashcards, projector.',
    activities: 'Sentence construction game, group exercises, peer editing.',
    assessment: 'Grammar worksheet and oral questioning.',
    standards: 'CBSE English 6',
    author: 'Ms. Khanna',
    createdBy: 'teacher',
    createdAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-02-20T08:30:00Z',
    publishedAt: '2026-02-20T09:00:00Z',
  },
]

const labActivities = [
  { id: 1, title: 'Chemistry Lab: Acid-Base Reactions', className: 'Class 8', duration: '45 min', status: 'Active' },
  { id: 2, title: 'Physics Lab: Simple Pendulum', className: 'Class 7', duration: '60 min', status: 'Scheduled' },
  { id: 3, title: 'Biology Lab: Cell Structure', className: 'Class 6', duration: '50 min', status: 'Completed' },
]

const assignments = [
  { id: 1, title: 'Algebra Quiz', className: 'Class 6', dueDate: '20 Feb 2026', submissions: 35, total: 40 },
  { id: 2, title: 'Science Project', className: 'Class 7', dueDate: '22 Feb 2026', submissions: 28, total: 38 },
  { id: 3, title: 'Essay Writing', className: 'Class 8', dueDate: '25 Feb 2026', submissions: 30, total: 42 },
]

const gradeRows = [
  { id: 1, name: 'Aarav Mehta', className: 'Class 6', math: 95, science: 92, english: 88, overall: 92 },
  { id: 2, name: 'Diya Sharma', className: 'Class 7', math: 88, science: 90, english: 92, overall: 90 },
  { id: 3, name: 'Rohan Verma', className: 'Class 8', math: 82, science: 85, english: 80, overall: 82 },
]

const uploads = [
  { id: 1, title: 'Chapter 4 - Algebra.pdf', type: 'PDF', updated: '2.4 MB • Feb 15, 2026' },
  { id: 2, title: 'Science Presentation.pptx', type: 'PPTX', updated: '5.1 MB • Feb 14, 2026' },
  { id: 3, title: 'Lecture Video.mp4', type: 'MP4', updated: '45.3 MB • Feb 13, 2026' },
]

const resources = [
  { id: 1, title: 'AI Lesson Plan Templates', type: 'Template Pack', audience: 'All Classes' },
  { id: 2, title: 'Lab Safety Checklist', type: 'Guide', audience: 'Science Teachers' },
  { id: 3, title: 'Assessment Rubrics', type: 'Rubric', audience: 'All Subjects' },
]

const includesSearch = (value: string | number | null | undefined, query: string) =>
  String(value ?? '')
    .toLowerCase()
    .includes(query.trim().toLowerCase())

function TeacherDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TeacherTab>('Home')
  const [homeSearchTerm, setHomeSearchTerm] = useState('')
  const [lessonSearchTerm, setLessonSearchTerm] = useState('')
  const [labSearchTerm, setLabSearchTerm] = useState('')
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('')
  const [gradeSearchTerm, setGradeSearchTerm] = useState('')
  const [uploadSearchTerm, setUploadSearchTerm] = useState('')
  const [resourceSearchTerm, setResourceSearchTerm] = useState('')
  const [teacherName, setTeacherName] = useState('Teacher')
  const [lessonPlansState, setLessonPlansState] = useState<LessonPlan[]>(initialLessonPlans)
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false)
  const [editingLessonPlanId, setEditingLessonPlanId] = useState<number | null>(null)
  const [lessonPlanForm, setLessonPlanForm] = useState<LessonPlan>({
    id: 0,
    course: '',
    module: '',
    className: '',
    classNames: [],
    classSections: [],
    grade: '',
    title: '',
    subject: '',
    date: '',
    status: 'Draft',
    type: 'Lesson',
    source: 'Custom',
    externalUrl: '',
    aiPrompt: '',
    complianceCode: '',
    objectives: '',
    materials: '',
    activities: '',
    assessment: '',
    standards: '',
    assets: [],
    shareOption: 'None',
    sharedWithUserEmails: [],
    author: 'Teacher',
    createdBy: 'teacher',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  const [question, setQuestion] = useState('')
  const [assistantReply, setAssistantReply] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [announcements, setAnnouncements] = useState<DashboardAnnouncement[]>(() => loadAnnouncements())
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null)
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState<TeacherAnnouncement>({
    title: '',
    audienceIds: ['all-teachers-students'],
    message: '',
    expiresAt: '',
  })
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([])
  const [calendarNotice, setCalendarNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    audienceIds: ['all-users'] as AudienceId[],
    eventType: 'Reminder',
  })

  useEffect(() => {
    const savedName = localStorage.getItem('skaimitra_name')?.trim()
    if (savedName) setTeacherName(savedName)
  }, [])

  useEffect(() => {
    if (!calendarNotice) return
    const timeoutId = window.setTimeout(() => setCalendarNotice(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [calendarNotice])

  useEffect(() => {
    const syncMessages = () => {
      setAnnouncements(loadAnnouncements())
      const nextMessages = getInboxMessages('teacher')
      setMessages(nextMessages)
      if (nextMessages.length && !selectedMessageId) {
        setSelectedMessageId(nextMessages[0].id)
      }
    }

    syncMessages()
    window.addEventListener('skaimitra-dashboard-data', syncMessages)
    return () => window.removeEventListener('skaimitra-dashboard-data', syncMessages)
  }, [selectedMessageId])

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const token = localStorage.getItem('skaimitra_token') || undefined
        const response = await fetchCalendarEvents({ role: 'teacher' }, token)
        setCalendarEvents(response.events)
      } catch {
        setCalendarEvents(getFallbackCalendarEventRecords('teacher'))
      }
    }

    void loadCalendar()
    window.addEventListener('skaimitra-calendar-refresh', loadCalendar)
    return () => window.removeEventListener('skaimitra-calendar-refresh', loadCalendar)
  }, [])

  const teacherAnnouncements = useMemo(
    () =>
      announcements
        .filter((item) => item.createdBy === 'teacher')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [announcements],
  )

  const filteredPendingGrading = useMemo(
    () =>
      pendingGrading.filter((item) => {
        const query = homeSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.assignment, query) ||
          includesSearch(item.course, query) ||
          includesSearch(item.dueDate, query) ||
          includesSearch(item.assignmentType, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.section, query)
        )
      }),
    [homeSearchTerm],
  )

  const filteredRecentActivity = useMemo(
    () =>
      recentActivity.filter((item) => {
        const query = homeSearchTerm.trim().toLowerCase()
        if (!query) return true

        return includesSearch(item.title, query) || includesSearch(item.desc, query) || includesSearch(item.time, query)
      }),
    [homeSearchTerm],
  )

  const filteredTeacherAnnouncements = useMemo(
    () =>
      teacherAnnouncements.filter((item) => {
        const query = homeSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.message, query) ||
          includesSearch(item.expiresAt, query) ||
          includesSearch(formatAudienceIds(item.audienceIds), query)
        )
      }),
    [homeSearchTerm, teacherAnnouncements],
  )

  const filteredLessonPlans = useMemo(
    () =>
      lessonPlansState.filter((item) => {
        const query = lessonSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.subject, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.classNames?.join(', '), query) ||
          includesSearch(item.classSections?.join(', '), query) ||
          includesSearch(item.date, query) ||
          includesSearch(item.status, query) ||
          includesSearch(item.objectives, query) ||
          includesSearch(item.materials, query) ||
          includesSearch(item.activities, query) ||
          includesSearch(item.assessment, query) ||
          includesSearch(item.standards, query)
        )
      }),
    [lessonSearchTerm, lessonPlansState],
  )

  const filteredLabActivities = useMemo(
    () =>
      labActivities.filter((item) => {
        const query = labSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.duration, query) ||
          includesSearch(item.status, query)
        )
      }),
    [labSearchTerm],
  )

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((item) => {
        const query = assignmentSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.dueDate, query) ||
          includesSearch(item.submissions, query) ||
          includesSearch(item.total, query)
        )
      }),
    [assignmentSearchTerm],
  )

  const filteredGradeRows = useMemo(
    () =>
      gradeRows.filter((student) => {
        const query = gradeSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(student.id, query) ||
          includesSearch(student.name, query) ||
          includesSearch(student.className, query) ||
          includesSearch(student.math, query) ||
          includesSearch(student.science, query) ||
          includesSearch(student.english, query) ||
          includesSearch(student.overall, query)
        )
      }),
    [gradeSearchTerm],
  )

  const filteredUploads = useMemo(
    () =>
      uploads.filter((item) => {
        const query = uploadSearchTerm.trim().toLowerCase()
        if (!query) return true

        return includesSearch(item.id, query) || includesSearch(item.title, query) || includesSearch(item.type, query) || includesSearch(item.updated, query)
      }),
    [uploadSearchTerm],
  )

  const filteredResources = useMemo(
    () =>
      resources.filter((item) => {
        const query = resourceSearchTerm.trim().toLowerCase()
        if (!query) return true

        return includesSearch(item.id, query) || includesSearch(item.title, query) || includesSearch(item.type, query) || includesSearch(item.audience, query)
      }),
    [resourceSearchTerm],
  )

  const handleAskQuestion = async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isAsking) return

    try {
      setIsAsking(true)
      const response = await askAssistant('teacher', trimmedQuestion)
      setAssistantReply(response.answer)
      setQuestion('')
    } catch (error) {
      setAssistantReply(error instanceof Error ? error.message : 'Unable to get a response right now.')
    } finally {
      setIsAsking(false)
    }
  }

  const openNewLessonPlanModal = () => {
    setEditingLessonPlanId(null)
    setLessonPlanForm({
      id: 0,
      course: '',
      module: '',
      className: '',
      classNames: [],
      classSections: [],
      grade: '',
      title: '',
      subject: '',
      date: '',
      status: 'Draft',
      type: 'Lesson',
      source: 'Custom',
      externalUrl: '',
      aiPrompt: '',
      complianceCode: '',
      objectives: '',
      materials: '',
      activities: '',
      assessment: '',
      standards: '',
      assets: [],
      shareOption: 'None',
      sharedWithUserEmails: [],
      author: teacherName,
      createdBy: 'teacher',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setIsLessonPlanModalOpen(true)
  }

  const openEditLessonPlanModal = (plan: LessonPlan) => {
    setEditingLessonPlanId(plan.id)
    setLessonPlanForm(plan)
    setIsLessonPlanModalOpen(true)
  }

  const closeLessonPlanModal = () => {
    setIsLessonPlanModalOpen(false)
    setEditingLessonPlanId(null)
  }

  const handleAssetUpload = (files: FileList | null) => {
    if (!files?.length) return
    const newAssets: LessonPlanAsset[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }))

    setLessonPlanForm((prev) => ({
      ...prev,
      assets: [...(prev.assets || []), ...newAssets],
    }))
  }

  const saveLessonPlan = (publish = false) => {
    if (!lessonPlanForm.title.trim() || !lessonPlanForm.course.trim() || !lessonPlanForm.module.trim() || !lessonPlanForm.className.trim()) {
      setCalendarNotice({ type: 'error', message: 'Lesson title, course, module, and class are required.' })
      return
    }

    const now = new Date().toISOString()
    const classNames = lessonPlanForm.classNames?.length ? lessonPlanForm.classNames : lessonPlanForm.className ? [lessonPlanForm.className] : []
    const planToSave: LessonPlan = {
      ...lessonPlanForm,
      classNames,
      className: classNames.join(', '),
      classSections: lessonPlanForm.classSections ?? [],
      status: publish ? 'Active' : lessonPlanForm.status,
      author: lessonPlanForm.author || teacherName,
      createdBy: lessonPlanForm.createdBy || 'teacher',
      updatedAt: now,
      publishedAt: publish ? now : lessonPlanForm.publishedAt,
      createdAt: lessonPlanForm.createdAt || now,
    }

    if (editingLessonPlanId) {
      setLessonPlansState((prev) => prev.map((plan) => (plan.id === editingLessonPlanId ? planToSave : plan)))
      setCalendarNotice({ type: 'success', message: publish ? 'Lesson plan published successfully.' : 'Lesson plan saved successfully.' })
    } else {
      const nextId = Math.max(0, ...lessonPlansState.map((plan) => plan.id)) + 1
      setLessonPlansState((prev) => [{ ...planToSave, id: nextId }, ...prev])
      setCalendarNotice({ type: 'success', message: publish ? 'Lesson plan published successfully.' : 'New lesson plan saved as draft.' })
    }

    closeLessonPlanModal()
  }

  const duplicateLessonPlan = (plan: LessonPlan) => {
    const nextId = Math.max(0, ...lessonPlansState.map((pl) => pl.id)) + 1
    const duplicated: LessonPlan = {
      ...plan,
      id: nextId,
      title: `${plan.title} (Copy)`,
      status: 'Draft',
      author: teacherName,
      createdBy: 'teacher',
      assignedApprover: plan.assignedApprover,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
    }
    setLessonPlansState((prev) => [duplicated, ...prev])
    setCalendarNotice({ type: 'success', message: 'Lesson plan duplicated successfully.' })
  }

  const printLessonPlan = (plan: LessonPlan) => {
    const popup = window.open('', '_blank')
    if (!popup) return
    popup.document.write('<html><head><title>Lesson Plan</title></head><body>')
    popup.document.write(`<h1>${plan.title}</h1>`)
    popup.document.write(`<p><strong>Course:</strong> ${plan.course}</p>`)
    popup.document.write(`<p><strong>Module:</strong> ${plan.module}</p>`)
    popup.document.write(`<p><strong>Grade:</strong> ${plan.grade}</p>`)
    popup.document.write(`<p><strong>Status:</strong> ${plan.status}</p>`)
    popup.document.write(`<p><strong>Type:</strong> ${plan.type}</p>`)
    popup.document.write(`<p><strong>Compliance Code:</strong> ${plan.complianceCode}</p>`)
    popup.document.write(`<p><strong>Objectives:</strong> ${plan.objectives}</p>`)
    popup.document.write(`<p><strong>Materials:</strong> ${plan.materials}</p>`)
    popup.document.write(`<p><strong>Activities:</strong> ${plan.activities}</p>`)
    popup.document.write(`<p><strong>Assessment:</strong> ${plan.assessment}</p>`)
    popup.document.write('</body></html>')
    popup.document.close()
    popup.print()
  }

  const downloadLessonPlan = (plan: LessonPlan) => {
    // Browsers don’t have native PDF generation here; using text-based PDF stub for demo.
    const content = `Lesson Plan: ${plan.title}\nCourse: ${plan.course}\nModule: ${plan.module}\nType: ${plan.type}\nStatus: ${plan.status}\n\nObjectives:\n${plan.objectives}\n\nMaterials:\n${plan.materials}\n\nActivities:\n${plan.activities}\n\nAssessment:\n${plan.assessment}\n`;
    const blob = new Blob([content], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.title.replace(/\s+/g, '_').toLowerCase()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const approveLessonPlan = (planId: number) => {
    setLessonPlansState((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, status: 'Active', updatedAt: new Date().toISOString() } : plan)))
    setCalendarNotice({ type: 'success', message: 'Lesson plan approved.' })
  }

  const deleteLessonPlan = (planId: number) => {
    const confirmed = window.confirm('Delete this lesson plan?')
    if (!confirmed) return

    setLessonPlansState((prev) => prev.filter((plan) => plan.id !== planId))
    setCalendarNotice({ type: 'success', message: 'Lesson plan deleted successfully.' })
    if (selectedLessonId === planId) setSelectedLessonId(null)
  }

  const resetEventForm = () => {
    setEditingEventId(null)
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      audienceIds: ['all-users'],
      eventType: 'Reminder',
    })
  }

  const resetAnnouncementForm = () => {
    setEditingAnnouncementId(null)
    setAnnouncement({
      title: '',
      audienceIds: ['all-teachers-students'],
      message: '',
      expiresAt: '',
    })
  }

  const handleOpenEventModal = () => {
    resetEventForm()
    setIsEventOpen(true)
    setCalendarNotice(null)
  }

  const handleOpenAnnouncementModal = () => {
    resetAnnouncementForm()
    setIsAnnouncementOpen(true)
    setCalendarNotice(null)
  }

  const handleEditAnnouncement = (item: DashboardAnnouncement) => {
    setEditingAnnouncementId(item.id)
    setAnnouncement({
      title: item.title,
      audienceIds: item.audienceIds,
      message: item.message,
      expiresAt: item.expiresAt,
    })
    setIsAnnouncementOpen(true)
    setCalendarNotice(null)
  }

  const handleDeleteAnnouncement = (announcementId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this announcement?')
    if (!confirmed) return

    const nextAnnouncements = loadAnnouncements().filter((item) => item.id !== announcementId)
    saveAnnouncements(nextAnnouncements)
    setAnnouncements(nextAnnouncements)
    setCalendarNotice({ type: 'success', message: 'Announcement deleted successfully.' })
  }

  const handleEditEvent = (event: CalendarEventRecord) => {
    setEditingEventId(event.eventId)
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      audienceIds: event.classSections.length
        ? event.classSections.map((item) =>
            item.replace(/^Class\s+(\d{1,2})([A-C])?$/i, (_match, classNum: string, section?: string) =>
              section ? `class-${classNum}-${section.toLowerCase()}` : `class-${classNum}`,
            ),
          )
        : event.audienceRoles.includes('student') && event.audienceRoles.includes('teacher')
          ? ['all-users']
          : event.audienceRoles.includes('teacher')
            ? ['all-teachers']
            : event.audienceRoles.includes('student')
              ? ['all-students']
              : ['all-users'],
      eventType: event.eventType,
    })
    setIsEventOpen(true)
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.description.trim() || !eventForm.date.trim() || eventForm.audienceIds.length === 0) {
      setCalendarNotice({ type: 'error', message: 'Please fill all required event fields.' })
      return
    }

    const token = localStorage.getItem('skaimitra_token')
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
          createdBy: 'teacher',
        })
      }

      setCalendarEvents(getFallbackCalendarEventRecords('teacher'))
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setIsEventOpen(false)
      resetEventForm()
      setCalendarNotice({
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
          date: eventForm.date,
          time: eventForm.time,
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
        })
      } else {
        await createCalendarEvent(token, {
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          date: eventForm.date,
          time: eventForm.time,
          eventType: eventForm.eventType,
          audienceIds: eventForm.audienceIds,
        })
      }

      const response = await fetchCalendarEvents({ role: 'teacher' }, token)
      setCalendarEvents(response.events)
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setIsEventOpen(false)
      resetEventForm()
      setCalendarNotice({
        type: 'success',
        message: editingEventId ? 'Calendar event updated successfully.' : 'Calendar event added successfully.',
      })
    } catch (error) {
      console.error(error)
      applyLocalCalendarSave()
    }
  }

  const handleDeleteEvent = async (event: CalendarEventRecord) => {
    const token = localStorage.getItem('skaimitra_token')
    const applyLocalCalendarDelete = () => {
      deleteFallbackCalendarEvent(event.eventId)
      setCalendarEvents(getFallbackCalendarEventRecords('teacher'))
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setCalendarNotice({ type: 'success', message: 'Calendar event deleted locally.' })
    }

    try {
      if (!token) {
        applyLocalCalendarDelete()
        return
      }

      await deleteCalendarEvent(token, event.eventId)
      const response = await fetchCalendarEvents({ role: 'teacher' }, token)
      setCalendarEvents(response.events)
      window.dispatchEvent(new Event('skaimitra-calendar-refresh'))
      setCalendarNotice({ type: 'success', message: 'Calendar event deleted successfully.' })
    } catch (error) {
      applyLocalCalendarDelete()
    }
  }

  const handleSaveAnnouncement = () => {
    const trimmedTitle = announcement.title.trim()
    const trimmedMessage = announcement.message.trim()
    const trimmedExpiry = announcement.expiresAt.trim()

    if (!trimmedTitle || !trimmedMessage || !trimmedExpiry || announcement.audienceIds.length === 0) {
      setCalendarNotice({ type: 'error', message: 'Please fill all required announcement fields.' })
      return
    }

    const nextAnnouncements: DashboardAnnouncement[] = editingAnnouncementId
      ? loadAnnouncements().map((item) =>
          item.id === editingAnnouncementId
            ? {
                ...item,
                title: trimmedTitle,
                audienceIds: announcement.audienceIds,
                message: trimmedMessage,
                expiresAt: trimmedExpiry,
              }
            : item,
        )
      : [
          {
            id: Date.now(),
            title: trimmedTitle,
            date: new Date().toISOString().slice(0, 10),
            audienceIds: announcement.audienceIds,
            message: trimmedMessage,
            expiresAt: trimmedExpiry,
            createdBy: 'teacher',
          },
          ...loadAnnouncements(),
        ]

    saveAnnouncements(nextAnnouncements)
    setAnnouncements(nextAnnouncements)
    setIsAnnouncementOpen(false)
    resetAnnouncementForm()
    setCalendarNotice({
      type: 'success',
      message: editingAnnouncementId ? 'Announcement updated successfully.' : 'Announcement posted successfully.',
    })
  }

  const renderHome = () => (
    <main className="role-main role-main-teacher">
      <section className="role-primary">
        <div className="role-stat-grid">
          {statCards.map((card) => (
            <article key={card.title} className="role-card role-stat-card">
              <span className={`role-stat-icon ${card.iconClass}`}>
                <card.icon size={16} />
              </span>
              <p className="role-muted">{card.title}</p>
              <p className="role-big">{card.value}</p>
            </article>
          ))}
        </div>

        <section className="role-card role-pending-card">
          <div className="role-section-head role-admin-communications-head">
            <div>
              <h2>Grades</h2>
              <p className="role-muted">Assignments pending grading and key details</p>
            </div>
            <div className="role-user-search-wrap role-user-search-inline">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search grading, activity, or announcements..."
                value={homeSearchTerm}
                onChange={(e) => setHomeSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="role-table-wrap">
            <table className="role-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Course</th>
                  <th>Type</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingGrading.map((item) => (
                  <tr key={`${item.assignment}-${item.dueDate}`}>
                    <td>{item.assignment}</td>
                    <td>{item.dueDate}</td>
                    <td>{item.course}</td>
                    <td>{item.assignmentType}</td>
                    <td>{item.className}</td>
                    <td>{item.section}</td>
                    <td>
                      <button type="button" className="role-inline-action" onClick={() => setActiveTab('Grades')}>
                        Grade Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPendingGrading.length === 0 ? <p className="role-muted">No grading items match your search.</p> : null}
          </div>
        </section>

        <section className="role-card role-activity-card">
          <h2>Course Activity</h2>
          <div className="role-activity-list">
            {filteredRecentActivity.map((item) => (
              <div key={item.title} className="role-activity-item">
                <div>
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </section>

      </section>

      <aside className="role-secondary">
        <RoleCalendar
          title="My Events"
          events={calendarEvents}
          addButtonLabel="+"
          onAddEvent={handleOpenEventModal}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          emptyMessage="No teacher events scheduled for this date."
        />

        <section className="role-card role-admin-communications-card">
          <div className="role-section-head role-admin-communications-head">
            <h3 className="role-section-title">Notifications</h3>
            <button type="button" className="role-primary-btn teacher-announcement-btn" onClick={handleOpenAnnouncementModal}>
              <MessageSquare size={16} />
              New Notification
            </button>
          </div>

          <div className="role-admin-announcement-list">
            {filteredTeacherAnnouncements.length ? (
              filteredTeacherAnnouncements.map((item) => (
                <article key={item.id} className="role-admin-announcement-row">
                  <div className="role-admin-announcement-copy">
                    <h4>{item.title}</h4>
                    <p className="role-muted">{`${item.date} - ${formatAudienceIds(item.audienceIds)} - Expires ${item.expiresAt}`}</p>
                    <p className="role-muted">{item.message}</p>
                  </div>
                  <div className="role-admin-announcement-actions">
                    <button
                      type="button"
                      className="role-icon-square-btn"
                      aria-label={`Edit ${item.title}`}
                      onClick={() => handleEditAnnouncement(item)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="role-icon-square-btn role-icon-square-btn-danger"
                      aria-label={`Delete ${item.title}`}
                      onClick={() => handleDeleteAnnouncement(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="role-muted">No teacher announcements match your search.</p>
            )}
          </div>
        </section>

        <section className="role-card">
          <div className="role-ask-box">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleAskQuestion()
                }
              }}
            />
            <button type="button" aria-label="Ask question" onClick={() => void handleAskQuestion()}>
              <Send size={16} />
            </button>
          </div>
          {assistantReply ? <p className="role-ask-response">{assistantReply}</p> : null}
        </section>
      </aside>
    </main>
  )

  const renderReports = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-card role-detail-card">
          <div className="role-section-head">
            <div>
              <h2>Reports</h2>
              <p className="role-muted">Student performance reports and submissions overview</p>
            </div>
          </div>

          <div className="role-table-wrap">
            <h3 className="role-section-title">Class Submission Summary</h3>
            <table className="role-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>On-time</th>
                  <th>Late</th>
                  <th>Missing</th>
                </tr>
              </thead>
              <tbody>
                {submissionData.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.onTime}%</td>
                    <td>{row.late}%</td>
                    <td>{row.missing}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="role-table-wrap mt-6">
            <h3 className="role-section-title">Performance Trend</h3>
            <table className="role-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {performanceTrend.map((item) => (
                  <tr key={item.week}>
                    <td>{item.week}</td>
                    <td>{item.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )

  const renderLessonPlanning = () => {
    const selectedPlan = lessonPlansState.find((plan) => plan.id === selectedLessonId)

    return (
      <main className="role-main role-main-detail">
        <section className="role-primary">
          <section className="role-section-head role-admin-page-head">
            <div>
              <h2>Lesson Planning</h2>
              <p className="role-muted">Create, review and manage full lesson plans from a single workspace.</p>
            </div>
            <button type="button" className="role-primary-btn" onClick={openNewLessonPlanModal}>
              <Plus size={16} />
              Create Lesson Plan
            </button>
          </section>

          <div className="role-user-toolbar role-user-toolbar-search-only">
            <div className="role-user-search-wrap role-user-search-inline">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search lesson plans by title, subject, class, date, or standards..."
                value={lessonSearchTerm}
                onChange={(e) => setLessonSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <section className="role-table-wrap">
            <div className="teacher-lesson-table-container">
              <table className="role-table teacher-lesson-table">
                <thead>
                  <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Classes</th>
                  <th>Sections</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Standards</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessonPlans.length > 0 ? (
                  filteredLessonPlans.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{(item.classNames && item.classNames.length > 0 ? item.classNames : [item.className]).join(', ')}</td>
                      <td>{item.classSections?.length ? item.classSections.join(', ') : 'N/A'}</td>
                      <td>{item.subject}</td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`role-status-badge ${item.status === 'Draft' ? 'status-draft' : 'status-active'}`}>
                          {item.status.toLowerCase()}
                        </span>
                      </td>
                      <td>{item.standards}</td>
                      <td className="teacher-lesson-table-actions">
                        <button type="button" className="role-secondary-btn" onClick={() => openEditLessonPlanModal(item)}>
                          Edit
                        </button>
                        <button type="button" className="role-secondary-btn" onClick={() => setSelectedLessonId(item.id)}>
                          View
                        </button>
                        <button type="button" className="role-secondary-btn" onClick={() => duplicateLessonPlan(item)}>
                          Duplicate
                        </button>
                        <button type="button" className="role-secondary-btn" onClick={() => printLessonPlan(item)}>
                          Print
                        </button>
                        <button type="button" className="role-secondary-btn" onClick={() => downloadLessonPlan(item)}>
                          Download
                        </button>
                        {item.createdBy === 'external' && item.assignedApprover === teacherName ? (
                          <button type="button" className="role-secondary-btn role-primary-btn" onClick={() => approveLessonPlan(item.id)}>
                            Approve
                          </button>
                        ) : null}
                        <button type="button" className="role-secondary-btn role-icon-square-btn-danger" onClick={() => deleteLessonPlan(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="role-muted">
                      No lesson plans match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </section>

          {selectedPlan ? (
            <section className="role-card">
              <h3 className="role-section-title">Lesson Plan Details</h3>
              <p>
                <strong>Author:</strong> {selectedPlan.author}
              </p>
              <p>
                <strong>Created:</strong> {new Date(selectedPlan.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date(selectedPlan.updatedAt).toLocaleString()}
              </p>
              {selectedPlan.publishedAt ? (
                <p>
                  <strong>Published:</strong> {new Date(selectedPlan.publishedAt).toLocaleString()}
                </p>
              ) : null}
              <p>
                <strong>Classes:</strong> {(selectedPlan.classNames && selectedPlan.classNames.length > 0 ? selectedPlan.classNames : [selectedPlan.className]).join(', ')}
              </p>
              <p>
                <strong>Sections:</strong> {selectedPlan.classSections?.length ? selectedPlan.classSections.join(', ') : 'N/A'}
              </p>
              <p>
                <strong>Objectives:</strong> {selectedPlan.objectives}
              </p>
              <p>
                <strong>Materials:</strong> {selectedPlan.materials}
              </p>
              <p>
                <strong>Activities:</strong> {selectedPlan.activities}
              </p>
              <p>
                <strong>Assessment:</strong> {selectedPlan.assessment}
              </p>
              <p>
                <strong>Type:</strong> {selectedPlan.type}
              </p>
              <p>
                <strong>Compliance Code:</strong> {selectedPlan.complianceCode}
              </p>
              {selectedPlan.assets?.length ? (
                <div>
                  <strong>Assets:</strong>
                  <ul>
                    {selectedPlan.assets.map((asset) => (
                      <li key={asset.id}>{asset.name} ({(asset.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="teacher-lesson-table-actions">
                <button type="button" className="role-secondary-btn" onClick={() => openEditLessonPlanModal(selectedPlan)}>
                  Edit Selected Plan
                </button>
                <button type="button" className="role-secondary-btn" onClick={() => printLessonPlan(selectedPlan)}>
                  Print
                </button>
                <button type="button" className="role-secondary-btn" onClick={() => downloadLessonPlan(selectedPlan)}>
                  Download
                </button>
                {selectedPlan.createdBy === 'external' && selectedPlan.assignedApprover === teacherName ? (
                  <button type="button" className="role-secondary-btn role-primary-btn" onClick={() => approveLessonPlan(selectedPlan.id)}>
                    Approve
                  </button>
                ) : null}
              </div>
            </section>
          ) : null}
        </section>

        {isLessonPlanModalOpen ? (
          <div className="role-modal-backdrop" role="presentation" onClick={closeLessonPlanModal}>
            <section className="role-modal teacher-lesson-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <div className="role-modal-head">
                <h2>{editingLessonPlanId ? 'Edit Lesson Plan' : 'Create Lesson Plan'}</h2>
                <button type="button" onClick={closeLessonPlanModal} aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>
              <div className="role-modal-form">
                <label>
                  Course
                  <input
                    type="text"
                    value={lessonPlanForm.course}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, course: e.target.value }))}
                    placeholder="Course"
                  />
                </label>
                <label>
                  Module
                  <input
                    type="text"
                    value={lessonPlanForm.module}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, module: e.target.value }))}
                    placeholder="Module"
                  />
                </label>
                <label>
                  Grade
                  <input
                    type="text"
                    value={lessonPlanForm.grade}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, grade: e.target.value }))}
                    placeholder="Grade"
                  />
                </label>
                <label>
                  Title
                  <input
                    type="text"
                    value={lessonPlanForm.title}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Lesson title"
                  />
                </label>
                <label>
                  Subject
                  <input
                    type="text"
                    value={lessonPlanForm.subject}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Subject"
                  />
                </label>
                <label>
                  Class
                  <input
                    type="text"
                    value={lessonPlanForm.className}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, className: e.target.value }))}
                    placeholder="Class 6"
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={lessonPlanForm.date}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </label>
                <label>
                  Type
                  <select
                    value={lessonPlanForm.type}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, type: e.target.value as LessonPlan['type'] }))}
                  >
                    <option value="Lesson">Lesson</option>
                    <option value="Project">Project</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Custom">Custom</option>
                  </select>
                </label>
                <label>
                  Compliance Code
                  <input
                    type="text"
                    value={lessonPlanForm.complianceCode}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, complianceCode: e.target.value }))}
                    placeholder="CBSE901A, 417"
                  />
                </label>
                <label>
                  Status
                  <select
                    value={lessonPlanForm.status}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, status: e.target.value as LessonPlanStatus }))}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deleted">Deleted</option>
                  </select>
                </label>
                <label>
                  Upload Assets
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleAssetUpload(e.target.files)}
                  />
                </label>
                {lessonPlanForm.assets?.length ? (
                  <div className="lesson-assets-list">
                    {lessonPlanForm.assets.map((asset) => (
                      <div key={asset.id} className="lesson-asset-item">
                        <strong>{asset.name}</strong> ({(asset.size / 1024).toFixed(1)} KB)
                      </div>
                    ))}
                  </div>
                ) : null}
                <label>
                  Objectives

                  <textarea
                    value={lessonPlanForm.objectives}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, objectives: e.target.value }))}
                    rows={3}
                  />
                </label>
                <label>
                  Materials
                  <textarea
                    value={lessonPlanForm.materials}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, materials: e.target.value }))}
                    rows={2}
                  />
                </label>
                <label>
                  Activities
                  <textarea
                    value={lessonPlanForm.activities}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, activities: e.target.value }))}
                    rows={2}
                  />
                </label>
                <label>
                  Assessment
                  <textarea
                    value={lessonPlanForm.assessment}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, assessment: e.target.value }))}
                    rows={2}
                  />
                </label>
                <label>
                  Standards
                  <input
                    type="text"
                    value={lessonPlanForm.standards}
                    onChange={(e) => setLessonPlanForm((prev) => ({ ...prev, standards: e.target.value }))}
                    placeholder="CBSE Math 6.1"
                  />
                </label>
                <div className="role-modal-actions">
                  <button type="button" className="role-secondary-btn" onClick={() => saveLessonPlan(false)}>
                    <ClipboardList size={16} style={{ marginRight: 6 }} /> Save Draft
                  </button>
                  <button type="button" className="role-primary-btn" onClick={() => saveLessonPlan(true)}>
                    <Upload size={16} style={{ marginRight: 6 }} /> Publish
                  </button>
                  <button type="button" className="role-secondary-btn" onClick={closeLessonPlanModal}>
                    <X size={16} style={{ marginRight: 6 }} /> Cancel
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    )
  }

  const renderLabActivityDesigner = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Lab Activity Designer</h2>
            <p className="role-muted">Design engaging laboratory activities</p>
          </div>
          <button type="button" className="role-primary-btn">
            <Plus size={16} />
            Create Lab Activity
          </button>
        </section>

        <div className="role-user-toolbar role-user-toolbar-search-only">
          <div className="role-user-search-wrap role-user-search-inline">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search lab activities by title, class, status, or ID..."
              value={labSearchTerm}
              onChange={(e) => setLabSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <section className="teacher-lab-grid">
          {filteredLabActivities.length ? filteredLabActivities.map((item) => (
            <article key={item.id} className="role-card teacher-lab-card">
              <div className="teacher-lab-head">
                <h3>{item.title}</h3>
                <span className={`role-status-badge ${item.status === 'Scheduled' ? 'status-draft' : item.status === 'Completed' ? 'status-completed' : 'status-active'}`}>
                  {item.status.toLowerCase()}
                </span>
              </div>

              <p className="role-muted teacher-lab-meta">{`${item.className} • ${item.duration}`}</p>

              <div className="teacher-lab-actions">
                <button type="button" className="role-secondary-btn">
                  Edit
                </button>
                <button type="button" className="role-secondary-btn">
                  Materials
                </button>
                <button type="button" className="teacher-primary-dark-btn">
                  Start Lab
                </button>
              </div>
            </article>
          )) : <p className="role-muted">No lab activities match your search.</p>}
        </section>
      </section>
    </main>
  )

  const renderCards = (
    title: string,
    description: string,
    items: Array<{ id: number; title: string; meta: string; submeta?: string; badge?: string; action?: string }>,
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
            {items.length ? items.map((item) => (
              <article key={item.id} className="role-card role-mini-card">
                <div className="role-mini-card-head">
                  <h3>{item.title}</h3>
                  {item.badge ? <span className="role-status-badge status-active">{item.badge}</span> : null}
                </div>
                <p className="role-muted">{item.meta}</p>
                {item.submeta ? <p className="role-muted">{item.submeta}</p> : null}
                {item.action ? (
                  <button type="button" className="role-inline-action">
                    {item.action}
                  </button>
                ) : null}
              </article>
            )) : <p className="role-muted">No results found.</p>}
          </div>
        </section>
      </section>
    </main>
  )

  const renderAssignments = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Assignments</h2>
            <p className="role-muted">Create and manage student assignments</p>
          </div>
          <button type="button" className="role-primary-btn">
            <Plus size={16} />
            Create Assignment
          </button>
        </section>

        <section className="role-card role-detail-card teacher-assignment-card">
          <div className="role-section-head">
            <div>
              <h3 className="role-section-title">Active Assignments</h3>
            </div>
          </div>
          <div className="role-user-toolbar role-user-toolbar-search-only">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search assignments by title, class, due date, or ID..."
                value={assignmentSearchTerm}
                onChange={(e) => setAssignmentSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="teacher-assignment-list">
            {filteredAssignments.length ? filteredAssignments.map((item) => (
              <article key={item.id} className="teacher-assignment-row">
                <div className="teacher-assignment-copy">
                  <h4>{item.title}</h4>
                  <p className="role-muted">{`${item.className}   Due: ${item.dueDate}`}</p>
                </div>
                <div className="teacher-assignment-side">
                  <div className="teacher-assignment-stats">
                    <strong>{`${item.submissions}/${item.total}`}</strong>
                    <span>Submissions</span>
                  </div>
                  <button type="button" className="teacher-primary-dark-btn teacher-view-btn">
                    View
                  </button>
                </div>
              </article>
            )) : <p className="role-muted">No assignments match your search.</p>}
          </div>
        </section>
      </section>
    </main>
  )

  const renderGrades = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-card role-detail-card">
          <div className="role-section-head">
            <div>
              <h2>Assessments</h2>
              <p className="role-muted">View and manage student performance</p>
            </div>
          </div>
          <div className="role-user-toolbar role-user-toolbar-search-only">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search grades by student, class, marks, or ID..."
                value={gradeSearchTerm}
                onChange={(e) => setGradeSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="role-table-wrap">
            <table className="role-table teacher-grade-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Math</th>
                  <th>Science</th>
                  <th>English</th>
                  <th>Overall</th>
                </tr>
              </thead>
              <tbody>
                {filteredGradeRows.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.className}</td>
                    <td>{student.math}%</td>
                    <td>{student.science}%</td>
                    <td>{student.english}%</td>
                    <td>
                      <span className="role-admin-score-pill">{student.overall}%</span>
                    </td>
                    <td>
                      <button type="button" className="role-secondary-btn teacher-detail-btn">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGradeRows.length === 0 ? <p className="role-muted">No students match your search.</p> : null}
          </div>
        </section>
      </section>
    </main>
  )

  const renderContentUpload = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Content Upload</h2>
            <p className="role-muted">Upload learning materials and resources</p>
          </div>
        </section>

        <section className="role-card teacher-upload-dropzone">
          <div className="teacher-upload-icon-wrap">
            <Upload size={36} />
          </div>
          <h3>Upload Course Content</h3>
          <p className="role-muted">Drag and drop files or click to browse</p>
          <button type="button" className="role-primary-btn teacher-select-files-btn">
            <Upload size={16} />
            Select Files
          </button>
          <p className="role-muted teacher-upload-note">Supported formats: PDF, DOCX, PPTX, MP4, MP3</p>
        </section>

        <section className="role-card role-detail-card teacher-recent-uploads-card">
          <div className="role-section-head">
            <div>
              <h3 className="role-section-title">Recent Uploads</h3>
            </div>
          </div>
          <div className="role-user-toolbar role-user-toolbar-search-only">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search uploads by file name, type, date, or ID..."
                value={uploadSearchTerm}
                onChange={(e) => setUploadSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="teacher-upload-list">
            {filteredUploads.length ? filteredUploads.map((item) => (
              <article key={item.id} className="teacher-upload-row">
                <div className="teacher-upload-row-main">
                  <div className="teacher-upload-file-icon">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p className="role-muted">{item.updated}</p>
                  </div>
                </div>
                <button type="button" className="role-secondary-btn teacher-detail-btn">
                  View
                </button>
              </article>
            )) : <p className="role-muted">No uploads match your search.</p>}
          </div>
        </section>
      </section>
    </main>
  )

  let content = renderHome()

  if (activeTab === 'Lesson Planning') {
    content = renderLessonPlanning()
  } else if (activeTab === 'Lab Activity Designer') {
    content = renderLabActivityDesigner()
  } else if (activeTab === 'Assignments') {
    content = renderAssignments()
  } else if (activeTab === 'Grades') {
    content = renderGrades()
  } else if (activeTab === 'Content Library') {
    content = renderContentUpload()
  } else if (activeTab === 'Reports') {
    content = renderReports()
  } else if (activeTab === 'Resources') {
    content = renderCards(
      'Resources',
      'Browse reusable templates, guides, and teaching packs.',
      filteredResources.map((item) => ({
        id: item.id,
        title: item.title,
        meta: item.type,
        submeta: item.audience,
        action: 'Open Resource',
      })),
      resourceSearchTerm,
      setResourceSearchTerm,
      'Search resources by title, type, audience, or ID...',
    )
  }

  return (
    <div className="role-page teacher-dashboard-page">
      <section className="role-topbar">
        <header className="role-header">
          <div className="role-brand-block">
            <span className="role-kicker-icon logo-image-only" aria-hidden>
              <img src="/SkaiMitra_LogoV2.0.jpg" alt="SkaiMitra logo" className="admin-logo-image" />
            </span>
            <div>
              <h1 className="role-brand-title">SkaiMitra</h1>
              <p className="role-brand-subtitle">{`Welcome back, ${teacherName}`}</p>
            </div>
          </div>
          <div className="role-header-actions">
            <button type="button" className="role-primary-btn teacher-announcement-btn" onClick={handleOpenAnnouncementModal}>
              <MessageSquare size={16} />
              New Announcement
            </button>
            <button
              type="button"
              className="role-icon-btn role-icon-btn-bell"
              aria-label="Notifications"
              onClick={() => setIsMessagesOpen(true)}
            >
              <Bell size={20} />
              {messages.length > 0 ? <span className="role-dot" /> : null}
            </button>
            <button type="button" className="role-icon-btn" aria-label="Settings">
              <Settings size={20} />
            </button>
            <button type="button" className="role-logout-btn" onClick={() => navigate('/')}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <nav className="role-tabs teacher-role-tabs">
          {navTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={activeTab === tab.label ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.label)}
            >
              <tab.icon size={16} />
              <span className="role-tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {calendarNotice ? (
        <div className={`role-floating-notice ${calendarNotice.type === 'success' ? 'is-success' : 'is-error'}`}>
          {calendarNotice.message}
        </div>
      ) : null}

      {content}

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
                Title
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                <span>Audience <span className="required-asterisk">*</span></span>
                <AudienceMultiSelect
                  value={announcement.audienceIds}
                  onChange={(audienceIds) => setAnnouncement((prev) => ({ ...prev, audienceIds }))}
                  allowedIds={teacherAnnouncementAllowedIds}
                  placeholder="Search classes, sections, or groups"
                />
                <small className="role-field-hint">Select classes, sections, or teacher-wide groups.</small>
              </label>

              <label>
                Expiry Date
                <input
                  type="date"
                  value={announcement.expiresAt}
                  onChange={(e) => setAnnouncement((prev) => ({ ...prev, expiresAt: e.target.value }))}
                />
              </label>

              <label>
                Message
                <textarea
                  className="role-announcement-textarea"
                  placeholder="Write the announcement message"
                  value={announcement.message}
                  onChange={(e) => setAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                  rows={5}
                />
              </label>

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
              <h2>{editingEventId ? 'Edit Calendar Event' : 'Add Calendar Event'}</h2>
              <button type="button" onClick={() => setIsEventOpen(false)} aria-label="Close event modal">
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
                <span>Event Description <span className="required-asterisk">*</span></span>
                <textarea
                  className="role-announcement-textarea"
                  placeholder="Enter event description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </label>

              <div className="role-modal-inline-grid">
                <label>
                  <span>Event Date <span className="required-asterisk">*</span></span>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </label>

                <label>
                  Time
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </label>
              </div>

              <label>
                <span>Event Type <span className="required-asterisk">*</span></span>
                <select value={eventForm.eventType} onChange={(e) => setEventForm((prev) => ({ ...prev, eventType: e.target.value }))}>
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
                  allowedIds={teacherAnnouncementAllowedIds}
                  placeholder="Select event audience"
                />
              </label>

              <div className="role-modal-actions">
                <button type="button" className="primary" onClick={() => void handleSaveEvent()}>
                  {editingEventId ? 'Update Event' : 'Save Event'}
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
        messages={messages}
        selectedMessageId={selectedMessageId}
        onClose={() => setIsMessagesOpen(false)}
        onSelect={setSelectedMessageId}
      />
    </div>
  )
}

export default TeacherDashboard
