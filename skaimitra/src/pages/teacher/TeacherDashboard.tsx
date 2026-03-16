import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
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
  | 'Content Upload'
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
  { label: 'Content Upload', icon: Upload },
  { label: 'Resources', icon: FolderOpen },
]

const statCards = [
  { title: 'My Courses', value: '4', icon: BookOpen, iconClass: 'role-stat-icon-1' },
  { title: 'Total Students', value: '145', icon: Users, iconClass: 'role-stat-icon-2' },
  { title: 'Pending Submissions', value: '23', icon: ClipboardList, iconClass: 'role-stat-icon-3' },
  { title: 'Avg. Performance', value: '82%', icon: GraduationCap, iconClass: 'role-stat-icon-4' },
]

const pendingGrading = [
  { assignment: 'Algebra Quiz - Chapter 4', course: 'Mathematics - Class 6', student: 'Aarav Mehta', submitted: '2 hours ago' },
  { assignment: 'Geometry Assignment', course: 'Mathematics - Class 7', student: 'Diya Sharma', submitted: '5 hours ago' },
]

const recentActivity = [
  { title: 'New submission', desc: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
  { title: 'Assignment graded', desc: 'Completed grading for 5 students', time: '4 hours ago' },
]

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

const lessonPlans = [
  { id: 1, title: 'Introduction to Algebra', subject: 'Mathematics', className: 'Class 6', date: 'Feb 18, 2026', status: 'Published' },
  { id: 2, title: 'Photosynthesis Process', subject: 'Science', className: 'Class 7', date: 'Feb 19, 2026', status: 'Draft' },
  { id: 3, title: 'English Grammar Basics', subject: 'English', className: 'Class 6', date: 'Feb 20, 2026', status: 'Published' },
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

function TeacherDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TeacherTab>('Home')
  const [teacherName, setTeacherName] = useState('Teacher')
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

  const lineWidth = 420
  const lineHeight = 140
  const pointSpace = lineWidth / (performanceTrend.length - 1)
  const linePoints = useMemo(
    () =>
      performanceTrend
        .map((item, index) => {
          const x = index * pointSpace
          const y = lineHeight - (item.score / 100) * lineHeight
          return `${x},${y}`
        })
        .join(' '),
    [pointSpace],
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
          <h2>Pending Grading</h2>
          <p className="role-muted">Recent submissions awaiting your review</p>
          <div className="role-table-wrap">
            <table className="role-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Student</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingGrading.map((item) => (
                  <tr key={item.assignment}>
                    <td>{item.assignment}</td>
                    <td>{item.course}</td>
                    <td>{item.student}</td>
                    <td>{item.submitted}</td>
                    <td>
                      <button type="button" className="role-inline-action" onClick={() => setActiveTab('Grades')}>
                        Grade Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="role-card role-activity-card">
          <h2>Recent Activity</h2>
          <div className="role-activity-list">
            {recentActivity.map((item) => (
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

        <section className="role-card role-admin-communications-card">
          <div className="role-section-head role-admin-communications-head">
            <h3 className="role-section-title">My Announcements</h3>
            <button type="button" className="role-primary-btn teacher-announcement-btn" onClick={handleOpenAnnouncementModal}>
              <MessageSquare size={16} />
              New Announcement
            </button>
          </div>

          <div className="role-admin-announcement-list">
            {teacherAnnouncements.length ? (
              teacherAnnouncements.map((item) => (
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
              <p className="role-muted">No teacher announcements posted yet.</p>
            )}
          </div>
        </section>
      </section>

      <aside className="role-secondary">
        <section className="role-card">
          <h2>Assignment Submissions</h2>
          <p className="role-muted">Submission status by class</p>
          <div className="role-teacher-bar-chart">
            {submissionData.map((row) => (
              <div key={row.name} className="role-teacher-bar-group">
                <div className="role-teacher-bars">
                  <span className="teacher-bar-on-time" style={{ height: `${row.onTime}%` }} />
                  <span className="teacher-bar-late" style={{ height: `${row.late}%` }} />
                  <span className="teacher-bar-missing" style={{ height: `${row.missing}%` }} />
                </div>
                <strong>{row.name}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="role-card">
          <h2>Student Performance Trend</h2>
          <p className="role-muted">Average scores over 6 weeks</p>
          <div className="role-line-chart-wrap">
            <svg viewBox={`0 0 ${lineWidth} ${lineHeight}`} className="role-line-chart" preserveAspectRatio="none">
              <polyline points={`0,${lineHeight} ${lineWidth},${lineHeight}`} className="line-base" />
              <polyline points={linePoints} className="line-trend" />
              {performanceTrend.map((item, index) => {
                const cx = index * pointSpace
                const cy = lineHeight - (item.score / 100) * lineHeight
                return <circle key={item.week} cx={cx} cy={cy} r="4" className="line-dot" />
              })}
            </svg>
            <div className="role-line-labels">
              {performanceTrend.map((item) => (
                <span key={item.week}>{item.week}</span>
              ))}
            </div>
          </div>
        </section>

        <RoleCalendar
          title="Teacher Calendar"
          events={calendarEvents}
          addButtonLabel="Add Event"
          onAddEvent={handleOpenEventModal}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          emptyMessage="No teacher events scheduled for this date."
        />

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

  const renderLessonPlanning = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Lesson Planning</h2>
            <p className="role-muted">Create and manage AI-powered lesson plans</p>
          </div>
          <button type="button" className="role-primary-btn">
            <Plus size={16} />
            Create Lesson Plan
          </button>
        </section>

        <section className="teacher-lesson-grid">
          {lessonPlans.map((item) => (
            <article key={item.id} className="role-card teacher-lesson-card">
              <div className="teacher-lesson-head">
                <h3>{item.title}</h3>
                <span className={`role-status-badge ${item.status === 'Draft' ? 'status-draft' : 'status-active'}`}>
                  {item.status.toLowerCase()}
                </span>
              </div>

              <div className="teacher-lesson-meta">
                <p>
                  <strong>Subject:</strong> {item.subject}
                </p>
                <p>
                  <strong>Class:</strong> {item.className}
                </p>
                <p>
                  <strong>Date:</strong> {item.date}
                </p>
              </div>

              <div className="teacher-lesson-actions">
                <button type="button" className="role-secondary-btn">
                  Edit
                </button>
                <button type="button" className="role-secondary-btn">
                  View
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  )

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

        <section className="teacher-lab-grid">
          {labActivities.map((item) => (
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
          ))}
        </section>
      </section>
    </main>
  )

  const renderCards = (
    title: string,
    description: string,
    items: Array<{ id: number; title: string; meta: string; submeta?: string; badge?: string; action?: string }>,
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
          <div className="role-detail-grid">
            {items.map((item) => (
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
            ))}
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
          <div className="teacher-assignment-list">
            {assignments.map((item) => (
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
            ))}
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
              <h2>Student Grades</h2>
              <p className="role-muted">View and manage student performance</p>
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
                {gradeRows.map((student) => (
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
          <div className="teacher-upload-list">
            {uploads.map((item) => (
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
            ))}
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
  } else if (activeTab === 'Content Upload') {
    content = renderContentUpload()
  } else if (activeTab === 'Resources') {
    content = renderCards(
      'Resources',
      'Browse reusable templates, guides, and teaching packs.',
      resources.map((item) => ({
        id: item.id,
        title: item.title,
        meta: item.type,
        submeta: item.audience,
        action: 'Open Resource',
      })),
    )
  }

  return (
    <div className="role-page teacher-dashboard-page">
      <section className="role-topbar">
        <header className="role-header">
          <div className="role-brand-block">
            <span className="role-kicker-icon logo-image-only" aria-hidden>
              <img src="/skaimitra-logo.png" alt="SkaiMitra logo" className="admin-logo-image" />
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
