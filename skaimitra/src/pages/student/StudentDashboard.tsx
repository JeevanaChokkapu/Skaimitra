import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock3,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  Play,
  Search,
  Send,
  Settings,
} from 'lucide-react'
import { askAssistant, fetchCalendarEvents, type CalendarEventRecord } from '../../lib/api'
import RoleCalendar from '../../components/dashboard/RoleCalendar'
import MessageCenter from '../../components/dashboard/MessageCenter'
import { getInboxMessages, type InboxMessage } from '../../lib/dashboardData'
import '../role-dashboard.css'

type StudentTab = 'Home' | 'My Subjects' | 'Assignments' | 'Resources'

type StudentCourse = {
  id: number
  name: string
  teacher: string
  progress: number
  grade: string
  completedLessons: number
  totalLessons: number
}

type StudentAssignment = {
  id: number
  title: string
  subject: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  points: number
  score?: number
}

const studentTabs: Array<{ label: StudentTab; icon: typeof Home }> = [
  { label: 'Home', icon: Home },
  { label: 'My Subjects', icon: BookOpen },
  { label: 'Assignments', icon: ClipboardList },
  { label: 'Resources', icon: FolderOpen },
]

const statCards = [
  { title: 'Enrolled Courses', value: '5', icon: BookOpen, iconClass: 'role-stat-icon-1' },
  { title: 'Completed Assignments', value: '18/25', icon: CheckCircle, iconClass: 'role-stat-icon-3' },
  { title: 'Average Score', value: '85%', icon: Award, iconClass: 'role-stat-icon-2' },
]

const subjectPerformance = [
  { subject: 'Math', score: 86 },
  { subject: 'Science', score: 94 },
  { subject: 'English', score: 79 },
  { subject: 'Social', score: 90 },
  { subject: 'Hindi', score: 92 },
]

const mySubjects: StudentCourse[] = [
  { id: 1, name: 'Mathematics', teacher: 'Dr. Rajesh Kumar', progress: 75, grade: 'A', completedLessons: 18, totalLessons: 24 },
  { id: 2, name: 'Science', teacher: 'Ms. Priya Patel', progress: 82, grade: 'A', completedLessons: 16, totalLessons: 20 },
  { id: 3, name: 'English', teacher: 'Mr. Sharma', progress: 68, grade: 'B+', completedLessons: 15, totalLessons: 22 },
  { id: 4, name: 'History', teacher: 'Ms. Gupta', progress: 90, grade: 'A+', completedLessons: 16, totalLessons: 18 },
  { id: 5, name: 'Hindi', teacher: 'Mr. Verma', progress: 85, grade: 'A', completedLessons: 17, totalLessons: 20 },
]

const assignments: StudentAssignment[] = [
  { id: 1, title: 'Algebra Quiz - Chapter 4', subject: 'Mathematics', dueDate: '2026-02-18', status: 'pending', points: 50 },
  { id: 2, title: 'Science Lab Report', subject: 'Science', dueDate: '2026-02-20', status: 'pending', points: 100 },
  { id: 3, title: 'Essay on Indian History', subject: 'History', dueDate: '2026-02-15', status: 'submitted', points: 75 },
  { id: 4, title: 'Grammar Exercise', subject: 'English', dueDate: '2026-02-22', status: 'pending', points: 30 },
  { id: 5, title: 'Geometry Assignment', subject: 'Mathematics', dueDate: '2026-02-12', status: 'graded', points: 50, score: 48 },
]

