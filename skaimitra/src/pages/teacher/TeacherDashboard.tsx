import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BarChart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Pencil,
  PenLine,
  Plus,
  Printer,
  Download,
  CheckCircle,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvents,
  fetchLessonPlans,
  updateCalendarEvent,
  type CalendarEventRecord,
} from '../../lib/api'
import AudienceMultiSelect from '../../components/dashboard/AudienceMultiSelect'
import ActionIconButton from '../../components/dashboard/ActionIconButton'
import AIChat from '../../components/dashboard/AIChat'
import MessageCenter from '../../components/dashboard/MessageCenter'
import ProfileSettingsPanel, { type ProfileSettingsData } from '../../components/dashboard/ProfileSettingsPanel'
import RoleCalendar from '../../components/dashboard/RoleCalendar'
import CommunicationsHub from '../../components/dashboard/CommunicationsHub'
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
  | 'Assignments'
  | 'Grades'
  | 'Communications'
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

type LessonPlanSource = 'Manual' | 'External' | 'AI'

type LessonPlanStatus = 'Draft' | 'Active' | 'Inactive' | 'Deleted'

type LessonPlanAsset = {
  id: string
  name: string
  type: string
  url: string
  size?: number
}

type LessonPlanCreator = 'internal' | 'external' | 'ai'

type LessonPlan = {
  id: number
  title: string
  course: string
  module: string
  className: string
  classNames?: string[]
  classSections?: string[]
  grade: string
  subject: string
  type: 'Lesson' | 'Project' | 'Discussion' | 'Manual'
  status: LessonPlanStatus
  description: string
  complianceCode: string
  standards: string
  objectives: string
  materials: string
  activities: string
  assessment: string
  source: LessonPlanSource
  createdBy: LessonPlanCreator
  assignedApprover?: string
  date: string
  author?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  externalUrl?: string
  aiPrompt?: string
  shareScope?: 'Private' | 'All Users' | 'Selected Users'
  sharedWith?: string[]
  assets?: LessonPlanAsset[]
}

type PlannerWorkspaceTab = 'lesson' | 'lab'

type PlannerView = 'summary' | 'builder'

type ShareVisibility = 'private' | 'all users' | 'users'

type LabActivity = {
  id: number
  title: string
  course: string
  module: string
  grade: string
  type: 'Experiment' | 'Demonstration' | 'Observation'
  status: LessonPlanStatus
  description: string
  objective: string
  materials: string
  procedureSteps: string[]
  observations: string
  result: string
  source: LessonPlanSource
  complianceCode: string
  scheduleDate: string
  date: string
  author?: string
  createdBy: LessonPlanCreator
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  externalUrl?: string
  aiPrompt?: string
  shareScope?: 'Private' | 'All Users' | 'Selected Users'
  sharedWith?: string[]
  assets?: LessonPlanAsset[]
}

type LessonPlanFormState = {
  course: string
  module: string
  grade: string
  type: LessonPlan['type']
  status: LessonPlanStatus
  title: string
  description: string
  scheduleDate: string
  complianceCode: string
  source: LessonPlanSource
  className: string
  objectives: string
  materials: string
  activities: string
  assessment: string
  externalUrl: string
  aiTopic: string
  aiObjective: string
  aiPrompt: string
  aiDraft: string
  assets: LessonPlanAsset[]
  shareEnabled: boolean
  shareScope: ShareVisibility
  shareUsers: string
}

type LabActivityFormState = {
  course: string
  module: string
  grade: string
  type: LabActivity['type']
  status: LessonPlanStatus
  title: string
  description: string
  scheduleDate: string
  complianceCode: string
  source: LessonPlanSource
  objective: string
  materials: string
  procedureSteps: string[]
  observations: string
  result: string
  externalUrl: string
  aiPrompt: string
  aiDraft: string
  assets: LessonPlanAsset[]
  shareEnabled: boolean
  shareScope: ShareVisibility
  shareUsers: string
}

type AssignmentType = 'Quiz' | 'Paper' | 'Homework' | 'Project'
type AssignmentMode = 'Online' | 'Offline'

type AssignmentRecord = {
  id: number
  assignmentName: string
  className: string
  section: string
  assignmentMode: AssignmentMode
  assignmentType: AssignmentType
  assignmentDue: string
  subject: string
  date: string
  status: LessonPlanStatus
  source: LessonPlanSource
  description: string
  instructions: string
  rubric: string
  externalUrl?: string
  aiPrompt?: string
  assets: LessonPlanAsset[]
}

type AssignmentFormState = {
  assignmentName: string
  className: string
  section: string
  assignmentMode: AssignmentMode
  assignmentType: AssignmentType
  assignmentDue: string
  subject: string
  date: string
  status: LessonPlanStatus
  source: LessonPlanSource
  description: string
  instructions: string
  rubric: string
  externalUrl: string
  aiPrompt: string
  assets: LessonPlanAsset[]
}

type SubmissionRecord = {
  id: number
  studentName: string
  className: string
  section: string
  assignmentName: string
  assignmentType: string
  subject: string
  submittedOn: string
  status: 'Submitted' | 'Reviewed'
  score: string
  submissionText: string
  submissionFile: string
}

type StudentProfileCard = {
  id: number
  name: string
  className: string
  section: string
  initials: string
}

type GradeEvaluationEntry = {
  score: string
  comment: string
}

const navTabs: Array<{ label: TeacherTab; icon: typeof Home }> = [
  { label: 'Home', icon: Home },
  { label: 'Lesson Planning', icon: FlaskConical },
  { label: 'Assignments', icon: ClipboardList },
  { label: 'Grades', icon: PenLine },
  { label: 'Communications', icon: MessageSquare },
  { label: 'Reports', icon: BarChart },
  { label: 'Content Library', icon: Upload },
  { label: 'Resources', icon: FolderOpen },
]

const analyticsSummaryCards = [
  { label: 'Total Students', value: '145', icon: Users, note: 'Across 4 active classes' },
  { label: 'Average Score', value: '81%', icon: GraduationCap, note: 'Steady month-over-month growth' },
  { label: 'Assignments Completed', value: '126', icon: ClipboardList, note: '92% completion this month' },
  { label: 'Pending Tasks', value: '18', icon: PenLine, note: 'Needs teacher follow-up' },
  { label: 'Overall Performance', value: '87%', icon: BarChart, note: 'Up 5% since January' },
]

const attendanceDashboardData = [
  { month: 'Jan', grade6: 120, grade7: 135, grade8: 110, g6p: '80%', g7p: '90%', g8p: '79%' },
  { month: 'Feb', grade6: 130, grade7: 140, grade8: 115, g6p: '87%', g7p: '93%', g8p: '82%' },
  { month: 'Mar', grade6: 125, grade7: 138, grade8: 120, g6p: '83%', g7p: '92%', g8p: '86%' },
]

const classPerformanceData = [
  { className: 'Class 6', avgScore: 76, submissionRate: 72, completionRate: 74, pendingTasks: 9, topStrength: 'Concept retention' },
  { className: 'Class 7', avgScore: 89, submissionRate: 94, completionRate: 91, pendingTasks: 4, topStrength: 'Consistent submissions' },
  { className: 'Class 8', avgScore: 83, submissionRate: 86, completionRate: 88, pendingTasks: 5, topStrength: 'Strong project work' },
]