const recentActivity = [
  { title: 'New submission', desc: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
  { title: 'Assignment graded', desc: 'Completed grading for 5 students', time: '4 hours ago' },
  { title: 'Started quiz', desc: 'Science Lab worksheet opened', time: '1 day ago' },
]

const resources = [
  { id: 1, title: 'Mathematics Revision Pack', type: 'PDF bundle', subject: 'Mathematics' },
  { id: 2, title: 'Science Lab Simulations', type: 'Interactive', subject: 'Science' },
  { id: 3, title: 'English Writing Prompts', type: 'Worksheet set', subject: 'English' },
]

const includesSearch = (value: string | number | null | undefined, query: string) =>
  String(value ?? '')
    .toLowerCase()
    .includes(query.trim().toLowerCase())

function StudentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<StudentTab>('Home')
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('')
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('')
  const [resourceSearchTerm, setResourceSearchTerm] = useState('')
  const [studentName, setStudentName] = useState('Aarav Mehta')
  const [studentClassSection, setStudentClassSection] = useState('Class 6A')
  const [question, setQuestion] = useState('')
  const [assistantReply, setAssistantReply] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([])

  useEffect(() => {
    const savedName = localStorage.getItem('skaimitra_name')?.trim()
    if (savedName) setStudentName(savedName)

    const savedClassGrade = localStorage.getItem('skaimitra_class_grade')?.trim()
    if (savedClassGrade) setStudentClassSection(savedClassGrade)
  }, [])

  useEffect(() => {
    const syncMessages = () => {
      const nextMessages = getInboxMessages('student', studentClassSection)
      setMessages(nextMessages)
      if (nextMessages.length && !selectedMessageId) {
        setSelectedMessageId(nextMessages[0].id)
      }
    }

    syncMessages()
    window.addEventListener('skaimitra-dashboard-data', syncMessages)
    return () => window.removeEventListener('skaimitra-dashboard-data', syncMessages)
  }, [selectedMessageId, studentClassSection])

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const token = localStorage.getItem('skaimitra_token') || undefined
        const response = await fetchCalendarEvents(
          {
            role: 'student',
            classSection: studentClassSection,
          },
          token,
        )
        setCalendarEvents(response.events)
      } catch {
        setCalendarEvents([])
      }
    }

    void loadCalendar()
    window.addEventListener('skaimitra-calendar-refresh', loadCalendar)
    return () => window.removeEventListener('skaimitra-calendar-refresh', loadCalendar)
  }, [studentClassSection])

  const filteredSubjects = useMemo(
    () =>
      mySubjects.filter((subject) => {
        const query = subjectSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(subject.id, query) ||
          includesSearch(subject.name, query) ||
          includesSearch(subject.teacher, query) ||
          includesSearch(subject.grade, query) ||
          includesSearch(subject.progress, query)
        )
      }),
    [subjectSearchTerm],
  )

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const query = assignmentSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(assignment.id, query) ||
          includesSearch(assignment.title, query) ||
          includesSearch(assignment.subject, query) ||
          includesSearch(assignment.dueDate, query) ||
          includesSearch(assignment.status, query) ||
          includesSearch(assignment.points, query) ||
          includesSearch(assignment.score, query)
        )
      }),
    [assignmentSearchTerm],
  )

  const filteredResources = useMemo(
    () =>
      resources.filter((resource) => {
        const query = resourceSearchTerm.trim().toLowerCase()
        if (!query) return true

        return includesSearch(resource.id, query) || includesSearch(resource.title, query) || includesSearch(resource.type, query) || includesSearch(resource.subject, query)
      }),
    [resourceSearchTerm],
  )

  const pendingAssignments = filteredAssignments.filter((assignment) => assignment.status === 'pending')

  const handleAskQuestion = async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isAsking) return

    try {
      setIsAsking(true)
      const response = await askAssistant('student', trimmedQuestion)
      setAssistantReply(response.answer)
      setQuestion('')
    } catch (error) {
      setAssistantReply(error instanceof Error ? error.message : 'Unable to get a response right now.')
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="role-page student-dashboard-page">
      <section className="role-topbar">
        <header className="role-header">
          <div className="role-brand-block">
            <span className="role-kicker-icon logo-image-only" aria-hidden>
              <img src="/skaimitra-logo.png" alt="SkaiMitra logo" className="admin-logo-image" />
            </span>
            <div>
              <h1 className="role-brand-title">SkaiMitra</h1>
              <p className="role-brand-subtitle">{`Welcome back, ${studentName}`}</p>
            </div>
          </div>
          <div className="role-header-actions">
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

        <nav className="role-tabs student-role-tabs">
          {studentTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={activeTab === tab.label ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.label)}
            >
              <tab.icon size={16} className="role-tab-icon" />
              <span className="role-tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {activeTab === 'Home' && (
        <main className="role-main role-main-student">
          <section className="role-primary">
            <div className="role-stat-grid student-stat-grid">
              {statCards.map((card) => (
                <article key={card.title} className="role-card role-stat-card student-stat-card">
                  <span className={`role-stat-icon ${card.iconClass}`}>
                    <card.icon size={20} />
                  </span>
                  <p className="role-big student-stat-value">{card.value}</p>
                  <p className="role-muted student-stat-label">{card.title}</p>
                </article>
              ))}
            </div>

            <section className="role-card student-alert-card">
              <div className="student-alert-copy">
                <span className="student-alert-chip">Preview</span>
                <div>
                  <h2>Assignments Due Soon!</h2>
                  <p className="role-muted">You have 2 assignments due within the next 3 days.</p>
                </div>
              </div>
              <button type="button" className="student-light-button" onClick={() => setActiveTab('Assignments')}>
                View All
              </button>
            </section>

            <section className="role-card student-activity-card">
              <h2>Recent Activity</h2>
              <div className="role-activity-list">
                {recentActivity.map((item) => (
                  <div key={`${item.title}-${item.time}`} className="role-activity-item student-activity-item">
                    <div className="student-activity-dot" />
                    <div className="student-activity-copy">
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
            <section className="role-card student-chart-card">
              <h2>Subject Performance</h2>
              <p className="role-muted">Compare your scores across subjects</p>
              <div className="student-score-chart">
                {subjectPerformance.map((item) => (
                  <div key={item.subject} className="student-score-bar-group">
                    <div className="student-score-track">
                      <div className="student-score-fill" style={{ height: `${item.score}%` }} />
                    </div>
                    <span>{item.subject}</span>
                  </div>
                ))}
              </div>
            </section>

            <RoleCalendar title="Student Calendar" events={calendarEvents} emptyMessage="No student events scheduled for this date." />

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
      )}

      {activeTab === 'My Subjects' && (
        <main className="role-main role-main-student student-main-full">
          <section className="role-primary">
            <section className="student-page-head">
              <h2>My Subjects</h2>
              <p className="role-muted">View all your enrolled subjects and track progress</p>
            </section>

            <div className="role-user-toolbar role-user-toolbar-search-only">
              <div className="role-user-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search subjects by name, teacher, grade, or ID..."
                  value={subjectSearchTerm}
                  onChange={(e) => setSubjectSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <section className="student-subject-screen-grid">
              {filteredSubjects.length ? filteredSubjects.map((subject) => (
                <article key={subject.id} className="role-card student-subject-screen-card">
                  <div className="student-subject-screen-head">
                    <div>
                      <h3>{subject.name}</h3>
                      <p className="role-muted">{`Teacher: ${subject.teacher}`}</p>
                    </div>
                    <span className="student-grade-pill">{subject.grade}</span>
                  </div>

                  <div className="student-progress-line-head">
                    <span>Progress</span>
                    <strong>{subject.progress}%</strong>
                  </div>
                  <div className="student-progress-track student-progress-track-wide">
                    <div className="student-progress-fill" style={{ width: `${subject.progress}%` }} />
                  </div>

                  <div className="student-subject-screen-foot">
                    <span>{`${subject.completedLessons}/${subject.totalLessons} Lessons Completed`}</span>
                    <button type="button" className="student-continue-btn">
                      <Play size={16} />
                      Continue
                    </button>
                  </div>
                </article>
              )) : <p className="role-muted">No subjects match your search.</p>}
            </section>
          </section>
        </main>
      )}

      {activeTab === 'Assignments' && (
        <main className="role-main role-main-student student-main-full">
          <section className="role-primary">
            <section className="student-page-head">
              <h2>Assignments</h2>
              <p className="role-muted">View and submit your assignments</p>
            </section>

            <div className="role-user-toolbar role-user-toolbar-search-only">
              <div className="role-user-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search assignments by title, subject, status, or ID..."
                  value={assignmentSearchTerm}
                  onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="student-assignment-overview-grid">
              <article className="role-card student-assignment-overview-card">
                <span className="student-assignment-icon pending">
                  <Clock3 size={24} />
                </span>
                <div>
                  <p className="student-assignment-overview-value">{pendingAssignments.length}</p>
                  <p className="role-muted">Pending</p>
                </div>
              </article>
              <article className="role-card student-assignment-overview-card">
                <span className="student-assignment-icon submitted">
                  <FileText size={24} />
                </span>
                <div>
                  <p className="student-assignment-overview-value">{assignments.filter((item) => item.status === 'submitted').length}</p>
                  <p className="role-muted">Submitted</p>
                </div>
              </article>
              <article className="role-card student-assignment-overview-card">
                <span className="student-assignment-icon graded">
                  <CheckCircle size={24} />
                </span>
                <div>
                  <p className="student-assignment-overview-value">{assignments.filter((item) => item.status === 'graded').length}</p>
                  <p className="role-muted">Graded</p>
                </div>
              </article>
            </div>

            <section className="student-assignment-screen-list">
              <h3 className="role-section-title">All Assignments</h3>
              <div className="student-assignment-screen-items">
                {filteredAssignments.length ? filteredAssignments.map((assignment) => (
                  <article key={assignment.id} className="role-card student-assignment-screen-row">
                    <div>
                      <h4>{assignment.title}</h4>
                      <p className="role-muted">
                        {`${assignment.subject} • Due: ${new Date(assignment.dueDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })} • ${assignment.points} points`}
                      </p>
                    </div>
                    <span className={`student-status-pill ${assignment.status}`}>{assignment.status}</span>
                  </article>
                )) : <p className="role-muted">No assignments match your search.</p>}
              </div>
            </section>
          </section>
        </main>
      )}

      {activeTab === 'Resources' && (
        <main className="role-main role-main-student">
          <section className="role-primary">
            <section className="role-card">
              <h2>Resources</h2>
              <p className="role-muted">Open learning packs, worksheets, and subject support material.</p>
              <div className="role-user-toolbar role-user-toolbar-search-only">
                <div className="role-user-search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search resources by title, subject, type, or ID..."
                    value={resourceSearchTerm}
                    onChange={(e) => setResourceSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="student-subject-grid">
                {filteredResources.length ? filteredResources.map((resource) => (
                  <article key={resource.id} className="role-card student-subject-card">
                    <div className="student-subject-head">
                      <div>
                        <h3 className="student-section-heading">{resource.title}</h3>
                        <p className="role-muted">{resource.subject}</p>
                      </div>
                      <span className="student-grade-pill">{resource.type}</span>
                    </div>
                    <p className="role-muted">Ready to open in your study space.</p>
                    <div className="student-subject-foot">
                      <span>Available for this class</span>
                      <button type="button" className="student-light-button">
                        Open Resource
                      </button>
                    </div>
                  </article>
                )) : <p className="role-muted">No resources match your search.</p>}
              </div>
            </section>
          </section>
        </main>
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

export default StudentDashboard