const analyticsInsights = [
  'Class 7 has highest performance across score, submission, and completion metrics.',
  'Class 6 needs improvement in assignment submissions and pending task closure.',
  'Overall performance increased by 5% over the last six months.',
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

const initialLabActivities: LabActivity[] = [
  {
    id: 1,
    title: 'Chemistry Lab: Acid-Base Reactions',
    course: 'Science',
    module: 'Chemistry Fundamentals',
    grade: '8',
    type: 'Experiment',
    status: 'Active',
    description: 'Investigate how acids and bases react using common indicators.',
    objective: 'Help learners identify pH behavior and reaction outcomes.',
    materials: 'Litmus paper, beakers, vinegar, baking soda',
    procedureSteps: ['Review safety instructions', 'Mix solution samples', 'Record indicator changes'],
    observations: 'Students observed immediate color changes.',
    result: 'Learners successfully classified acids and bases.',
    source: 'Manual',
    complianceCode: 'SCI-LAB-104',
    scheduleDate: '2026-04-15',
    date: '2026-03-25',
    author: 'Skaimitra Science Team',
    createdBy: 'internal',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-27',
    shareScope: 'All Users',
    sharedWith: ['All science teachers'],
    assets: [],
  },
  {
    id: 2,
    title: 'Physics Lab: Simple Pendulum',
    course: 'Science',
    module: 'Motion and Measurement',
    grade: '7',
    type: 'Demonstration',
    status: 'Draft',
    description: 'Measure time period variation using different string lengths.',
    objective: 'Connect pendulum length with oscillation time.',
    materials: 'Thread, bob, timer, measuring tape',
    procedureSteps: ['Set three pendulum lengths', 'Time 10 oscillations', 'Compare findings'],
    observations: 'Longer strings increased the time period.',
    result: 'Students linked pattern recognition to practical observation.',
    source: 'External',
    complianceCode: 'PHY-LAB-212',
    scheduleDate: '2026-04-21',
    date: '2026-03-26',
    author: 'External Curriculum Partner',
    createdBy: 'external',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-28',
    externalUrl: 'https://curriculum.example.com/pendulum-lab',
    shareScope: 'Selected Users',
    sharedWith: ['Rahul Sharma', 'Anita Rao'],
    assets: [],
  },
]

const lessonTypeOptions: LessonPlan['type'][] = ['Lesson', 'Project', 'Discussion']
const lessonStatusOptions: LessonPlanStatus[] = ['Draft', 'Active', 'Inactive', 'Deleted']
const labTypeOptions: LabActivity['type'][] = ['Experiment', 'Demonstration', 'Observation']

const createEmptyLessonPlanForm = (): LessonPlanFormState => ({
  course: '',
  module: '',
  grade: '',
  type: 'Lesson',
  status: 'Draft',
  title: '',
  description: '',
  scheduleDate: '',
  complianceCode: '',
  source: 'Manual',
  className: '',
  objectives: '',
  materials: '',
  activities: '',
  assessment: '',
  externalUrl: '',
  aiTopic: '',
  aiObjective: '',
  aiPrompt: '',
  aiDraft: '',
  assets: [],
  shareEnabled: false,
  shareScope: 'private',
  shareUsers: '',
})

const createEmptyLabActivityForm = (): LabActivityFormState => ({
  course: '',
  module: '',
  grade: '',
  type: 'Experiment',
  status: 'Draft',
  title: '',
  description: '',
  scheduleDate: '',
  complianceCode: '',
  source: 'Manual',
  objective: '',
  materials: '',
  procedureSteps: [''],
  observations: '',
  result: '',
  externalUrl: '',
  aiPrompt: '',
  aiDraft: '',
  assets: [],
  shareEnabled: false,
  shareScope: 'private',
  shareUsers: '',
})

const assignmentTypeOptions: AssignmentType[] = ['Quiz', 'Paper', 'Homework', 'Project']
const assignmentModeOptions: AssignmentMode[] = ['Online', 'Offline']
const assignmentClassOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const assignmentSectionOptions = ['A', 'B', 'C']
const lessonCourseOptions = ['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'General']
const classOptions = ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII']
const lessonPromptSuggestions = [
  'Create a complete lesson plan for Class 7 English on Grammar (Tenses) with objectives, examples, activities, and assessment.',
  'Generate a mathematics lesson plan for Class 8 Algebra including step-by-step teaching flow and exercises.',
  'Prepare a science lesson plan for Class 6 on Electricity with experiment and evaluation methods.',
  'Design an interactive lesson plan using group activities and quizzes for Social Science (Class 7).',
  'Create a beginner-friendly lesson plan with visual aids and simple assessments.',
]
const labPromptSuggestions = [
  'Create a lab activity for Class 8 Physics on light reflection',
  'Generate a computer lab activity using Micro:bit',
  'Design a science experiment for Class 7',
]

const createEmptyAssignmentForm = (): AssignmentFormState => ({
  assignmentName: '',
  className: '',
  section: '',
  assignmentMode: 'Online',
  assignmentType: 'Quiz',
  assignmentDue: '',
  subject: '',
  date: '',
  status: 'Draft',
  source: 'Manual',
  description: '',
  instructions: '',
  rubric: '',
  externalUrl: '',
  aiPrompt: '',
  assets: [],
})

const initialAssignments: AssignmentRecord[] = [
  {
    id: 1,
    assignmentName: 'Algebra Quiz',
    className: 'Class 6',
    section: 'A',
    assignmentMode: 'Online',
    assignmentType: 'Quiz',
    assignmentDue: '2026-04-20',
    subject: 'Mathematics',
    date: '2026-04-12',
    status: 'Active',
    source: 'Manual',
    description: 'Assess understanding of algebra basics and equations.',
    instructions: 'Attempt all questions and submit within 30 minutes.',
    rubric: 'Accuracy, steps shown, and completion.',
    assets: [],
  },
  {
    id: 2,
    assignmentName: 'Science Research Paper',
    className: 'Class 7',
    section: 'B',
    assignmentMode: 'Offline',
    assignmentType: 'Paper',
    assignmentDue: '2026-04-22',
    subject: 'Science',
    date: '2026-04-14',
    status: 'Draft',
    source: 'External',
    description: 'Summarize a renewable energy topic using external references.',
    instructions: 'Use the provided source link and cite two additional references.',
    rubric: 'Research quality, structure, originality, and citation accuracy.',
    externalUrl: 'https://curriculum.example.com/renewable-energy-paper',
    assets: [],
  },
  {
    id: 3,
    assignmentName: 'Essay Writing',
    className: 'Class 8',
    section: 'C',
    assignmentMode: 'Online',
    assignmentType: 'Project',
    assignmentDue: '2026-04-25',
    subject: 'English',
    date: '2026-04-16',
    status: 'Active',
    source: 'AI',
    description: 'Create a persuasive essay on environmental responsibility.',
    instructions: 'Prepare a first draft, peer review, and final submission.',
    rubric: 'Clarity, grammar, evidence, and argument structure.',
    aiPrompt: 'Create a persuasive writing assignment for grade 8 on environmental responsibility.',
    assets: [],
  },
]

const gradeStudentProfiles: StudentProfileCard[] = [
  { id: 1, name: 'Rahul Sharma', className: 'Class 6', section: 'A', initials: 'RS' },
  { id: 2, name: 'Priya Reddy', className: 'Class 7', section: 'B', initials: 'PR' },
  { id: 3, name: 'Arjun Kumar', className: 'Class 8', section: 'C', initials: 'AK' },
  { id: 4, name: 'Sneha Patel', className: 'Class 9', section: 'A', initials: 'SP' },
]

const initialSubmittedAssignments: SubmissionRecord[] = [
  {
    id: 1,
    studentName: 'Rahul Sharma',
    className: 'Class 6',
    section: 'A',
    assignmentName: 'Algebra Quiz',
    assignmentType: 'Quiz',
    subject: 'Mathematics',
    submittedOn: '2026-04-18',
    status: 'Submitted',
    score: 'Pending',
    submissionText: 'Solved algebra equations, simplified expressions, and explained the method for each answer.',
    submissionFile: 'rahul-algebra-quiz.pdf',
  },
  {
    id: 2,
    studentName: 'Priya Reddy',
    className: 'Class 7',
    section: 'B',
    assignmentName: 'Science Research Paper',
    assignmentType: 'Paper',
    subject: 'Science',
    submittedOn: '2026-04-20',
    status: 'Reviewed',
    score: '90%',
    submissionText: 'Summarized renewable energy sources with diagrams, sources, and classroom examples.',
    submissionFile: 'priya-science-paper.docx',
  },
  {
    id: 3,
    studentName: 'Arjun Kumar',
    className: 'Class 8',
    section: 'C',
    assignmentName: 'Essay Writing',
    assignmentType: 'Project',
    subject: 'English',
    submittedOn: '2026-04-21',
    status: 'Reviewed',
    score: '82%',
    submissionText: 'Submitted a persuasive essay draft with introduction, supporting points, and conclusion.',
    submissionFile: 'arjun-essay-writing.pdf',
  },
  {
    id: 4,
    studentName: 'Sneha Patel',
    className: 'Class 9',
    section: 'A',
    assignmentName: 'Lab Observation Sheet',
    assignmentType: 'Project',
    subject: 'Science',
    submittedOn: '2026-04-22',
    status: 'Submitted',
    score: 'Pending',
    submissionText: 'Uploaded lab observations with measurements, conclusions, and experiment photos.',
    submissionFile: 'sneha-lab-observation.pptx',
  },
]

const uploads = [
  { id: 1, title: 'Chapter 4 - Algebra.pdf', type: 'PDF', updated: '2.4 MB • Feb 15, 2026' },
  { id: 2, title: 'Science Presentation.pptx', type: 'PPTX', updated: '5.1 MB • Feb 14, 2026' },
  { id: 3, title: 'Lecture Video.mp4', type: 'MP4', updated: '45.3 MB • Feb 13, 2026' },
]

const createResourceThumbnail = (title: string, subtitle: string, bgStart: string, bgEnd: string, badge: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="760" height="360" viewBox="0 0 760 360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="100%" stop-color="${bgEnd}" />
        </linearGradient>
      </defs>
      <rect width="760" height="360" rx="28" fill="url(#g)" />
      <circle cx="644" cy="92" r="60" fill="rgba(255,255,255,0.16)" />
      <circle cx="102" cy="286" r="78" fill="rgba(255,255,255,0.12)" />
      <rect x="58" y="42" width="128" height="42" rx="21" fill="rgba(255,255,255,0.22)" />
      <text x="122" y="69" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${badge}</text>
      <text x="58" y="170" font-size="38" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${title}</text>
      <text x="58" y="214" font-size="20" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.92)">${subtitle}</text>
    </svg>
  `)}`

const resources = [
  {
    id: 1,
    title: 'Micro:bit',
    type: 'Physical Computing',
    audience: 'All Classes',
    url: 'https://microbit.org/',
    image: createResourceThumbnail('Micro:bit', 'Explore coding, electronics, and classroom making', '#2563eb', '#1d4ed8', 'Build'),
  },
  {
    id: 2,
    title: 'National Geographic Kids',
    type: 'Interactive Learning',
    audience: 'Students',
    url: 'https://kids.nationalgeographic.com/',
    image: createResourceThumbnail('Nat Geo Kids', 'Explore animals, science, and world facts', '#f59e0b', '#f97316', 'Explore'),
  },
  {
    id: 3,
    title: 'Scratch',
    type: 'Coding Playground',
    audience: 'Students',
    url: 'https://scratch.mit.edu/',
    image: createResourceThumbnail('Scratch', 'Create games, stories, and code projects', '#f97316', '#ef4444', 'Code'),
  },
  {
    id: 4,
    title: 'Khan Academy',
    type: 'Self-paced Practice',
    audience: 'Students',
    url: 'https://www.khanacademy.org/',
    image: createResourceThumbnail('Khan Academy', 'Practice maths, science, and more', '#16a34a', '#0f766e', 'Learn'),
  },
  {
    id: 5,
    title: 'BBC Bitesize',
    type: 'Revision Resource',
    audience: 'Students',
    url: 'https://www.bbc.co.uk/bitesize',
    image: createResourceThumbnail('BBC Bitesize', 'Quick revision guides and study support', '#8b5cf6', '#7c3aed', 'Revise'),
  },
]

const initialLessonPlans: LessonPlan[] = [
  {
    id: 1,
    title: 'Introduction to Algebra',
    course: 'Mathematics',
    module: 'Algebra Basics',
    className: 'Class 6',
    grade: '6',
    subject: 'Mathematics',
    type: 'Lesson',
    status: 'Active',
    description: 'Learn the basics of algebra including variables and expressions.',
    complianceCode: 'MATH-ALG-001',
    standards: 'NCERT Math 6',
    objectives: 'Understand fundamental algebra concepts',
    materials: 'Whiteboard, algebra worksheets',
    activities: 'Problem-solving exercises',
    assessment: 'Quiz and assignments',
    source: 'Manual',
    createdBy: 'internal',
    date: '2026-02-20',
    author: 'Skaimitra Mathematics Team',
    createdAt: '2026-02-20',
    updatedAt: '2026-03-29',
    publishedAt: '2026-03-29',
    shareScope: 'All Users',
    sharedWith: ['All mathematics teachers'],
    assets: [],
  },
  {
    id: 2,
    title: 'Photosynthesis Process',
    course: 'Science',
    module: 'Biology',
    className: 'Class 7',
    grade: '7',
    subject: 'Science',
    type: 'Lesson',
    status: 'Draft',
    description: 'Explore the process of photosynthesis in plants.',
    complianceCode: 'SCI-BIO-002',
    standards: 'NCERT Science 7',
    objectives: 'Understand photosynthesis mechanism',
    materials: 'Lab equipment, plant samples',
    activities: 'Experimental observation',
    assessment: 'Lab report',
    source: 'External',
    createdBy: 'external',
    date: '2026-02-21',
    author: 'External Science Contributor',
    createdAt: '2026-02-21',
    updatedAt: '2026-03-26',
    externalUrl: 'https://curriculum.example.com/photosynthesis-plan',
    assignedApprover: 'Teacher',
    shareScope: 'Selected Users',
    sharedWith: ['Science Department'],
    assets: [],
  },
]

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

const createProfileAvatar = (name: string, colorA = '#a855f7', colorB = '#7c3aed') =>
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

function TeacherDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TeacherTab>('Home')
  const [homeSearchTerm, setHomeSearchTerm] = useState('')
  const [plannerTab, setPlannerTab] = useState<PlannerWorkspaceTab>('lesson')
  const [plannerView, setPlannerView] = useState<PlannerView>('summary')
  const [labSearchTerm, setLabSearchTerm] = useState('')
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('')
  const [assignmentBuilderMode, setAssignmentBuilderMode] = useState<LessonPlanSource>('Manual')
  const [isAssignmentBuilderOpen, setIsAssignmentBuilderOpen] = useState(false)
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null)
  const [gradeSearchTerm, setGradeSearchTerm] = useState('')
  const [gradeClassFilter, setGradeClassFilter] = useState('All Classes')
  const [gradeSectionFilter, setGradeSectionFilter] = useState('All Sections')
  const [gradeSubmissions, setGradeSubmissions] = useState<SubmissionRecord[]>(initialSubmittedAssignments)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null)
  const [isGradeEvaluatorOpen, setIsGradeEvaluatorOpen] = useState(false)
  const [gradeMethod, setGradeMethod] = useState<'manual' | 'ai'>('manual')
  const [gradeEvaluation, setGradeEvaluation] = useState<GradeEvaluationEntry>({ score: '', comment: '' })
  const [uploadSearchTerm, setUploadSearchTerm] = useState('')
  const [resourceSearchTerm, setResourceSearchTerm] = useState('')
  const [teacherName, setTeacherName] = useState(() => localStorage.getItem('skaimitra_name')?.trim() || 'Teacher')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showLessonPromptSuggestions, setShowLessonPromptSuggestions] = useState(false)
  const [showLabPromptSuggestions, setShowLabPromptSuggestions] = useState(false)
  const [teacherProfile, setTeacherProfile] = useState<ProfileSettingsData>(() => ({
    name: localStorage.getItem('skaimitra_name')?.trim() || 'Teacher',
    email: localStorage.getItem('skaimitra_teacher_email')?.trim() || 'teacher@skaimitra.com',
    phone: localStorage.getItem('skaimitra_teacher_phone')?.trim() || '+91 98765 43210',
    subject: localStorage.getItem('skaimitra_teacher_subject')?.trim() || 'Mathematics',
    role: 'Teacher',
  }))
  const [selectedReportClass, setSelectedReportClass] = useState<(typeof classPerformanceData)[number] | null>(classPerformanceData[1])
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  const selectedMessageIndex = selectedMessageId ? messages.findIndex((m) => m.id === selectedMessageId) : -1

  const goToPreviousMessage = () => {
    if (selectedMessageIndex > 0) {
      setSelectedMessageId(messages[selectedMessageIndex - 1].id)
    }
  }

  const goToNextMessage = () => {
    if (selectedMessageIndex >= 0 && selectedMessageIndex < messages.length - 1) {
      setSelectedMessageId(messages[selectedMessageIndex + 1].id)
    }
  }

  const [announcements, setAnnouncements] = useState<DashboardAnnouncement[]>(() => loadAnnouncements())
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [showUnreadNotifications, setShowUnreadNotifications] = useState(false)
  const [viewedAnnouncementIds, setViewedAnnouncementIds] = useState<number[]>([])
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
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

  // Lesson Plan State
  const [lessonPlansState, setLessonPlansState] = useState<LessonPlan[]>([])
  const [assignmentRecords, setAssignmentRecords] = useState<AssignmentRecord[]>(initialAssignments)
  const [labActivitiesState, setLabActivitiesState] = useState<LabActivity[]>(initialLabActivities)
  const [editingLessonPlanId, setEditingLessonPlanId] = useState<number | null>(null)
  const [editingLabActivityId, setEditingLabActivityId] = useState<number | null>(null)
  const [lessonBuilderMode, setLessonBuilderMode] = useState<LessonPlanSource>('Manual')
  const [labBuilderMode, setLabBuilderMode] = useState<LessonPlanSource>('Manual')
  const [lessonSearchTerm, setLessonSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null)
  const [selectedLabActivity, setSelectedLabActivity] = useState<LabActivity | null>(initialLabActivities[0] ?? null)
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRecord | null>(initialAssignments[0] ?? null)
  const [lessonSharePromptVisible, setLessonSharePromptVisible] = useState(false)
  const [labSharePromptVisible, setLabSharePromptVisible] = useState(false)
  const [lessonPlanForm, setLessonPlanForm] = useState<LessonPlanFormState>(() => createEmptyLessonPlanForm())
  const [labActivityForm, setLabActivityForm] = useState<LabActivityFormState>(() => createEmptyLabActivityForm())
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormState>(() => createEmptyAssignmentForm())

  useEffect(() => {
    if (plannerView !== 'builder') return
    const handlePop = () => setPlannerView('summary')
    window.addEventListener('popstate', handlePop)
    window.history.pushState({ plannerView: 'builder' }, '')
    return () => window.removeEventListener('popstate', handlePop)
  }, [plannerView])

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

  // Load lesson plans when component mounts or when activeTab changes to Lesson Planning
  useEffect(() => {
    if (activeTab === 'Lesson Planning') {
      const loadLessons = async () => {
        try {
          const token = localStorage.getItem('skaimitra_token') || undefined
          const response = await fetchLessonPlans(token)
          const nextLessonPlans = response.lessonPlans || initialLessonPlans
          setLessonPlansState(nextLessonPlans)
          setSelectedPlan((current) => current ?? nextLessonPlans[0] ?? null)
        } catch {
          setLessonPlansState(initialLessonPlans)
          setSelectedPlan((current) => current ?? initialLessonPlans[0] ?? null)
        }
      }

      void loadLessons()
    }
  }, [activeTab])

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

  const unreadTeacherAnnouncements = useMemo(
    () => filteredTeacherAnnouncements.filter((item) => !viewedAnnouncementIds.includes(item.id)),
    [filteredTeacherAnnouncements, viewedAnnouncementIds],
  )

  const activeTeacherNotifications = showUnreadNotifications ? unreadTeacherAnnouncements : filteredTeacherAnnouncements
  const safeNotificationIndex = activeTeacherNotifications.length
    ? Math.min(currentNotificationIndex, activeTeacherNotifications.length - 1)
    : 0
  const currentNotification = activeTeacherNotifications[safeNotificationIndex] ?? null
  const isCurrentNotificationUnread = currentNotification ? !viewedAnnouncementIds.includes(currentNotification.id) : false

  const filteredLessonPlans = useMemo(
    () =>
      lessonPlansState.filter((item) => {
        const query = lessonSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.course, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.grade, query) ||
          includesSearch(item.subject, query) ||
          includesSearch(item.status, query) ||
          includesSearch(item.standards, query)
        )
      }),
    [lessonPlansState, lessonSearchTerm],
  )

  const filteredLabActivities = useMemo(
    () =>
      labActivitiesState.filter((item) => {
        const query = labSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.title, query) ||
          includesSearch(item.course, query) ||
          includesSearch(item.module, query) ||
          includesSearch(item.grade, query) ||
          includesSearch(item.status, query)
        )
      }),
    [labActivitiesState, labSearchTerm],
  )

  const filteredAssignments = useMemo(
    () =>
      assignmentRecords.filter((item) => {
        const query = assignmentSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(item.id, query) ||
          includesSearch(item.assignmentName, query) ||
          includesSearch(item.className, query) ||
          includesSearch(item.section, query) ||
          includesSearch(item.assignmentType, query) ||
          includesSearch(item.assignmentDue, query) ||
          includesSearch(item.subject, query) ||
          includesSearch(item.date, query)
        )
      }),
    [assignmentRecords, assignmentSearchTerm],
  )

  const filteredGradeRows = useMemo(
    () =>
      gradeSubmissions.filter((student) => {
        const query = gradeSearchTerm.trim().toLowerCase()
        const matchesQuery = !query || (
          includesSearch(student.id, query) ||
          includesSearch(student.studentName, query) ||
          includesSearch(student.className, query) ||
          includesSearch(student.section, query) ||
          includesSearch(student.assignmentName, query) ||
          includesSearch(student.assignmentType, query) ||
          includesSearch(student.subject, query) ||
          includesSearch(student.submittedOn, query) ||
          includesSearch(student.status, query) ||
          includesSearch(student.score, query)
        )

        const matchesClass = gradeClassFilter === 'All Classes' || student.className === gradeClassFilter
        const matchesSection = gradeSectionFilter === 'All Sections' || student.section === gradeSectionFilter

        return matchesQuery && matchesClass && matchesSection
      }),
    [gradeClassFilter, gradeSearchTerm, gradeSectionFilter, gradeSubmissions],
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

  const markNotificationViewed = (notificationId: number | null) => {
    if (!notificationId) return
    setViewedAnnouncementIds((current) => (current.includes(notificationId) ? current : [...current, notificationId]))
  }

  const handlePreviousNotification = () => {
    markNotificationViewed(currentNotification?.id ?? null)
    setCurrentNotificationIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNextNotification = () => {
    markNotificationViewed(currentNotification?.id ?? null)
    setCurrentNotificationIndex((prev) => Math.min(prev + 1, Math.max(activeTeacherNotifications.length - 1, 0)))
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
    } catch {
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
    } catch {
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

  // Lesson and lab planner helpers
  const formatPlannerDate = (value?: string) => {
    if (!value) return 'Not available'

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value

    return parsed.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusBadgeClass = (status: LessonPlanStatus) => {
    switch (status) {
      case 'Active':
        return 'status-active'
      case 'Draft':
        return 'status-draft'
      case 'Inactive':
        return 'status-inactive'
      default:
        return 'status-muted'
    }
  }

  const createAssetRecord = (file: File): LessonPlanAsset => ({
    id: `${file.name}-${file.lastModified}`,
    name: file.name,
    type: file.type || 'File',
    url: URL.createObjectURL(file),
    size: file.size,
  })

  const getShareScopeLabel = (scope: ShareVisibility) => {
    switch (scope) {
      case 'all users':
        return 'All Users'
      case 'users':
        return 'Selected Users'
      default:
        return 'Private'
    }
  }

  const openNewLessonBuilder = () => {
    setPlannerTab('lesson')
    setPlannerView('builder')
    setEditingLessonPlanId(null)
    setLessonBuilderMode('Manual')
    setLessonPlanForm(createEmptyLessonPlanForm())
    setLessonSharePromptVisible(false)
  }

  const openEditLessonPlanBuilder = (plan: LessonPlan) => {
    setPlannerTab('lesson')
    setPlannerView('builder')
    setEditingLessonPlanId(plan.id)
    setLessonBuilderMode(plan.source)
    setLessonPlanForm({
      course: plan.course,
      module: plan.module,
      grade: plan.grade,
      type: plan.type,
      status: plan.status,
      title: plan.title,
      description: plan.description,
      scheduleDate: plan.publishedAt || plan.updatedAt || plan.date,
      complianceCode: plan.complianceCode,
      source: plan.source,
      className: plan.className,
      objectives: plan.objectives,
      materials: plan.materials,
      activities: plan.activities,
      assessment: plan.assessment,
      externalUrl: plan.externalUrl || '',
      aiTopic: plan.title,
      aiObjective: plan.objectives,
      aiPrompt: plan.aiPrompt || '',
      aiDraft: plan.activities || plan.description || '',
      assets: plan.assets || [],
      shareEnabled: plan.shareScope ? plan.shareScope !== 'Private' : false,
      shareScope: plan.shareScope === 'All Users' ? 'all users' : plan.shareScope === 'Selected Users' ? 'users' : 'private',
      shareUsers: plan.sharedWith?.join(', ') || '',
    })
    setLessonSharePromptVisible(true)
  }

  const cancelLessonBuilder = () => {
    setPlannerView('summary')
    setEditingLessonPlanId(null)
    setLessonSharePromptVisible(false)
    navigate(-1)
  }

  const handlePlannerBack = () => {
    setPlannerView('summary')
    navigate(-1)
  }

  const updateLessonPlanField = <K extends keyof LessonPlanFormState>(field: K, value: LessonPlanFormState[K]) => {
    setLessonPlanForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLessonAssetUpload = (files: FileList | null) => {
    if (!files?.length) return

    const nextAssets = Array.from(files).map(createAssetRecord)
    setLessonPlanForm((prev) => ({ ...prev, assets: [...prev.assets, ...nextAssets] }))
    setLessonSharePromptVisible(true)
    setCalendarNotice({ type: 'success', message: 'Assets uploaded. Choose how you want to share them.' })
  }

  const removeLessonAsset = (assetId: string) => {
    setLessonPlanForm((prev) => ({ ...prev, assets: prev.assets.filter((asset) => asset.id !== assetId) }))
  }

  const generateLessonPlanWithAI = () => {
    if (!lessonPlanForm.aiTopic.trim() && !lessonPlanForm.aiPrompt.trim()) {
      setCalendarNotice({ type: 'error', message: 'Add a topic or prompt so AI can generate the lesson plan.' })
      return
    }

    const topic =
      lessonPlanForm.aiTopic.trim() ||
      lessonPlanForm.title.trim() ||
      lessonPlanForm.aiPrompt.trim() ||
      'the selected topic'
    const learningGoal = lessonPlanForm.aiObjective.trim() || 'build understanding through guided instruction'

    setLessonPlanForm((prev) => ({
      ...prev,
      title: prev.title || `${topic} Lesson Plan`,
      description: prev.description || `AI-assisted lesson outline for ${topic}.`,
      objectives: `Students will ${learningGoal}.`,
      materials: prev.materials || 'Slides, whiteboard, student notebooks, formative exit ticket',
      activities:
        prev.activities ||
        `1. Hook learners with a short warm-up on ${topic}.\n2. Model the concept with direct instruction.\n3. Facilitate pair practice and guided discussion.\n4. Close with a reflective check for understanding.`,
      assessment: prev.assessment || 'Quick formative check, class discussion, and independent practice review.',
      aiDraft:
        prev.aiDraft ||
        `Lesson Topic: ${topic}\n\nObjectives:\n- Students will ${learningGoal}.\n\nMaterials:\n- Slides, whiteboard, student notebooks, formative exit ticket\n\nActivities:\n1. Hook learners with a short warm-up on ${topic}.\n2. Model the concept with direct instruction.\n3. Facilitate pair practice and guided discussion.\n4. Close with a reflective check for understanding.\n\nAssessment:\n- Quick formative check, class discussion, and independent practice review.`,
    }))
    setCalendarNotice({ type: 'success', message: 'AI draft generated. You can refine the content before saving.' })
  }

  const saveLessonPlan = (publish: boolean) => {
    if (!lessonPlanForm.title.trim() || !lessonPlanForm.course.trim() || !lessonPlanForm.module.trim()) {
      setCalendarNotice({ type: 'error', message: 'Please complete Course, Module, and Title before saving.' })
      return
    }

    const now = new Date().toISOString().slice(0, 10)
    const nextPlan: LessonPlan = {
      id: editingLessonPlanId || Date.now(),
      title: lessonPlanForm.title.trim(),
      course: lessonPlanForm.course.trim(),
      module: lessonPlanForm.module.trim(),
      className: lessonPlanForm.className.trim() || `Class ${lessonPlanForm.grade || 'General'}`,
      grade: lessonPlanForm.grade.trim(),
      subject: lessonPlanForm.course.trim(),
      type: lessonPlanForm.type,
      status: publish ? 'Active' : lessonPlanForm.status,
      description: lessonPlanForm.description.trim(),
      complianceCode: lessonPlanForm.complianceCode.trim(),
      standards: `${lessonPlanForm.course.trim()} - ${lessonPlanForm.module.trim()}`,
      objectives: lessonPlanForm.objectives.trim(),
      materials: lessonPlanForm.materials.trim(),
      activities: lessonPlanForm.activities.trim(),
      assessment: lessonPlanForm.assessment.trim(),
      source: lessonBuilderMode,
      createdBy: lessonBuilderMode === 'External' ? 'external' : lessonBuilderMode === 'AI' ? 'ai' : 'internal',
      assignedApprover: lessonBuilderMode === 'External' ? teacherName : undefined,
      date: now,
      author: teacherName,
      createdAt: editingLessonPlanId ? lessonPlansState.find((plan) => plan.id === editingLessonPlanId)?.createdAt || now : now,
      updatedAt: now,
      publishedAt: publish ? now : lessonPlansState.find((plan) => plan.id === editingLessonPlanId)?.publishedAt,
      externalUrl: lessonBuilderMode === 'External' ? lessonPlanForm.externalUrl.trim() : undefined,
      aiPrompt: lessonBuilderMode === 'AI' ? lessonPlanForm.aiPrompt.trim() : undefined,
      shareScope: lessonPlanForm.shareEnabled ? getShareScopeLabel(lessonPlanForm.shareScope) : 'Private',
      sharedWith:
        lessonPlanForm.shareEnabled && lessonPlanForm.shareScope === 'users'
          ? lessonPlanForm.shareUsers.split(',').map((item) => item.trim()).filter(Boolean)
          : lessonPlanForm.shareEnabled && lessonPlanForm.shareScope === 'all users'
            ? ['All users']
            : [],
      assets: lessonPlanForm.assets,
    }

    setLessonPlansState((prev) => {
      const nextPlans = editingLessonPlanId ? prev.map((plan) => (plan.id === editingLessonPlanId ? nextPlan : plan)) : [nextPlan, ...prev]
      setSelectedPlan(nextPlan)
      return nextPlans
    })
    setPlannerView('summary')
    setEditingLessonPlanId(null)
    setLessonSharePromptVisible(true)
    setCalendarNotice({
      type: 'success',
      message: `Lesson plan ${publish ? 'published' : 'saved as draft'} successfully. Review sharing before distributing it.`,
    })
  }

  const duplicateLessonPlan = (plan: LessonPlan) => {
    const duplicatedPlan: LessonPlan = {
      ...plan,
      id: Date.now(),
      title: `${plan.title} (Copy)`,
      status: 'Draft',
      updatedAt: new Date().toISOString().slice(0, 10),
      publishedAt: undefined,
    }
    setLessonPlansState((prev) => [duplicatedPlan, ...prev])
    setSelectedPlan(duplicatedPlan)
    setCalendarNotice({ type: 'success', message: 'Lesson plan duplicated. You can edit the copy for a new class or module.' })
  }

  const approveLessonPlan = (planId: number) => {
    setLessonPlansState((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, status: 'Active', publishedAt: new Date().toISOString().slice(0, 10) } : plan)),
    )
    setSelectedPlan((prev) => (prev && prev.id === planId ? { ...prev, status: 'Active', publishedAt: new Date().toISOString().slice(0, 10) } : prev))
    setCalendarNotice({ type: 'success', message: 'Lesson plan approved and marked as active.' })
  }

  const deleteLessonPlan = (planId: number) => {
    setLessonPlansState((prev) => prev.filter((plan) => plan.id !== planId))
    setSelectedPlan((prev) => (prev?.id === planId ? null : prev))
    setCalendarNotice({ type: 'success', message: 'Lesson plan removed from the summary view.' })
  }

  const printLessonPlan = (plan: LessonPlan) => {
    const printWindow = window.open('', '', 'width=900,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head><title>${plan.title}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>${plan.title}</h1>
          <p><strong>Course:</strong> ${plan.course}</p>
          <p><strong>Module:</strong> ${plan.module}</p>
          <p><strong>Type:</strong> ${plan.type}</p>
          <p><strong>Compliance Code:</strong> ${plan.complianceCode || 'N/A'}</p>
          <p><strong>Description:</strong> ${plan.description || 'N/A'}</p>
          <p><strong>Objectives:</strong> ${plan.objectives || 'N/A'}</p>
          <p><strong>Materials:</strong> ${plan.materials || 'N/A'}</p>
          <p><strong>Activities:</strong> ${plan.activities || 'N/A'}</p>
          <p><strong>Assessment:</strong> ${plan.assessment || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    setCalendarNotice({ type: 'success', message: 'Lesson plan ready to print.' })
  }

  const downloadLessonPlan = (plan: LessonPlan) => {
    const content = [
      `Title: ${plan.title}`,
      `Course: ${plan.course}`,
      `Module: ${plan.module}`,
      `Grade: ${plan.grade}`,
      `Type: ${plan.type}`,
      `Status: ${plan.status}`,
      `Compliance Code: ${plan.complianceCode || 'N/A'}`,
      `Description: ${plan.description || 'N/A'}`,
      `Objectives: ${plan.objectives || 'N/A'}`,
      `Materials: ${plan.materials || 'N/A'}`,
      `Activities: ${plan.activities || 'N/A'}`,
      `Assessment: ${plan.assessment || 'N/A'}`,
    ].join('\n\n')

    const blob = new Blob([content], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${plan.title.replace(/\s+/g, '-')}.pdf`
    anchor.click()
    URL.revokeObjectURL(url)
    setCalendarNotice({ type: 'success', message: 'Lesson plan downloaded in a printable document format.' })
  }

  const canApprovePlan = (plan: LessonPlan) =>
    plan.createdBy === 'external' && (plan.assignedApprover === teacherName || plan.assignedApprover === 'Teacher' || !plan.assignedApprover)

  const openNewLabActivityBuilder = () => {
    setPlannerTab('lab')
    setPlannerView('builder')
    setEditingLabActivityId(null)
    setLabBuilderMode('Manual')
    setLabActivityForm(createEmptyLabActivityForm())
    setLabSharePromptVisible(false)
  }

  const openEditLabActivityBuilder = (activity: LabActivity) => {
    setPlannerTab('lab')
    setPlannerView('builder')
    setEditingLabActivityId(activity.id)
    setLabBuilderMode(activity.source)
    setLabActivityForm({
      course: activity.course,
      module: activity.module,
      grade: activity.grade,
      type: activity.type,
      status: activity.status,
      title: activity.title,
      description: activity.description,
      scheduleDate: activity.scheduleDate,
      complianceCode: activity.complianceCode,
      source: activity.source,
      objective: activity.objective,
      materials: activity.materials,
      procedureSteps: activity.procedureSteps.length ? activity.procedureSteps : [''],
      observations: activity.observations,
      result: activity.result,
      externalUrl: activity.externalUrl || '',
      aiPrompt: activity.aiPrompt || '',
      aiDraft: activity.description || '',
      assets: activity.assets || [],
      shareEnabled: activity.shareScope ? activity.shareScope !== 'Private' : false,
      shareScope: activity.shareScope === 'All Users' ? 'all users' : activity.shareScope === 'Selected Users' ? 'users' : 'private',
      shareUsers: activity.sharedWith?.join(', ') || '',
    })
    setLabSharePromptVisible(true)
  }

  const cancelLabActivityBuilder = () => {
    setPlannerView('summary')
    setEditingLabActivityId(null)
    setLabSharePromptVisible(false)
    navigate(-1)
  }

  const updateLabActivityField = <K extends keyof LabActivityFormState>(field: K, value: LabActivityFormState[K]) => {
    setLabActivityForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateLabProcedureStep = (index: number, value: string) => {
    setLabActivityForm((prev) => ({
      ...prev,
      procedureSteps: prev.procedureSteps.map((step, stepIndex) => (stepIndex === index ? value : step)),
    }))
  }

  const addLabProcedureStep = () => {
    setLabActivityForm((prev) => ({ ...prev, procedureSteps: [...prev.procedureSteps, ''] }))
  }

  const removeLabProcedureStep = (index: number) => {
    setLabActivityForm((prev) => ({
      ...prev,
      procedureSteps: prev.procedureSteps.length === 1 ? [''] : prev.procedureSteps.filter((_, stepIndex) => stepIndex !== index),
    }))
  }

  const handleLabAssetUpload = (files: FileList | null) => {
    if (!files?.length) return

    const nextAssets = Array.from(files).map(createAssetRecord)
    setLabActivityForm((prev) => ({ ...prev, assets: [...prev.assets, ...nextAssets] }))
    setLabSharePromptVisible(true)
    setCalendarNotice({ type: 'success', message: 'Lab assets uploaded. Choose how you want to share them.' })
  }

  const removeLabAsset = (assetId: string) => {
    setLabActivityForm((prev) => ({ ...prev, assets: prev.assets.filter((asset) => asset.id !== assetId) }))
  }

  const generateLabActivityWithAI = () => {
    if (!labActivityForm.aiPrompt.trim() && !labActivityForm.title.trim()) {
      setCalendarNotice({ type: 'error', message: 'Describe the lab so AI can scaffold the activity.' })
      return
    }

    const title =
      labActivityForm.title.trim() ||
      labActivityForm.aiPrompt.trim() ||
      'AI Generated Lab Activity'
    setLabActivityForm((prev) => ({
      ...prev,
      title,
      description: prev.description || `AI-assisted lab design for ${title}.`,
      objective: prev.objective || `Students will investigate ${title.toLowerCase()} and record evidence-based findings.`,
      materials: prev.materials || 'Safety goggles, worksheet, measuring tools, lab apparatus',
      procedureSteps:
        prev.procedureSteps.some((step) => step.trim())
          ? prev.procedureSteps
          : ['Review the objective and safety notes', 'Set up the apparatus', 'Run the investigation and capture observations', 'Discuss results as a class'],
      observations: prev.observations || 'Record visible changes, timing, and measurement values.',
      result: prev.result || 'Summarize whether the observed data supports the prediction.',
      aiDraft:
        prev.aiDraft ||
        `Lab Activity: ${title}\n\nObjective:\n- ${prev.objective || `Students will investigate ${title.toLowerCase()} and record evidence-based findings.`}\n\nMaterials:\n- ${prev.materials || 'Safety goggles, worksheet, measuring tools, lab apparatus'}\n\nProcedure:\n1. Review the objective and safety notes.\n2. Set up the apparatus.\n3. Run the investigation and capture observations.\n4. Discuss results as a class.\n\nObservations:\n- ${prev.observations || 'Record visible changes, timing, and measurement values.'}\n\nResult:\n- ${prev.result || 'Summarize whether the observed data supports the prediction.'}`,
    }))
    setCalendarNotice({ type: 'success', message: 'AI scaffold generated for the lab activity.' })
  }

  const saveLabActivity = (publish: boolean) => {
    if (!labActivityForm.title.trim() || !labActivityForm.course.trim() || !labActivityForm.module.trim()) {
      setCalendarNotice({ type: 'error', message: 'Please complete Course, Module, and Experiment Title before saving.' })
      return
    }

    const now = new Date().toISOString().slice(0, 10)
    const nextActivity: LabActivity = {
      id: editingLabActivityId || Date.now(),
      title: labActivityForm.title.trim(),
      course: labActivityForm.course.trim(),
      module: labActivityForm.module.trim(),
      grade: labActivityForm.grade.trim(),
      type: labActivityForm.type,
      status: publish ? 'Active' : labActivityForm.status,
      description: labActivityForm.description.trim(),
      objective: labActivityForm.objective.trim(),
      materials: labActivityForm.materials.trim(),
      procedureSteps: labActivityForm.procedureSteps.map((step) => step.trim()).filter(Boolean),
      observations: labActivityForm.observations.trim(),
      result: labActivityForm.result.trim(),
      source: labBuilderMode,
      complianceCode: labActivityForm.complianceCode.trim(),
      scheduleDate: labActivityForm.scheduleDate.trim(),
      date: now,
      author: teacherName,
      createdBy: labBuilderMode === 'External' ? 'external' : labBuilderMode === 'AI' ? 'ai' : 'internal',
      createdAt: editingLabActivityId ? labActivitiesState.find((activity) => activity.id === editingLabActivityId)?.createdAt || now : now,
      updatedAt: now,
      publishedAt: publish ? now : labActivitiesState.find((activity) => activity.id === editingLabActivityId)?.publishedAt,
      externalUrl: labBuilderMode === 'External' ? labActivityForm.externalUrl.trim() : undefined,
      aiPrompt: labBuilderMode === 'AI' ? labActivityForm.aiPrompt.trim() : undefined,
      shareScope: labActivityForm.shareEnabled ? getShareScopeLabel(labActivityForm.shareScope) : 'Private',
      sharedWith:
        labActivityForm.shareEnabled && labActivityForm.shareScope === 'users'
          ? labActivityForm.shareUsers.split(',').map((item) => item.trim()).filter(Boolean)
          : labActivityForm.shareEnabled && labActivityForm.shareScope === 'all users'
            ? ['All users']
            : [],
      assets: labActivityForm.assets,
    }

    setLabActivitiesState((prev) => {
      const nextActivities = editingLabActivityId
        ? prev.map((activity) => (activity.id === editingLabActivityId ? nextActivity : activity))
        : [nextActivity, ...prev]
      setSelectedLabActivity(nextActivity)
      return nextActivities
    })
    setPlannerView('summary')
    setEditingLabActivityId(null)
    setLabSharePromptVisible(true)
    setCalendarNotice({
      type: 'success',
      message: `Lab activity ${publish ? 'published' : 'saved as draft'} successfully. Review sharing before distributing it.`,
    })
  }

  const duplicateLabActivity = (activity: LabActivity) => {
    const duplicatedActivity: LabActivity = {
      ...activity,
      id: Date.now(),
      title: `${activity.title} (Copy)`,
      status: 'Draft',
      publishedAt: undefined,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setLabActivitiesState((prev) => [duplicatedActivity, ...prev])
    setSelectedLabActivity(duplicatedActivity)
    setCalendarNotice({ type: 'success', message: 'Lab activity duplicated. You can tailor the copy for another cohort.' })
  }

  const printLabActivity = (activity: LabActivity) => {
    const printWindow = window.open('', '', 'width=900,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head><title>${activity.title}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>${activity.title}</h1>
          <p><strong>Course:</strong> ${activity.course}</p>
          <p><strong>Module:</strong> ${activity.module}</p>
          <p><strong>Objective:</strong> ${activity.objective || 'N/A'}</p>
          <p><strong>Materials:</strong> ${activity.materials || 'N/A'}</p>
          <p><strong>Procedure:</strong> ${activity.procedureSteps.join(', ') || 'N/A'}</p>
          <p><strong>Observations:</strong> ${activity.observations || 'N/A'}</p>
          <p><strong>Result:</strong> ${activity.result || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    setCalendarNotice({ type: 'success', message: 'Lab activity ready to print.' })
  }

  const downloadLabActivity = (activity: LabActivity) => {
    const blob = new Blob([JSON.stringify(activity, null, 2)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${activity.title.replace(/\s+/g, '-')}.pdf`
    anchor.click()
    URL.revokeObjectURL(url)
    setCalendarNotice({ type: 'success', message: 'Lab activity downloaded in a printable document format.' })
  }

  const openNewAssignmentBuilder = () => {
    setIsAssignmentBuilderOpen(true)
    setEditingAssignmentId(null)
    setAssignmentBuilderMode('Manual')
    setAssignmentForm(createEmptyAssignmentForm())
  }

  const openEditAssignmentBuilder = (assignment: AssignmentRecord) => {
    setIsAssignmentBuilderOpen(true)
    setEditingAssignmentId(assignment.id)
    setAssignmentBuilderMode(assignment.source)
    setAssignmentForm({
      assignmentName: assignment.assignmentName,
      className: assignment.className,
      section: assignment.section,
      assignmentMode: assignment.assignmentMode,
      assignmentType: assignment.assignmentType,
      assignmentDue: assignment.assignmentDue,
      subject: assignment.subject,
      date: assignment.date,
      status: assignment.status,
      source: assignment.source,
      description: assignment.description,
      instructions: assignment.instructions,
      rubric: assignment.rubric,
      externalUrl: assignment.externalUrl || '',
      aiPrompt: assignment.aiPrompt || '',
      assets: assignment.assets,
    })
  }

  const closeAssignmentBuilder = () => {
    setIsAssignmentBuilderOpen(false)
    setEditingAssignmentId(null)
  }

  const saveTeacherProfile = (nextProfile: ProfileSettingsData) => {
    setTeacherProfile(nextProfile)
    setTeacherName(nextProfile.name)
    localStorage.setItem('skaimitra_name', nextProfile.name)
    localStorage.setItem('skaimitra_teacher_email', nextProfile.email)
    localStorage.setItem('skaimitra_teacher_phone', nextProfile.phone)
    localStorage.setItem('skaimitra_teacher_subject', nextProfile.subject)
  }

  const updateAssignmentField = <K extends keyof AssignmentFormState>(field: K, value: AssignmentFormState[K]) => {
    setAssignmentForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssignmentAssetUpload = (files: FileList | null) => {
    if (!files?.length) return
    const nextAssets = Array.from(files).map(createAssetRecord)
    setAssignmentForm((prev) => ({ ...prev, assets: [...prev.assets, ...nextAssets] }))
  }

  const removeAssignmentAsset = (assetId: string) => {
    setAssignmentForm((prev) => ({ ...prev, assets: prev.assets.filter((asset) => asset.id !== assetId) }))
  }

  const generateAssignmentWithAI = () => {
    if (!assignmentForm.aiPrompt.trim() && !assignmentForm.assignmentName.trim()) {
      setCalendarNotice({ type: 'error', message: 'Add an assignment title or AI prompt before generating content.' })
      return
    }

    const title = assignmentForm.assignmentName.trim() || 'AI Generated Assignment'
    setAssignmentForm((prev) => ({
      ...prev,
      assignmentName: title,
      description: prev.description || `AI-generated ${prev.assignmentType.toLowerCase()} for ${title}.`,
      instructions:
        prev.instructions ||
        `1. Review the assignment brief.\n2. Complete the required tasks independently.\n3. Submit your work before the due date.\n4. Check the rubric before final submission.`,
      rubric: prev.rubric || 'Understanding, completion, creativity, and clarity of presentation.',
    }))
    setCalendarNotice({ type: 'success', message: 'AI assignment draft generated successfully.' })
  }

  const saveAssignment = (publish: boolean) => {
    if (!assignmentForm.assignmentName.trim() || !assignmentForm.className.trim() || !assignmentForm.subject.trim()) {
      setCalendarNotice({ type: 'error', message: 'Please complete Assignment Name, Class, and Subject before saving.' })
      return
    }

    const nextAssignment: AssignmentRecord = {
      id: editingAssignmentId || Date.now(),
      assignmentName: assignmentForm.assignmentName.trim(),
      className: assignmentForm.className.trim(),
      section: assignmentForm.section.trim(),
      assignmentMode: assignmentForm.assignmentMode,
      assignmentType: assignmentForm.assignmentType,
      assignmentDue: assignmentForm.assignmentDue,
      subject: assignmentForm.subject.trim(),
      date: assignmentForm.date || new Date().toISOString().slice(0, 10),
      status: publish ? 'Active' : assignmentForm.status,
      source: assignmentBuilderMode,
      description: assignmentForm.description.trim(),
      instructions: assignmentForm.instructions.trim(),
      rubric: assignmentForm.rubric.trim(),
      externalUrl: assignmentBuilderMode === 'External' ? assignmentForm.externalUrl.trim() : undefined,
      aiPrompt: assignmentBuilderMode === 'AI' ? assignmentForm.aiPrompt.trim() : undefined,
      assets: assignmentForm.assets,
    }

    setAssignmentRecords((prev) => {
      const nextAssignments = editingAssignmentId
        ? prev.map((assignment) => (assignment.id === editingAssignmentId ? nextAssignment : assignment))
        : [nextAssignment, ...prev]
      setSelectedAssignment(nextAssignment)
      return nextAssignments
    })
    closeAssignmentBuilder()
    setCalendarNotice({ type: 'success', message: `Assignment ${publish ? 'published' : 'saved as draft'} successfully.` })
  }

  const openGradeEvaluator = (submission: SubmissionRecord) => {
    setSelectedSubmission(submission)
    setIsGradeEvaluatorOpen(true)
    setGradeMethod('manual')
    setGradeEvaluation({
      score: submission.score === 'Pending' ? '' : submission.score.replace('%', ''),
      comment: submission.status === 'Reviewed' ? 'Reviewed and ready to share with the student.' : '',
    })
  }

  const updateGradeEvaluationField = (field: keyof GradeEvaluationEntry, value: string) => {
    setGradeEvaluation((prev) => ({ ...prev, [field]: value }))
  }

  const evaluateSelectedSubmissionWithAI = () => {
    if (!selectedSubmission) return

    const suggestedScore =
      selectedSubmission.assignmentType === 'Quiz'
        ? '88'
        : selectedSubmission.assignmentType === 'Paper'
          ? '91'
          : selectedSubmission.assignmentType === 'Project'
            ? '85'
            : '84'

    setGradeMethod('ai')
    setGradeEvaluation({
      score: suggestedScore,
      comment: `${selectedSubmission.studentName} demonstrated a solid understanding of the assignment outcomes. The submission is complete and well structured, with room to improve supporting detail and polish.`,
    })
    setCalendarNotice({ type: 'success', message: 'AI evaluation completed. Review and edit before uploading.' })
  }

  const saveGradeEvaluation = () => {
    if (!selectedSubmission) return
    if (!gradeEvaluation.score.trim()) {
      setCalendarNotice({ type: 'error', message: 'Please enter marks before saving the grade.' })
      return
    }

    setGradeSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === selectedSubmission.id
          ? {
              ...submission,
              status: 'Reviewed',
              score: `${gradeEvaluation.score.replace('%', '')}%`,
            }
          : submission,
      ),
    )
    setSelectedSubmission((prev) =>
      prev
        ? {
            ...prev,
            status: 'Reviewed',
            score: `${gradeEvaluation.score.replace('%', '')}%`,
          }
        : null,
    )
    setCalendarNotice({ type: 'success', message: `Grade saved for ${selectedSubmission.studentName}.` })
  }

  const uploadGradeEvaluation = () => {
    if (!selectedSubmission) return
    if (!gradeEvaluation.score.trim()) {
      setCalendarNotice({ type: 'error', message: 'Enter marks before uploading the final grade.' })
      return
    }

    setGradeSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === selectedSubmission.id
          ? {
              ...submission,
              status: 'Reviewed',
              score: `${gradeEvaluation.score.replace('%', '')}%`,
            }
          : submission,
      ),
    )
    setIsGradeEvaluatorOpen(false)
    setCalendarNotice({ type: 'success', message: `Grade uploaded successfully for ${selectedSubmission.studentName}.` })
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
          title="My Calendar"
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
            <div className="teacher-notification-actions">
              <button
                type="button"
                className={`role-secondary-btn teacher-notification-filter-btn ${showUnreadNotifications ? 'is-active' : ''}`}
                onClick={() => {
                  setShowUnreadNotifications((prev) => !prev)
                  setCurrentNotificationIndex(0)
                }}
              >
                New
              </button>
              <button type="button" className="role-primary-btn teacher-announcement-btn" onClick={handleOpenAnnouncementModal}>
                +
              </button>
            </div>
          </div>

          <div className="role-admin-announcement-list">
            {currentNotification ? (
              <article
                key={`${currentNotification.id}-${showUnreadNotifications ? 'new' : 'all'}`}
                className={`role-admin-announcement-row teacher-notification-card ${isCurrentNotificationUnread ? 'is-unread' : ''}`}
              >
                <div className="role-admin-announcement-copy teacher-notification-copy">
                  <div className="teacher-notification-title-row">
                    <h4>{currentNotification.title}</h4>
                    {isCurrentNotificationUnread ? <span className="teacher-notification-dot" aria-label="Unread notification" /> : null}
                  </div>
                  <p className="role-muted">{currentNotification.message}</p>
                  <div className="teacher-notification-meta">
                    <span>{currentNotification.date}</span>
                    <span>{formatAudienceIds(currentNotification.audienceIds)}</span>
                    <span>Expires {currentNotification.expiresAt}</span>
                  </div>
                </div>
                <div className="role-admin-announcement-actions">
                  <button
                    type="button"
                    className="role-icon-square-btn"
                    aria-label={`Edit ${currentNotification.title}`}
                    onClick={() => handleEditAnnouncement(currentNotification)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="role-icon-square-btn role-icon-square-btn-danger"
                    aria-label={`Delete ${currentNotification.title}`}
                    onClick={() => handleDeleteAnnouncement(currentNotification.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ) : (
              <p className="role-muted">{showUnreadNotifications ? 'No new notifications' : 'No teacher announcements match your search.'}</p>
            )}
            <div className="teacher-notification-nav">
              <button
                type="button"
                className="role-secondary-btn teacher-notification-nav-btn"
                onClick={handlePreviousNotification}
                disabled={safeNotificationIndex === 0 || activeTeacherNotifications.length === 0}
                aria-label="Previous notification"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="teacher-notification-count">
                {activeTeacherNotifications.length === 0 ? '0 / 0' : `${safeNotificationIndex + 1} / ${activeTeacherNotifications.length}`}
              </span>
              <button
                type="button"
                className="role-secondary-btn teacher-notification-nav-btn"
                onClick={handleNextNotification}
                disabled={activeTeacherNotifications.length === 0 || safeNotificationIndex >= activeTeacherNotifications.length - 1}
                aria-label="Next notification"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <AIChat role="teacher" />

      </aside>
    </main>
  )

  const renderReports = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-card role-detail-card analytics-reports-shell">
          <div className="role-section-head">
            <div>
              <h2>Analytics & Reports</h2>
              <p className="role-muted">System-wide analytics and performance metrics</p>
            </div>
          </div>

          <div className="analytics-summary-grid">
            {analyticsSummaryCards.map((item) => (
              <article key={item.label} className="analytics-summary-card">
                <div>
                  <p className="analytics-summary-label">{item.label}</p>
                  <p className="analytics-summary-value">{item.value}</p>
                  <span className="role-muted">{item.note}</span>
                </div>
                <span className="analytics-summary-icon">
                  <item.icon size={18} />
                </span>
              </article>
            ))}
          </div>

          <div className="analytics-chart-grid">
            <section className="analytics-chart-card">
              <div className="role-section-head">
                <div>
                  <h3 className="role-section-title">Attendance Dashboard</h3>
                  <p className="role-muted">Class-wise monthly attendance counts with percentage labels</p>
                </div>
              </div>
              <div className="analytics-chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsBarChart data={attendanceDashboardData} barGap={10} barCategoryGap="22%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const percentageKey =
                          props.dataKey === 'grade6' ? 'g6p' : props.dataKey === 'grade7' ? 'g7p' : 'g8p'
                        const percentage = props.payload?.[percentageKey] ?? ''
                        const seriesName = name === 'grade6' ? 'Grade 6' : name === 'grade7' ? 'Grade 7' : 'Grade 8'
                        return [`${value} (${percentage})`, seriesName]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="grade6" name="grade6" fill="#2563eb" radius={[10, 10, 0, 0]} maxBarSize={42}>
                      <LabelList dataKey="g6p" position="top" fill="#1f2937" fontSize={13} fontWeight={700} />
                    </Bar>
                    <Bar dataKey="grade7" name="grade7" fill="#f97316" radius={[10, 10, 0, 0]} maxBarSize={42}>
                      <LabelList dataKey="g7p" position="top" fill="#1f2937" fontSize={13} fontWeight={700} />
                    </Bar>
                    <Bar dataKey="grade8" name="grade8" fill="#16a34a" radius={[10, 10, 0, 0]} maxBarSize={42}>
                      <LabelList dataKey="g8p" position="top" fill="#1f2937" fontSize={13} fontWeight={700} />
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="analytics-chart-card">
              <div className="role-section-head">
                <div>
                  <h3 className="role-section-title">Performance by Class</h3>
                  <p className="role-muted">Click a class bar to inspect the detailed breakdown</p>
                </div>
              </div>
              <div className="analytics-chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsBarChart data={classPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="className" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[0, 100]} />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                        if (name === 'avgScore') return [`${value}%`, 'Avg score']
                        if (name === 'submissionRate') return [`${props.payload?.submissionRate ?? numericValue}%`, 'Submission %']
                        return [`${numericValue}%`, String(name)]
                      }}
                    />
                    <Bar
                      dataKey="avgScore"
                      radius={[12, 12, 0, 0]}
                      fill="url(#teacherReportsGradient)"
                      name="avgScore"
                      onClick={(_, index) => setSelectedReportClass(classPerformanceData[index])}
                    />
                    <defs>
                      <linearGradient id="teacherReportsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="analytics-insights-grid">
            <section className="analytics-chart-card">
              <div className="role-section-head">
                <div>
                  <h3 className="role-section-title">Quick Insights</h3>
                  <p className="role-muted">Instant takeaways from this month’s performance dashboard</p>
                </div>
              </div>
              <div className="analytics-insights-list">
                {analyticsInsights.map((insight) => (
                  <article key={insight} className="analytics-insight-item">
                    <CheckCircle size={16} />
                    <span>{insight}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="analytics-chart-card">
              <div className="role-section-head">
                <div>
                  <h3 className="role-section-title">Selected Class Breakdown</h3>
                  <p className="role-muted">Click a class in the bar chart to update this summary</p>
                </div>
              </div>
              {selectedReportClass ? (
                <div className="analytics-breakdown-grid">
                  <div className="analytics-breakdown-hero">
                    <h4>{selectedReportClass.className}</h4>
                    <p className="role-muted">{selectedReportClass.topStrength}</p>
                  </div>
                  <div className="analytics-breakdown-stats">
                    <p><strong>Average score:</strong> {selectedReportClass.avgScore}%</p>
                    <p><strong>Submission rate:</strong> {selectedReportClass.submissionRate}%</p>
                    <p><strong>Completion rate:</strong> {selectedReportClass.completionRate}%</p>
                    <p><strong>Pending tasks:</strong> {selectedReportClass.pendingTasks}</p>
                  </div>
                </div>
              ) : (
                <p className="role-muted">Select a class from the chart to view more details.</p>
              )}
              <div className="analytics-breakdown-note">
                <span className="role-muted">Recommended focus:</span>
                <strong>{selectedReportClass?.className === 'Class 6' ? 'Improve submission discipline through weekly reminders.' : selectedReportClass?.className === 'Class 7' ? 'Maintain current momentum and assign enrichment tasks.' : 'Increase assessment confidence with revision sessions.'}</strong>
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  )

  const plannerModes: LessonPlanSource[] = ['Manual', 'External', 'AI']

  const renderShareSettings = (
    type: 'lesson' | 'lab',
    shareVisible: boolean,
    shareEnabled: boolean,
    shareScope: ShareVisibility,
    shareUsers: string,
  ) => (
    <section className={`role-card planner-card planner-share-card ${shareVisible ? 'is-highlighted' : ''}`}>
      <div className="planner-card-head">
        <div>
          <h3>Sharing</h3>
          <p className="role-muted">
            After uploading assets or saving, decide whether this should stay private, be shared globally, or be sent to selected users.
          </p>
        </div>
      </div>
      <div className="planner-share-grid">
        <label className="planner-toggle-field">
          <span>Allow sharing</span>
          <input
            type="checkbox"
            checked={shareEnabled}
            onChange={(e) => {
              if (type === 'lesson') {
                updateLessonPlanField('shareEnabled', e.target.checked)
              } else {
                updateLabActivityField('shareEnabled', e.target.checked)
              }
            }}
          />
        </label>
        <label>
          <span>Share scope</span>
          <select
            value={shareScope}
            disabled={!shareEnabled}
            onChange={(e) => {
              const nextValue = e.target.value as ShareVisibility
              if (type === 'lesson') {
                updateLessonPlanField('shareScope', nextValue)
              } else {
                updateLabActivityField('shareScope', nextValue)
              }
            }}
          >
            <option value="private">Private</option>
            <option value="all users">All Users</option>
            <option value="users">Selected Users</option>
          </select>
        </label>
        {shareEnabled && shareScope === 'users' ? (
          <label className="planner-span-2">
            <span>Specific users</span>
            <input
              type="text"
              placeholder="Enter user names separated by commas"
              value={shareUsers}
              onChange={(e) => {
                if (type === 'lesson') {
                  updateLessonPlanField('shareUsers', e.target.value)
                } else {
                  updateLabActivityField('shareUsers', e.target.value)
                }
              }}
            />
          </label>
        ) : null}
      </div>
    </section>
  )

  const renderLessonSummary = () => (
    <div className="planner-layout">
      <section className="planner-main-column">
        <section className="role-card planner-card">
          <div className="planner-toolbar">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search lesson plans by title, course, module, grade, or status..."
                value={lessonSearchTerm}
                onChange={(e) => setLessonSearchTerm(e.target.value)}
              />
            </div>
            <div className="planner-summary-copy">
              <span>{`${filteredLessonPlans.length} lesson plans`}</span>
            </div>
          </div>

          {filteredLessonPlans.length ? (
            <div className="planner-summary-grid">
              {filteredLessonPlans.map((plan) => (
                <article
                  key={plan.id}
                  className={`planner-summary-card ${selectedPlan?.id === plan.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
              <div className="planner-summary-head">
                <div>
                  <h3>{plan.title}</h3>
                  <p className="role-muted">{`${plan.course} • ${plan.className || 'Class'}`}</p>
                </div>
                    <span className={`role-status-badge ${getStatusBadgeClass(plan.status)}`}>{plan.status}</span>
                  </div>
              <div className="planner-summary-meta">
                <span>{plan.className || 'Class N/A'}</span>
                <span>{plan.type}</span>
                <span>{plan.source}</span>
              </div>
                  <p className="planner-summary-text">{plan.description || 'No summary added yet.'}</p>
                  <div className="planner-card-actions">
                    <ActionIconButton icon={Eye} onClick={() => setSelectedPlan(plan)} ariaLabel={`View ${plan.title}`} />
                    <ActionIconButton icon={Pencil} onClick={() => openEditLessonPlanBuilder(plan)} ariaLabel={`Edit ${plan.title}`} />
                    <ActionIconButton icon={Copy} onClick={() => duplicateLessonPlan(plan)} ariaLabel={`Duplicate ${plan.title}`} />
                    <ActionIconButton icon={Printer} onClick={() => printLessonPlan(plan)} ariaLabel={`Print ${plan.title}`} />
                    <ActionIconButton icon={Download} onClick={() => downloadLessonPlan(plan)} ariaLabel={`Download ${plan.title}`} />
                    {canApprovePlan(plan) ? (
                      <ActionIconButton icon={CheckCircle} onClick={() => approveLessonPlan(plan.id)} ariaLabel={`Approve ${plan.title}`} />
                    ) : null}
                    <ActionIconButton icon={Trash2} onClick={() => deleteLessonPlan(plan.id)} ariaLabel={`Delete ${plan.title}`} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="planner-empty-state">
              <FlaskConical size={36} />
              <h3>No lesson plans yet</h3>
              <p className="role-muted">Start with a custom builder, bring in an external source, or generate a lesson with AI.</p>
              <button type="button" className="role-primary-btn" onClick={openNewLessonBuilder}>
                <Plus size={16} />
                Create Lesson Plan
              </button>
            </div>
          )}
        </section>
      </section>

      <aside className="planner-side-column">
        <section className="role-card planner-card planner-detail-card">
          <div className="planner-card-head">
            <div>
              <h3>Lesson Plan Details</h3>
              <p className="role-muted">Preview metadata, sharing, publishing info, and quick actions.</p>
            </div>
          </div>
          {selectedPlan ? (
            <div className="planner-detail-content">
              <div className="planner-detail-head">
                <div>
                  <h4>{selectedPlan.title}</h4>
                  <p className="role-muted">{`${selectedPlan.course} • ${selectedPlan.className || 'Class'}`}</p>
                </div>
                <span className={`role-status-badge ${getStatusBadgeClass(selectedPlan.status)}`}>{selectedPlan.status}</span>
              </div>
              <div className="planner-detail-grid">
                <p><strong>Author:</strong> {selectedPlan.author || teacherName}</p>
                <p><strong>Last saved:</strong> {formatPlannerDate(selectedPlan.updatedAt || selectedPlan.createdAt)}</p>
                <p><strong>Published:</strong> {formatPlannerDate(selectedPlan.publishedAt)}</p>
                <p><strong>Compliance Code:</strong> {selectedPlan.complianceCode || 'Not provided'}</p>
                <p><strong>Share:</strong> {selectedPlan.shareScope || 'Private'}</p>
                <p><strong>Assets:</strong> {selectedPlan.assets?.length || 0}</p>
              </div>
              <div className="planner-detail-block">
                <strong>Description</strong>
                <p>{selectedPlan.description || 'No description added.'}</p>
              </div>
              <div className="planner-detail-block">
                <strong>Objectives</strong>
                <p>{selectedPlan.objectives || 'No objectives added.'}</p>
              </div>
              <div className="planner-detail-block">
                <strong>Shared with</strong>
                <p>{selectedPlan.sharedWith?.length ? selectedPlan.sharedWith.join(', ') : 'This item is currently private.'}</p>
              </div>
              <div className="planner-inline-actions">
                <button type="button" className="role-secondary-btn" onClick={() => openEditLessonPlanBuilder(selectedPlan)}>Edit</button>
                <button type="button" className="role-secondary-btn" onClick={() => duplicateLessonPlan(selectedPlan)}>Duplicate</button>
                <button type="button" className="role-secondary-btn" onClick={() => printLessonPlan(selectedPlan)}>Print</button>
                <button type="button" className="role-secondary-btn" onClick={() => downloadLessonPlan(selectedPlan)}>Download</button>
                {canApprovePlan(selectedPlan) ? (
                  <button type="button" className="role-primary-btn" onClick={() => approveLessonPlan(selectedPlan.id)}>Approve</button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="planner-empty-side">
              <p className="role-muted">Select a lesson plan to review its metadata and actions.</p>
            </div>
          )}
        </section>
      </aside>
    </div>
  )

  const renderLessonBuilder = () => (
    <div className="planner-builder-stack">
      <section className="role-card planner-card">
        <div className="planner-card-head">
          <div>
            <h3>Basic Details</h3>
            <p className="role-muted">Capture course, class, and lesson metadata before building the content.</p>
          </div>
        </div>

        <div className="planner-mode-grid">
          {plannerModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`planner-mode-card ${lessonBuilderMode === mode ? 'is-active' : ''}`}
              onClick={() => {
                setLessonBuilderMode(mode)
                updateLessonPlanField('source', mode)
              }}
            >
              <div className="planner-mode-head">
                <span className="planner-mode-icon">{mode === 'Manual' ? <PenLine size={18} /> : mode === 'External' ? <FolderOpen size={18} /> : <CheckCircle size={18} />}</span>
                <strong>{mode === 'AI' ? 'AI Generated' : mode}</strong>
              </div>
              <span className="planner-mode-desc">{mode === 'Manual' ? 'Structured sections and custom inputs' : mode === 'External' ? 'Upload files or link external lesson sources' : 'Generate a draft and refine it inline'}</span>
            </button>
          ))}
        </div>

        <div className="planner-form-grid">
          <label>
            <span>Course</span>
            <select value={lessonPlanForm.course} onChange={(e) => updateLessonPlanField('course', e.target.value)}>
              <option value="">Select Course</option>
              {lessonCourseOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Class</span>
            <select value={lessonPlanForm.className} onChange={(e) => updateLessonPlanField('className', e.target.value)}>
              <option value="">Select Class</option>
              {classOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Type</span>
            <select value={lessonPlanForm.type} onChange={(e) => updateLessonPlanField('type', e.target.value as LessonPlan['type'])}>
              {lessonTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Compliance Code</span>
            <input type="text" value={lessonPlanForm.complianceCode} onChange={(e) => updateLessonPlanField('complianceCode', e.target.value)} placeholder="CBSE901A / 417" />
          </label>
          <label className="planner-span-2">
            <span>Topic</span>
            <input type="text" value={lessonPlanForm.title} onChange={(e) => updateLessonPlanField('title', e.target.value)} placeholder="Lesson title" />
          </label>
          <label className="planner-span-2">
            <span>Description</span>
            <textarea value={lessonPlanForm.description} onChange={(e) => updateLessonPlanField('description', e.target.value)} placeholder="Short lesson summary" rows={4} />
          </label>
          <label>
            <span>Status</span>
            <select value={lessonPlanForm.status} onChange={(e) => updateLessonPlanField('status', e.target.value as LessonPlanStatus)}>
              {lessonStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Schedule Date</span>
            <input type="date" value={lessonPlanForm.scheduleDate} onChange={(e) => updateLessonPlanField('scheduleDate', e.target.value)} />
          </label>
        </div>
      </section>

      {lessonBuilderMode === 'Manual' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head">
            <div>
              <h3>Upload Content</h3>
              <p className="role-muted">Upload lesson assets and decide how they should be shared.</p>
            </div>
          </div>
          <label className="planner-upload-zone">
            <Upload size={22} />
            <span>Drag and drop or select PDF, DOC, PPT, image, or worksheet files</span>
            <input type="file" multiple onChange={(e) => handleLessonAssetUpload(e.target.files)} />
          </label>
          {lessonPlanForm.assets.length ? (
            <div className="planner-asset-list">
              {lessonPlanForm.assets.map((asset) => (
                <div key={asset.id} className="planner-asset-row">
                  <div>
                    <strong>{asset.name}</strong>
                    <span>{asset.type || 'File'}</span>
                  </div>
                  <button type="button" className="role-secondary-btn" onClick={() => removeLessonAsset(asset.id)}>Remove</button>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {lessonBuilderMode === 'Manual' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head">
            <div>
              <h3>Lesson Plan Builder</h3>
              <p className="role-muted">Build the lesson content manually.</p>
            </div>
          </div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <span>Learning Objectives</span>
              <textarea value={lessonPlanForm.objectives} onChange={(e) => updateLessonPlanField('objectives', e.target.value)} rows={5} />
            </label>
            <label className="planner-span-2">
              <span>Materials Required</span>
              <textarea value={lessonPlanForm.materials} onChange={(e) => updateLessonPlanField('materials', e.target.value)} rows={5} />
            </label>
            <label className="planner-span-2">
              <span>Activities / Teaching Steps</span>
              <textarea value={lessonPlanForm.activities} onChange={(e) => updateLessonPlanField('activities', e.target.value)} rows={6} />
            </label>
            <label className="planner-span-2">
              <span>Assessment & Evaluation</span>
              <textarea value={lessonPlanForm.assessment} onChange={(e) => updateLessonPlanField('assessment', e.target.value)} rows={5} />
            </label>
          </div>
        </section>
      ) : null}

      {lessonBuilderMode === 'External' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head"><div><h3>External Source</h3><p className="role-muted">Upload lesson files or paste a source URL, then review the assets and sharing permissions.</p></div></div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <span>Lesson Plan URL</span>
              <input type="url" value={lessonPlanForm.externalUrl} onChange={(e) => updateLessonPlanField('externalUrl', e.target.value)} placeholder="https://example.com/lesson-plan" />
            </label>
          </div>
        </section>
      ) : null}

      {lessonBuilderMode === 'AI' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head planner-ai-header">
            <div>
              <h3>AI Lesson Generator</h3>
              <p className="role-muted">Generate structured content using AI.</p>
            </div>
          </div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <div className="planner-ai-prompt-head">
                <span>Prompt</span>
                <button
                  type="button"
                  className="planner-ai-assist-btn"
                  onClick={() => setShowLessonPromptSuggestions((prev) => !prev)}
                >
                  <Sparkles size={14} />
                  AI Assist
                </button>
              </div>
              <div className="planner-ai-prompt">
                <textarea
                  value={lessonPlanForm.aiPrompt}
                  onChange={(e) => updateLessonPlanField('aiPrompt', e.target.value)}
                  placeholder="Create a detailed lesson plan for Class 8 Science including objectives, activities, and assessment..."
                  rows={4}
                />
                {showLessonPromptSuggestions ? (
                  <div className="planner-ai-suggestions">
                    {lessonPromptSuggestions.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          updateLessonPlanField('aiPrompt', prompt)
                          setShowLessonPromptSuggestions(false)
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </label>
          </div>
          <button type="button" className="role-primary-btn planner-generate-btn" onClick={generateLessonPlanWithAI}>
            Generate Lesson Plan with AI
          </button>
          <div className="planner-ai-output">
            <label className="planner-span-2">
              <span>Output Preview</span>
              <textarea
                value={lessonPlanForm.aiDraft}
                onChange={(e) => updateLessonPlanField('aiDraft', e.target.value)}
                placeholder="Your AI-generated lesson draft will appear here. Edit it before saving."
                rows={10}
              />
            </label>
          </div>
        </section>
      ) : null}

      {renderShareSettings('lesson', lessonSharePromptVisible || lessonPlanForm.assets.length > 0, lessonPlanForm.shareEnabled, lessonPlanForm.shareScope, lessonPlanForm.shareUsers)}

      <section className="role-card planner-card planner-actions-card">
        <div className="planner-inline-actions planner-inline-actions-end">
          <button type="button" className="role-secondary-btn" onClick={cancelLessonBuilder}>Cancel</button>
          <button type="button" className="role-secondary-btn" onClick={() => saveLessonPlan(false)}>Save Draft</button>
          <button type="button" className="role-primary-btn" onClick={() => saveLessonPlan(true)}>Publish</button>
        </div>
      </section>
    </div>
  )

  const renderLabSummary = () => (
    <div className="planner-layout">
      <section className="planner-main-column">
        <section className="role-card planner-card">
          <div className="planner-toolbar">
            <div className="role-user-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search lab activities by title, course, class, grade, or status..."
                value={labSearchTerm}
                onChange={(e) => setLabSearchTerm(e.target.value)}
              />
            </div>
            <div className="planner-summary-copy">
              <span>{`${filteredLabActivities.length} lab activities`}</span>
            </div>
          </div>

          {filteredLabActivities.length ? (
            <div className="planner-summary-grid">
              {filteredLabActivities.map((activity) => (
                <article
                  key={activity.id}
                  className={`planner-summary-card ${selectedLabActivity?.id === activity.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedLabActivity(activity)}
                >
                  <div className="planner-summary-head">
                    <div>
                      <h3>{activity.title}</h3>
                      <p className="role-muted">{`${activity.course} • ${activity.grade || 'Class'}`}</p>
                    </div>
                    <span className={`role-status-badge ${getStatusBadgeClass(activity.status)}`}>{activity.status}</span>
                  </div>
                  <div className="planner-summary-meta">
                    <span>{activity.grade || 'Class N/A'}</span>
                    <span>{activity.type}</span>
                    <span>{activity.source}</span>
                  </div>
                  <p className="planner-summary-text">{activity.description || 'No summary added yet.'}</p>
                  <div className="planner-card-actions">
                    <ActionIconButton icon={Eye} onClick={() => setSelectedLabActivity(activity)} ariaLabel={`View ${activity.title}`} />
                    <ActionIconButton icon={Pencil} onClick={() => openEditLabActivityBuilder(activity)} ariaLabel={`Edit ${activity.title}`} />
                    <ActionIconButton icon={Copy} onClick={() => duplicateLabActivity(activity)} ariaLabel={`Duplicate ${activity.title}`} />
                    <ActionIconButton icon={Printer} onClick={() => printLabActivity(activity)} ariaLabel={`Print ${activity.title}`} />
                    <ActionIconButton icon={Download} onClick={() => downloadLabActivity(activity)} ariaLabel={`Download ${activity.title}`} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="planner-empty-state">
              <ClipboardList size={36} />
              <h3>No lab activities yet</h3>
              <p className="role-muted">Create a new lab activity inline and keep procedures, observations, and assets in one place.</p>
              <button type="button" className="role-primary-btn" onClick={openNewLabActivityBuilder}>
                <Plus size={16} />
                Create Lab Activity
              </button>
            </div>
          )}
        </section>
      </section>

      <aside className="planner-side-column">
        <section className="role-card planner-card planner-detail-card">
          <div className="planner-card-head">
            <div>
              <h3>Lab Activity Details</h3>
              <p className="role-muted">Review procedures, sharing status, and delivery metadata.</p>
            </div>
          </div>
          {selectedLabActivity ? (
            <div className="planner-detail-content">
              <div className="planner-detail-head">
                <div>
                  <h4>{selectedLabActivity.title}</h4>
                  <p className="role-muted">{`${selectedLabActivity.course} • ${selectedLabActivity.grade || 'Class'}`}</p>
                </div>
                <span className={`role-status-badge ${getStatusBadgeClass(selectedLabActivity.status)}`}>{selectedLabActivity.status}</span>
              </div>
              <div className="planner-detail-grid">
                <p><strong>Author:</strong> {selectedLabActivity.author || teacherName}</p>
                <p><strong>Last saved:</strong> {formatPlannerDate(selectedLabActivity.updatedAt || selectedLabActivity.createdAt)}</p>
                <p><strong>Published:</strong> {formatPlannerDate(selectedLabActivity.publishedAt)}</p>
                <p><strong>Compliance Code:</strong> {selectedLabActivity.complianceCode || 'Not provided'}</p>
                <p><strong>Share:</strong> {selectedLabActivity.shareScope || 'Private'}</p>
                <p><strong>Assets:</strong> {selectedLabActivity.assets?.length || 0}</p>
              </div>
              <div className="planner-detail-block">
                <strong>Objective</strong>
                <p>{selectedLabActivity.objective || 'No objective added.'}</p>
              </div>
              <div className="planner-detail-block">
                <strong>Procedure</strong>
                <p>{selectedLabActivity.procedureSteps.length ? selectedLabActivity.procedureSteps.join(', ') : 'No procedure added.'}</p>
              </div>
              <div className="planner-inline-actions">
                <button type="button" className="role-secondary-btn" onClick={() => openEditLabActivityBuilder(selectedLabActivity)}>Edit</button>
                <button type="button" className="role-secondary-btn" onClick={() => duplicateLabActivity(selectedLabActivity)}>Duplicate</button>
                <button type="button" className="role-secondary-btn" onClick={() => printLabActivity(selectedLabActivity)}>Print</button>
                <button type="button" className="role-secondary-btn" onClick={() => downloadLabActivity(selectedLabActivity)}>Download</button>
              </div>
            </div>
          ) : (
            <div className="planner-empty-side">
              <p className="role-muted">Select a lab activity to review its details.</p>
            </div>
          )}
        </section>
      </aside>
    </div>
  )

  const renderLabBuilder = () => (
    <div className="planner-builder-stack">
      <section className="role-card planner-card">
        <div className="planner-card-head">
          <div>
            <h3>Lab Activity Designer</h3>
            <p className="role-muted">Use the same inline builder experience for lab design with custom, external, or AI-assisted workflows.</p>
          </div>
        </div>

        <div className="planner-mode-grid">
          {plannerModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`planner-mode-card ${labBuilderMode === mode ? 'is-active' : ''}`}
              onClick={() => {
                setLabBuilderMode(mode)
                updateLabActivityField('source', mode)
              }}
            >
              <div className="planner-mode-head">
                <span className="planner-mode-icon">{mode === 'Manual' ? <PenLine size={18} /> : mode === 'External' ? <FolderOpen size={18} /> : <CheckCircle size={18} />}</span>
                <strong>{mode === 'AI' ? 'AI Generated' : mode}</strong>
              </div>
              <span className="planner-mode-desc">{mode === 'Manual' ? 'Build the experiment manually' : mode === 'External' ? 'Bring in links, files, and references' : 'Generate a scaffold for the lab flow'}</span>
            </button>
          ))}
        </div>

        <div className="planner-form-grid">
          <label>
            <span>Course</span>
            <select value={labActivityForm.course} onChange={(e) => updateLabActivityField('course', e.target.value)}>
              <option value="">Select Course</option>
              {lessonCourseOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Class</span>
            <select value={labActivityForm.grade} onChange={(e) => updateLabActivityField('grade', e.target.value)}>
              <option value="">Select Class</option>
              {classOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Type</span>
            <select value={labActivityForm.type} onChange={(e) => updateLabActivityField('type', e.target.value as LabActivity['type'])}>
              {labTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Compliance Code</span>
            <input type="text" value={labActivityForm.complianceCode} onChange={(e) => updateLabActivityField('complianceCode', e.target.value)} placeholder="LAB417 / SCI901A" />
          </label>
          <label className="planner-span-2">
            <span>Activity Name</span>
            <input type="text" value={labActivityForm.title} onChange={(e) => updateLabActivityField('title', e.target.value)} placeholder="Activity name" />
          </label>
          <label className="planner-span-2">
            <span>Description</span>
            <textarea value={labActivityForm.description} onChange={(e) => updateLabActivityField('description', e.target.value)} placeholder="Short lab summary" rows={4} />
          </label>
          <label>
            <span>Status</span>
            <select value={labActivityForm.status} onChange={(e) => updateLabActivityField('status', e.target.value as LessonPlanStatus)}>
              {lessonStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Schedule Date</span>
            <input type="date" value={labActivityForm.scheduleDate} onChange={(e) => updateLabActivityField('scheduleDate', e.target.value)} />
          </label>
        </div>
      </section>

      {labBuilderMode === 'External' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head"><div><h3>External Source</h3><p className="role-muted">Reference a shared document or URL for the lab activity.</p></div></div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <span>Lab Activity URL</span>
              <input type="url" value={labActivityForm.externalUrl} onChange={(e) => updateLabActivityField('externalUrl', e.target.value)} placeholder="https://example.com/lab-activity" />
            </label>
          </div>
        </section>
      ) : null}

      {labBuilderMode === 'AI' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head planner-ai-header">
            <div>
              <h3>AI Lab Generator</h3>
              <p className="role-muted">Generate structured content using AI.</p>
            </div>
          </div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <div className="planner-ai-prompt-head">
                <span>Prompt</span>
                <button
                  type="button"
                  className="planner-ai-assist-btn"
                  onClick={() => setShowLabPromptSuggestions((prev) => !prev)}
                >
                  <Sparkles size={14} />
                  AI Assist
                </button>
              </div>
              <div className="planner-ai-prompt">
                <textarea
                  value={labActivityForm.aiPrompt}
                  onChange={(e) => updateLabActivityField('aiPrompt', e.target.value)}
                  placeholder="Create a detailed lab activity for Class 8 Science including objectives, materials, procedure, and observations..."
                  rows={4}
                />
                {showLabPromptSuggestions ? (
                  <div className="planner-ai-suggestions">
                    {labPromptSuggestions.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          updateLabActivityField('aiPrompt', prompt)
                          setShowLabPromptSuggestions(false)
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </label>
          </div>
          <button type="button" className="role-primary-btn planner-generate-btn" onClick={generateLabActivityWithAI}>
            Generate Lab Activity with AI
          </button>
          <div className="planner-ai-output">
            <label className="planner-span-2">
              <span>Output Preview</span>
              <textarea
                value={labActivityForm.aiDraft}
                onChange={(e) => updateLabActivityField('aiDraft', e.target.value)}
                placeholder="Your AI-generated lab draft will appear here. Edit it before saving."
                rows={10}
              />
            </label>
          </div>
        </section>
      ) : null}

      {labBuilderMode === 'Manual' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head">
            <div>
              <h3>Upload Content</h3>
              <p className="role-muted">Upload lab manuals, worksheets, images, or safety references.</p>
            </div>
          </div>
          <label className="planner-upload-zone">
            <Upload size={22} />
            <span>Drag and drop or select support files for the lab activity</span>
            <input type="file" multiple onChange={(e) => handleLabAssetUpload(e.target.files)} />
          </label>
          {labActivityForm.assets.length ? (
            <div className="planner-asset-list">
              {labActivityForm.assets.map((asset) => (
                <div key={asset.id} className="planner-asset-row">
                  <div>
                    <strong>{asset.name}</strong>
                    <span>{asset.type || 'File'}</span>
                  </div>
                  <button type="button" className="role-secondary-btn" onClick={() => removeLabAsset(asset.id)}>Remove</button>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {labBuilderMode === 'Manual' ? (
        <section className="role-card planner-card">
          <div className="planner-card-head"><div><h3>Lab Content</h3></div></div>
          <div className="planner-form-grid">
            <label className="planner-span-2">
              <span>Objective</span>
              <textarea value={labActivityForm.objective} onChange={(e) => updateLabActivityField('objective', e.target.value)} rows={4} />
            </label>
            <label className="planner-span-2">
              <span>Required Materials</span>
              <textarea value={labActivityForm.materials} onChange={(e) => updateLabActivityField('materials', e.target.value)} rows={4} />
            </label>
            <div className="planner-span-2">
              <span className="planner-field-label">Procedure Steps</span>
              <div className="planner-steps-list">
                {labActivityForm.procedureSteps.map((step, index) => (
                  <div key={`${index}-${step}`} className="planner-step-row">
                    <span className="planner-step-number">{index + 1}</span>
                    <textarea value={step} onChange={(e) => updateLabProcedureStep(index, e.target.value)} rows={3} placeholder={`Describe step ${index + 1}`} />
                    <button type="button" className="role-secondary-btn" onClick={() => removeLabProcedureStep(index)}>Remove</button>
                  </div>
                ))}
              </div>
              <button type="button" className="role-secondary-btn planner-add-step-btn" onClick={addLabProcedureStep}>
                <Plus size={16} />
                Add Step
              </button>
            </div>
            <label className="planner-span-2">
              <span>Observations</span>
              <textarea value={labActivityForm.observations} onChange={(e) => updateLabActivityField('observations', e.target.value)} rows={4} />
            </label>
            <label className="planner-span-2">
              <span>Result / Conclusion</span>
              <textarea value={labActivityForm.result} onChange={(e) => updateLabActivityField('result', e.target.value)} rows={4} />
            </label>
          </div>
        </section>
      ) : null}

      {renderShareSettings('lab', labSharePromptVisible || labActivityForm.assets.length > 0, labActivityForm.shareEnabled, labActivityForm.shareScope, labActivityForm.shareUsers)}

      <section className="role-card planner-card planner-actions-card">
        <div className="planner-inline-actions planner-inline-actions-end">
          <button type="button" className="role-secondary-btn" onClick={cancelLabActivityBuilder}>Cancel</button>
          <button type="button" className="role-secondary-btn" onClick={() => saveLabActivity(false)}>Save Draft</button>
          <button type="button" className="role-primary-btn" onClick={() => saveLabActivity(true)}>Publish</button>
        </div>
      </section>
    </div>
  )

  const renderLessonPlanningWorkspace = () => (
    <main className="role-main role-main-detail planner-page">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head planner-page-head">
          <div className="planner-header-title">
            {plannerView === 'builder' ? (
              <span
                className="planner-back-icon"
                role="button"
                tabIndex={0}
                onClick={handlePlannerBack}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handlePlannerBack()
                  }
                }}
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </span>
            ) : null}
            <h2>{plannerTab === 'lesson' ? 'Lesson Planning' : 'Lab Activities'}</h2>
            <p className="role-muted">
              {plannerTab === 'lesson'
                ? 'Create, duplicate, print, approve, download, and share lesson plans without leaving the teacher dashboard.'
                : 'Design lab experiences inline with the same builder workflow and sharing controls.'}
            </p>
          </div>
          {plannerView === 'summary' ? (
            <button
              type="button"
              className="role-primary-btn"
              onClick={plannerTab === 'lesson' ? openNewLessonBuilder : openNewLabActivityBuilder}
            >
              <Plus size={16} />
              {plannerTab === 'lesson' ? 'Create Lesson Plan' : 'Create Lab Activity'}
            </button>
          ) : null}
        </section>

        <section className="role-card planner-card planner-tab-shell">
          <div className="planner-role-tabs">
            <button type="button" className={plannerTab === 'lesson' ? 'is-active' : ''} onClick={() => { setPlannerTab('lesson'); setPlannerView('summary') }}>
              Lesson Planning
            </button>
            <button type="button" className={plannerTab === 'lab' ? 'is-active' : ''} onClick={() => { setPlannerTab('lab'); setPlannerView('summary') }}>
              Lab Activities
            </button>
          </div>
          {plannerTab === 'lesson'
            ? plannerView === 'summary'
              ? renderLessonSummary()
              : renderLessonBuilder()
            : plannerView === 'summary'
              ? renderLabSummary()
              : renderLabBuilder()}
        </section>
      </section>
    </main>
  )

  const renderCards = (
    title: string,
    description: string,
    items: Array<{ id: number; title: string; meta: string; submeta?: string; badge?: string; action?: string; href?: string; image?: string }>,
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
                {item.image ? <img src={item.image} alt={item.title} className="resource-card-image" /> : null}
                <div className="role-mini-card-head">
                  <h3>{item.title}</h3>
                  {item.badge ? <span className="role-status-badge status-active">{item.badge}</span> : null}
                </div>
                <p className="role-muted">{item.meta}</p>
                {item.submeta ? <p className="role-muted">{item.submeta}</p> : null}
                {item.action ? (
                  <button
                    type="button"
                    className="role-inline-action"
                    onClick={() => {
                      if (item.href) {
                        window.open(item.href, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
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
            <p className="role-muted">Create and manage student assignments with custom, external, or AI-assisted workflows</p>
          </div>
          <button type="button" className="role-primary-btn" onClick={openNewAssignmentBuilder}>
            <Plus size={16} />
            Create Assignment
          </button>
        </section>

        {!isAssignmentBuilderOpen ? (
          <div className="planner-layout">
            <section className="planner-main-column">
              <section className="role-card planner-card">
                <div className="planner-toolbar">
                  <div className="role-user-search-wrap">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search assignments by assignment name, class, section, type, due date, or subject..."
                      value={assignmentSearchTerm}
                      onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="role-table-wrap">
                  <table className="role-table">
                    <thead>
                      <tr>
                        <th>Assignment Name</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Assignment Type</th>
                        <th>Assignment Due</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((item) => (
                        <tr key={item.id}>
                          <td>{item.assignmentName}</td>
                          <td>{item.className}</td>
                          <td>{item.section}</td>
                          <td>{item.assignmentType}</td>
                          <td>{item.assignmentDue}</td>
                          <td>{item.subject}</td>
                          <td>{item.date}</td>
                          <td>
                            <div className="lesson-action-row">
                              <ActionIconButton icon={Eye} onClick={() => setSelectedAssignment(item)} ariaLabel={`View ${item.assignmentName}`} />
                              <ActionIconButton icon={Pencil} onClick={() => openEditAssignmentBuilder(item)} ariaLabel={`Edit ${item.assignmentName}`} />
                              <ActionIconButton
                                icon={Copy}
                                onClick={() => {
                                  const duplicated = { ...item, id: Date.now(), assignmentName: `${item.assignmentName} (Copy)`, status: 'Draft' as const }
                                  setAssignmentRecords((prev) => [duplicated, ...prev])
                                  setSelectedAssignment(duplicated)
                                }}
                                ariaLabel={`Duplicate ${item.assignmentName}`}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAssignments.length === 0 ? <p className="role-muted">No assignments match your search.</p> : null}
                </div>
              </section>
            </section>

            <aside className="planner-side-column">
              <section className="role-card planner-card planner-detail-card">
                <div className="planner-card-head">
                  <div>
                    <h3>Assignment Details</h3>
                    <p className="role-muted">Review selected assignment information before editing or publishing changes.</p>
                  </div>
                </div>
                {selectedAssignment ? (
                  <div className="planner-detail-content">
                    <div className="planner-detail-head">
                      <div>
                        <h4>{selectedAssignment.assignmentName}</h4>
                        <p className="role-muted">{`${selectedAssignment.subject} • ${selectedAssignment.className} ${selectedAssignment.section}`}</p>
                      </div>
                      <span className={`role-status-badge ${getStatusBadgeClass(selectedAssignment.status)}`}>{selectedAssignment.status}</span>
                    </div>
                    <div className="planner-detail-grid">
                      <p><strong>Type:</strong> {selectedAssignment.assignmentType}</p>
                      <p><strong>Mode:</strong> {selectedAssignment.assignmentMode}</p>
                      <p><strong>Due:</strong> {selectedAssignment.assignmentDue}</p>
                      <p><strong>Source:</strong> {selectedAssignment.source}</p>
                      <p><strong>Date:</strong> {selectedAssignment.date}</p>
                    </div>
                    <div className="planner-detail-block">
                      <strong>Description</strong>
                      <p>{selectedAssignment.description || 'No description added yet.'}</p>
                    </div>
                    <div className="planner-detail-block">
                      <strong>Instructions</strong>
                      <p>{selectedAssignment.instructions || 'No instructions added yet.'}</p>
                    </div>
                    <div className="planner-inline-actions">
                      <button type="button" className="role-secondary-btn" onClick={() => openEditAssignmentBuilder(selectedAssignment)}>Edit</button>
                    </div>
                  </div>
                ) : (
                  <p className="role-muted">Select an assignment to review the details.</p>
                )}
              </section>
            </aside>
          </div>
        ) : (
          <div className="planner-builder-stack">
            <section className="role-card planner-card">
              <div className="planner-card-head">
                <div>
                  <h3>Assignment Builder</h3>
                  <p className="role-muted">Choose how you want to create the assignment and fill in the full assignment details.</p>
                </div>
              </div>

              <div className="planner-mode-grid">
                {(['Manual', 'External', 'AI'] as LessonPlanSource[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`planner-mode-card ${assignmentBuilderMode === mode ? 'is-active' : ''}`}
                    onClick={() => {
                      setAssignmentBuilderMode(mode)
                      updateAssignmentField('source', mode)
                    }}
                  >
                    <div className="planner-mode-head">
                      <span className="planner-mode-icon">{mode === 'Manual' ? <PenLine size={18} /> : mode === 'External' ? <FolderOpen size={18} /> : <CheckCircle size={18} />}</span>
                      <strong>{mode === 'AI' ? 'AI Generated' : mode}</strong>
                    </div>
                    <span className="planner-mode-desc">{mode === 'Manual' ? 'Create the assignment manually' : mode === 'External' ? 'Use a file or source link' : 'Generate assignment instructions with AI'}</span>
                  </button>
                ))}
              </div>

              <div className="planner-form-grid">
                <label>
                  <span>Assignment Name</span>
                  <input type="text" value={assignmentForm.assignmentName} onChange={(e) => updateAssignmentField('assignmentName', e.target.value)} />
                </label>
                <label>
                  <span>Subject</span>
                  <input type="text" value={assignmentForm.subject} onChange={(e) => updateAssignmentField('subject', e.target.value)} />
                </label>
                <label>
                  <span>Class</span>
                  <select value={assignmentForm.className} onChange={(e) => updateAssignmentField('className', e.target.value)}>
                    <option value="">Select Class</option>
                    {assignmentClassOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <span>Section</span>
                  <select value={assignmentForm.section} onChange={(e) => updateAssignmentField('section', e.target.value)}>
                    <option value="">Select Section</option>
                    {assignmentSectionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <span>Assignment Mode</span>
                  <select value={assignmentForm.assignmentMode} onChange={(e) => updateAssignmentField('assignmentMode', e.target.value as AssignmentMode)}>
                    {assignmentModeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <span>Assignment Type</span>
                  <select value={assignmentForm.assignmentType} onChange={(e) => updateAssignmentField('assignmentType', e.target.value as AssignmentType)}>
                    {assignmentTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select value={assignmentForm.status} onChange={(e) => updateAssignmentField('status', e.target.value as LessonPlanStatus)}>
                    {lessonStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label>
                  <span>Assignment Due</span>
                  <input type="date" value={assignmentForm.assignmentDue} onChange={(e) => updateAssignmentField('assignmentDue', e.target.value)} />
                </label>
                <label>
                  <span>Date</span>
                  <input type="date" value={assignmentForm.date} onChange={(e) => updateAssignmentField('date', e.target.value)} />
                </label>
                <label className="planner-span-2">
                  <span>Description</span>
                  <textarea rows={4} value={assignmentForm.description} onChange={(e) => updateAssignmentField('description', e.target.value)} />
                </label>
              </div>
            </section>

            {assignmentBuilderMode === 'External' ? (
              <section className="role-card planner-card">
                <div className="planner-card-head"><div><h3>External Source</h3></div></div>
                <div className="planner-form-grid">
                  <label className="planner-span-2">
                    <span>Assignment Source URL</span>
                    <input type="url" value={assignmentForm.externalUrl} onChange={(e) => updateAssignmentField('externalUrl', e.target.value)} />
                  </label>
                </div>
              </section>
            ) : null}

            {assignmentBuilderMode === 'AI' ? (
              <section className="role-card planner-card">
                <div className="planner-card-head"><div><h3>AI Assistant</h3></div></div>
                <div className="planner-form-grid">
                  <label className="planner-span-2">
                    <span>AI Prompt</span>
                    <textarea rows={4} value={assignmentForm.aiPrompt} onChange={(e) => updateAssignmentField('aiPrompt', e.target.value)} />
                  </label>
                </div>
                <button type="button" className="role-primary-btn planner-generate-btn" onClick={generateAssignmentWithAI}>
                  Generate Assignment with AI
                </button>
              </section>
            ) : null}

            <section className="role-card planner-card">
              <div className="planner-card-head"><div><h3>Assignment Content</h3></div></div>
              <div className="planner-form-grid">
                <label className="planner-span-2">
                  <span>Instructions</span>
                  <textarea rows={5} value={assignmentForm.instructions} onChange={(e) => updateAssignmentField('instructions', e.target.value)} />
                </label>
                <label className="planner-span-2">
                  <span>Rubric / Evaluation</span>
                  <textarea rows={5} value={assignmentForm.rubric} onChange={(e) => updateAssignmentField('rubric', e.target.value)} />
                </label>
              </div>
            </section>

            {assignmentBuilderMode === 'Manual' ? (
              <section className="role-card planner-card">
                <div className="planner-card-head"><div><h3>Upload Content</h3></div></div>
                <label className="planner-upload-zone">
                  <Upload size={22} />
                  <span>Upload assignment files and support material</span>
                  <input type="file" multiple onChange={(e) => handleAssignmentAssetUpload(e.target.files)} />
                </label>
                {assignmentForm.assets.length ? (
                  <div className="planner-asset-list">
                    {assignmentForm.assets.map((asset) => (
                      <div key={asset.id} className="planner-asset-row">
                        <div>
                          <strong>{asset.name}</strong>
                          <span>{asset.type || 'File'}</span>
                        </div>
                        <button type="button" className="role-secondary-btn" onClick={() => removeAssignmentAsset(asset.id)}>Remove</button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            <section className="role-card planner-card planner-actions-card">
              <div className="planner-inline-actions planner-inline-actions-end">
                <button type="button" className="role-secondary-btn" onClick={closeAssignmentBuilder}>Cancel</button>
                <button type="button" className="role-secondary-btn" onClick={() => saveAssignment(false)}>Save Draft</button>
                <button type="button" className="role-primary-btn" onClick={() => saveAssignment(true)}>Publish</button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  )

  const renderGrades = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        {!isGradeEvaluatorOpen ? (
          <section className="role-card role-detail-card">
            <div className="role-section-head">
              <div>
                <h2>Grades</h2>
                <p className="role-muted">Find submitted assignments class-wise and section-wise, then review and grade them quickly</p>
              </div>
            </div>
            <div className="role-user-toolbar">
              <div className="role-user-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by student, assignment, subject, class, section, or status..."
                  value={gradeSearchTerm}
                  onChange={(e) => setGradeSearchTerm(e.target.value)}
                />
              </div>
              <select value={gradeClassFilter} onChange={(e) => setGradeClassFilter(e.target.value)}>
                <option value="All Classes">All Classes</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
              <select value={gradeSectionFilter} onChange={(e) => setGradeSectionFilter(e.target.value)}>
                <option value="All Sections">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            <div className="role-table-wrap">
              <table className="role-table teacher-grade-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Assignment</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGradeRows.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <span className="teacher-student-avatar teacher-grade-avatar">
                          {gradeStudentProfiles.find((item) => item.name === student.studentName)?.initials ?? getInitials(student.studentName)}
                        </span>
                      </td>
                      <td>{student.studentName}</td>
                      <td>{student.className}</td>
                      <td>{student.section}</td>
                      <td>{student.assignmentName}</td>
                      <td>{student.assignmentType}</td>
                      <td>{student.subject}</td>
                      <td>{student.submittedOn}</td>
                      <td>
                        <span className={`teacher-grade-status-text ${student.status === 'Reviewed' ? 'is-reviewed' : 'is-submitted'}`}>{student.status}</span>
                      </td>
                      <td>
                        <span className={`teacher-grade-score-text ${student.score === 'Pending' ? 'is-pending' : 'is-scored'}`}>{student.score}</span>
                      </td>
                      <td>
                        <button type="button" className="role-secondary-btn teacher-detail-btn" onClick={() => openGradeEvaluator(student)}>
                          Grade Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredGradeRows.length === 0 ? <p className="role-muted">No submitted assignments match your selected class, section, or search.</p> : null}
            </div>
          </section>
        ) : (
          <div className="planner-builder-stack">
            <section className="role-card planner-card">
              <div className="planner-card-head">
                <div>
                  <h3>Grade Evaluation</h3>
                  <p className="role-muted">Evaluate the selected student with manual grading or AI-assisted grading.</p>
                </div>
              </div>
              <div className="planner-form-grid">
                <label className="planner-span-2">
                  <span>Select Grading Method</span>
                  <div className="planner-mode-grid">
                    <button type="button" className={`planner-mode-card ${gradeMethod === 'manual' ? 'is-active' : ''}`} onClick={() => setGradeMethod('manual')}>
                      <div className="planner-mode-head">
                        <span className="planner-mode-icon"><Pencil size={18} /></span>
                        <strong>Manual Grading</strong>
                      </div>
                      <span className="planner-mode-desc">Enter marks and optional feedback manually.</span>
                    </button>
                    <button type="button" className={`planner-mode-card ${gradeMethod === 'ai' ? 'is-active' : ''}`} onClick={() => setGradeMethod('ai')}>
                      <div className="planner-mode-head">
                        <span className="planner-mode-icon"><CheckCircle size={18} /></span>
                        <strong>AI Grading</strong>
                      </div>
                      <span className="planner-mode-desc">Generate marks and feedback, then review before upload.</span>
                    </button>
                  </div>
                </label>
              </div>
            </section>

            <section className="role-card planner-card">
              <div className="planner-card-head">
                <div>
                  <h3>Student Details</h3>
                </div>
              </div>
              <div className="teacher-grade-submission-head">
                <div className="teacher-grade-submission-user">
                  {selectedSubmission ? (
                    <img
                      src={createProfileAvatar(selectedSubmission.studentName)}
                      alt={selectedSubmission.studentName}
                      className="teacher-student-avatar-image"
                    />
                  ) : null}
                  <div>
                    <strong>{selectedSubmission?.studentName || ''}</strong>
                    <span>{selectedSubmission ? `${selectedSubmission.className}${selectedSubmission.section}` : ''}</span>
                  </div>
                </div>
                <span className={`teacher-grade-card-status ${selectedSubmission?.status === 'Reviewed' || gradeEvaluation.score.trim() ? 'is-graded' : 'is-pending'}`}>
                  {selectedSubmission?.status === 'Reviewed' || gradeEvaluation.score.trim() ? 'Graded' : 'Not Graded'}
                </span>
              </div>
              <div className="planner-detail-grid">
                <p><strong>Assignment Title:</strong> {selectedSubmission?.assignmentName || ''}</p>
                <p><strong>Submission Date:</strong> {selectedSubmission?.submittedOn || ''}</p>
              </div>
            </section>

            <section className="role-card planner-card">
              <div className="planner-card-head">
                <div>
                  <h3>Submission Preview</h3>
                </div>
              </div>
              <div className="teacher-grade-submission-preview">
                <p><strong>Submission Text:</strong> {selectedSubmission?.submissionText || ''}</p>
                <p><strong>Submission File:</strong> {selectedSubmission?.submissionFile || ''}</p>
              </div>
            </section>

            <section className="role-card planner-card">
              <div className="planner-card-head">
                <div>
                  <h3>Grading</h3>
                </div>
              </div>
              <div className="planner-form-grid">
                {gradeMethod === 'ai' ? (
                  <div className="planner-span-2">
                    <button type="button" className="role-primary-btn" onClick={evaluateSelectedSubmissionWithAI}>
                      Evaluate with AI
                    </button>
                  </div>
                ) : null}
                <label>
                  <span>Marks</span>
                  <input
                    type="number"
                    value={gradeEvaluation.score}
                    onChange={(e) => updateGradeEvaluationField('score', e.target.value)}
                    placeholder="Enter marks"
                  />
                </label>
                <label className="planner-span-2">
                  <span>Feedback</span>
                  <textarea
                    rows={4}
                    value={gradeEvaluation.comment}
                    onChange={(e) => updateGradeEvaluationField('comment', e.target.value)}
                    placeholder="Add optional feedback"
                  />
                </label>
              </div>
            </section>

            <section className="role-card planner-card planner-actions-card">
              <div className="planner-inline-actions planner-inline-actions-end">
                <button type="button" className="role-secondary-btn" onClick={() => setIsGradeEvaluatorOpen(false)}>Back</button>
                <button type="button" className="role-secondary-btn" onClick={saveGradeEvaluation}>Save</button>
                <button type="button" className="role-primary-btn" onClick={uploadGradeEvaluation} disabled={!gradeEvaluation.score.trim()}>
                  Upload
                </button>
              </div>
            </section>
          </div>
        )}
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

  const renderCommunications = () => <CommunicationsHub role="teacher" />

  let content = renderHome()

  if (activeTab === 'Lesson Planning') {
    content = renderLessonPlanningWorkspace()
  } else if (activeTab === 'Assignments') {
    content = renderAssignments()
  } else if (activeTab === 'Grades') {
    content = renderGrades()
  } else if (activeTab === 'Communications') {
    content = renderCommunications()
  } else if (activeTab === 'Content Library') {
    content = renderContentUpload()
  } else if (activeTab === 'Reports') {
    content = renderReports()
  } else if (activeTab === 'Resources') {
    content = renderCards(
      'Resources',
      'Browse student-friendly external resources to explore, create, and learn.',
      filteredResources.map((item) => ({
        id: item.id,
        title: item.title,
        meta: item.type,
        submeta: item.audience,
        action: 'Open Resource',
        href: item.url,
        image: item.image,
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
            <button type="button" className="role-icon-btn" aria-label="Settings" onClick={() => setIsSettingsOpen(true)}>
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
        onPrev={goToPreviousMessage}
        onNext={goToNextMessage}
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
              title="Teacher Profile"
              subtitle="Review and update your teacher details."
              profile={teacherProfile}
              onSave={saveTeacherProfile}
            />
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default TeacherDashboard
