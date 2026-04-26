import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  Eye,
  Home,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  FolderOpen,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import AddQualificationModal from '../../components/admin/AddQualificationModal'
import AssignTeacherModal from '../../components/admin/AssignTeacherModal'
import TeacherCard from '../../components/admin/TeacherCard'
import TeacherProfilePage from '../../components/admin/TeacherProfile'
import StudentProfilePage from '../../components/admin/StudentProfilePage'
import RolePermissionsPage from '../../components/admin/RolePermissionsPage'
import ThemeGrid from '../../components/admin/ThemeGrid'
import ThemePreview from '../../components/admin/ThemePreview'
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
import ProfileDrawer from '../../components/dashboard/ProfileDrawer'
import ProfileSettingsPanel, { type ProfileSettingsData } from '../../components/dashboard/ProfileSettingsPanel'
import RoleCalendar from '../../components/dashboard/RoleCalendar'
import SchoolSettingsForm, { type SchoolSettingsData } from '../../components/dashboard/SchoolSettingsForm'
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
import {
  createEmptyAssignTeacherForm,
  createEmptyTeacherForm,
  createEmptyTeacherQualificationForm,
  getTeacherFullName,
  mergeTeacherAssignments,
  normalizeTeacherProfile,
  normalizeTeacherClassGroups,
  type AssignTeacherFormValues,
  type ParentRelation,
  type TeacherAssignment,
  type TeacherQualification,
  type TeacherQualificationFormValues,
  type TeacherFormValues,
  type TeacherProfile,
  type TeacherRole,
} from '../../components/admin/teacherTypes'
import {
  createEmptyGuardian,
  createEmptyStudentForm,
  getStudentFullName,
  normalizeStudentProfile,
  type StudentFormValues,
  type GuardianContact,
  type StudentProfile,
} from '../../components/admin/studentTypes'
import {
  createDefaultRolePermissionsState,
  type PermissionAction,
  type PermissionRole,
  type RolePermissionsState,
  type RolePermissionRoleMeta,
} from '../../components/admin/rolePermissionsTypes'
import { useTheme } from '../../components/admin/useTheme'
import '../role-dashboard.css'

type Role = 'student' | 'teacher' | 'admin' | 'parent'
type UserStatus = 'active' | 'inactive'
type ViewMode = 'dashboard' | 'userManagement'
type SystemSettingsView = 'grid' | 'schoolSettings' | 'systemConfig' | 'themes' | 'rolePermissions'

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
  { label: 'Users', icon: Users },
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

const systemSettingsCards: Array<{
  key: SystemSettingsView
  title: string
  desc: string
  icon: typeof Settings
}> = [
  {
    key: 'schoolSettings',
    title: 'School Settings',
    desc: 'Manage school details, contact info, and branding',
    icon: BookOpen,
  },
  {
    key: 'systemConfig',
    title: 'System Configuration',
    desc: 'Configure system-level settings and integrations',
    icon: Settings,
  },
  {
    key: 'themes',
    title: 'Themes',
    desc: 'Customize dashboard themes and visual preferences',
    icon: BarChart3,
  },
  {
    key: 'rolePermissions',
    title: 'Role Permissions',
    desc: 'Manage role access, permissions, and controls',
    icon: Users,
  },
]

const ADMIN_TEACHERS_KEY = 'skaimitra_admin_teachers'
const ADMIN_STUDENTS_KEY = 'skaimitra_admin_students'
const ADMIN_ROLE_PERMISSIONS_KEY = 'skaimitra_admin_role_permissions'
const ADMIN_THEME_PREFERENCE_KEY = 'skaimitra_admin_theme_preference'
const teacherSubjectOptions = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Science',
  'Computer Science',
  'Sanskrit',
  'Physical Education',
  'Art & Craft',
]
const teacherSectionOptions = ['A', 'B', 'C']
const defaultTeacherRecords: TeacherProfile[] = [
  {
    id: 1,
    username: 'rajesh.kumar',
    email: 'rajesh@school.edu',
    password: 'Teacher@123',
    employeeId: 'EMP-001',
    linkedInProfile: 'https://www.linkedin.com/in/rajesh-kumar',
    firstName: 'Dr. Rajesh',
    middleName: '',
    lastName: 'Kumar',
    address: '12 Knowledge Park Road',
    city: 'Hyderabad',
    pincode: '500084',
    state: 'Telangana',
    country: 'India',
    profilePhoto: '',
    contactPerson: 'self',
    phone: '+91 98765 43211',
    homePhone: '+91 040 4000 4201',
    whatsAppPhone: '+91 98765 43211',
    gender: 'Male',
    roles: ['teacher'],
    children: [],
    parentRelationships: [],
    subjectSpecializations: ['Mathematics', 'Computer Science'],
    joiningDate: '2021-06-10',
    priorExperience: '8',
    relievingDate: '',
    assignments: [
      {
        id: 'rajesh-assignment-1',
        subject: 'Mathematics',
        classes: [{ className: 'Class 6', sections: ['A', 'B'] }],
      },
    ],
    qualifications: [],
  },
  {
    id: 2,
    username: 'priya.patel',
    email: 'priya@school.edu',
    password: 'Teacher@123',
    employeeId: 'EMP-002',
    linkedInProfile: 'https://www.linkedin.com/in/priya-patel',
    firstName: 'Ms. Priya',
    middleName: '',
    lastName: 'Patel',
    address: '8 Lake View Colony',
    city: 'Hyderabad',
    pincode: '500081',
    state: 'Telangana',
    country: 'India',
    profilePhoto: '',
    contactPerson: 'self',
    phone: '+91 98765 43213',
    homePhone: '+91 040 4000 4202',
    whatsAppPhone: '+91 98765 43213',
    gender: 'Female',
    roles: ['teacher'],
    children: [],
    parentRelationships: [],
    subjectSpecializations: ['Science'],
    joiningDate: '2022-04-18',
    priorExperience: '6',
    relievingDate: '',
    assignments: [
      {
        id: 'priya-assignment-1',
        subject: 'Science',
        classes: [{ className: 'Class 7', sections: ['A'] }],
      },
    ],
    qualifications: [],
  },
  {
    id: 3,
    username: 'meera.joshi',
    email: 'meera@school.edu',
    password: 'Teacher@123',
    employeeId: 'EMP-003',
    linkedInProfile: 'https://www.linkedin.com/in/meera-joshi',
    firstName: 'Meera',
    middleName: '',
    lastName: 'Joshi',
    address: '22 Green Valley Street',
    city: 'Hyderabad',
    pincode: '500032',
    state: 'Telangana',
    country: 'India',
    profilePhoto: '',
    contactPerson: 'self',
    phone: '+91 98765 43215',
    homePhone: '+91 040 4000 4203',
    whatsAppPhone: '+91 98765 43215',
    gender: 'Female',
    roles: ['teacher'],
    children: [],
    parentRelationships: [],
    subjectSpecializations: ['English', 'Hindi'],
    joiningDate: '2020-07-02',
    priorExperience: '10',
    relievingDate: '',
    assignments: [],
    qualifications: [],
  },
]
const defaultStudentRecords: StudentProfile[] = [
  {
    id: 1,
    firstName: 'Rahul',
    middleName: '',
    lastName: 'Sharma',
    admissionNumber: 'ADM-24001',
    rollNumber: '06-A-01',
    dateOfBirth: '2013-08-12',
    gender: 'Male',
    category: 'General',
    religion: 'Hindu',
    reports: 'https://example.com/reports/rahul-sharma.pdf',
    admissionYear: '2024',
    className: 'Class 6',
    section: 'A',
    addressLine: '12 Lake View Colony',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500084',
    profilePhoto: '',
    mailingAddress: '12 Lake View Colony, Hyderabad, Telangana',
    permanentAddress: '12 Lake View Colony, Hyderabad, Telangana',
    email: 'rahul.sharma@student.school.edu',
    whatsAppPhone: '9876544001',
    phoneNumber: '9876544001',
    hasEmergencyContact: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
    guardians: [
      {
        id: 'guardian-1',
        name: 'Sanjay Sharma',
        relation: 'Father',
        phone: '9876544001',
        email: 'sanjay.sharma@email.com',
      },
    ],
    username: 'rahul.sharma',
    password: 'Student@123',
  },
  {
    id: 2,
    firstName: 'Priya',
    middleName: '',
    lastName: 'Reddy',
    admissionNumber: 'ADM-24002',
    rollNumber: '07-A-12',
    dateOfBirth: '2012-03-04',
    gender: 'Female',
    category: 'OBC',
    religion: 'Hindu',
    reports: 'https://example.com/reports/priya-reddy.pdf',
    admissionYear: '2024',
    className: 'Class 7',
    section: 'A',
    addressLine: '4 Green Meadows',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500081',
    profilePhoto: '',
    mailingAddress: '4 Green Meadows, Hyderabad, Telangana',
    permanentAddress: '4 Green Meadows, Hyderabad, Telangana',
    email: 'priya.reddy@student.school.edu',
    whatsAppPhone: '9876544002',
    phoneNumber: '9876544002',
    hasEmergencyContact: true,
    emergencyContactName: 'Ramesh Reddy',
    emergencyContactPhone: '9876544012',
    guardians: [
      {
        id: 'guardian-2',
        name: 'Lakshmi Reddy',
        relation: 'Mother',
        phone: '9876544002',
        email: 'lakshmi.reddy@email.com',
      },
    ],
    username: 'priya.reddy',
    password: 'Student@123',
  },
  {
    id: 3,
    firstName: 'Arjun',
    middleName: '',
    lastName: 'Kumar',
    admissionNumber: 'ADM-24003',
    rollNumber: '08-B-05',
    dateOfBirth: '2011-11-19',
    gender: 'Male',
    category: 'General',
    religion: 'Hindu',
    reports: 'https://example.com/reports/arjun-kumar.pdf',
    admissionYear: '2024',
    className: 'Class 8',
    section: 'B',
    addressLine: '22 Temple Road',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500032',
    profilePhoto: '',
    mailingAddress: '22 Temple Road, Hyderabad, Telangana',
    permanentAddress: '22 Temple Road, Hyderabad, Telangana',
    email: 'arjun.kumar@student.school.edu',
    whatsAppPhone: '9876544003',
    phoneNumber: '9876544003',
    hasEmergencyContact: true,
    emergencyContactName: 'Suresh Kumar',
    emergencyContactPhone: '9876544013',
    guardians: [
      {
        id: 'guardian-3',
        name: 'Vani Kumar',
        relation: 'Guardian',
        phone: '9876544003',
        email: 'vani.kumar@email.com',
      },
    ],
    username: 'arjun.kumar',
    password: 'Student@123',
  },
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

const roleOptions: Role[] = ['admin', 'teacher', 'student']
const gradeOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const studentStateOptions = ['Andhra Pradesh', 'Delhi', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh']
const studentCountryOptions = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia']
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

const getStoredValue = (key: string, fallback = '') => {
  if (typeof window === 'undefined') return fallback
  return window.localStorage.getItem(key)?.trim() || fallback
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })

const loadTeacherRecords = (): TeacherProfile[] => {
  if (typeof window === 'undefined') return defaultTeacherRecords

  try {
    const raw = window.localStorage.getItem(ADMIN_TEACHERS_KEY)
    if (!raw) return defaultTeacherRecords
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return defaultTeacherRecords

    const normalized = parsed.flatMap((teacher, index) => {
      const record = normalizeTeacherProfile(teacher, Date.now() + index)
      return record ? [record] : []
    })

    return normalized.length ? normalized : defaultTeacherRecords
  } catch {
    return defaultTeacherRecords
  }
}

const loadStudentRecords = (): StudentProfile[] => {
  if (typeof window === 'undefined') return defaultStudentRecords

  try {
    const raw = window.localStorage.getItem(ADMIN_STUDENTS_KEY)
    if (!raw) return defaultStudentRecords
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return defaultStudentRecords

    const normalized = parsed.flatMap((student, index) => {
      const record = normalizeStudentProfile(student, Date.now() + index)
      return record ? [record] : []
    })

    return normalized.length ? normalized : defaultStudentRecords
  } catch {
    return defaultStudentRecords
  }
}

const loadRolePermissions = (): RolePermissionsState => {
  const fallback = createDefaultRolePermissionsState()

  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(ADMIN_ROLE_PERMISSIONS_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Partial<RolePermissionsState>
    return {
      administrator: parsed.administrator || fallback.administrator,
      teacher: parsed.teacher || fallback.teacher,
      student: parsed.student || fallback.student,
      parent: parsed.parent || fallback.parent,
    }
  } catch {
    return fallback
  }
}

const getTeacherGuardianContact = (
  teacherId: number,
  teacher: Pick<TeacherProfile, 'firstName' | 'middleName' | 'lastName' | 'email' | 'phone' | 'homePhone' | 'whatsAppPhone'>,
  relation: ParentRelation,
): GuardianContact => ({
  id: `teacher-parent-${teacherId}`,
  name: getTeacherFullName(teacher),
  relation,
  phone: teacher.whatsAppPhone || teacher.phone || teacher.homePhone,
  email: teacher.email,
})

const syncTeacherParentRelationshipsToStudents = (
  nextTeacher: TeacherProfile,
  previousTeacher: TeacherProfile | null,
  currentStudents: StudentProfile[],
) => {
  const previousGuardianId = previousTeacher ? `teacher-parent-${previousTeacher.id}` : null
  const nextGuardianId = `teacher-parent-${nextTeacher.id}`
  const parentRoleEnabled = nextTeacher.roles.includes('parent')
  const selectedStudentIds = new Set(parentRoleEnabled ? nextTeacher.parentRelationships.map((item) => item.studentId) : [])
  const relationshipMap = new Map(nextTeacher.parentRelationships.map((item) => [item.studentId, item.relation]))

  return currentStudents.map((student) => {
    const existingGuardians = student.guardians.filter((guardian) => guardian.id !== previousGuardianId && guardian.id !== nextGuardianId)
    if (!selectedStudentIds.has(student.id)) {
      return {
        ...student,
        guardians: existingGuardians,
      }
    }

    return {
      ...student,
      guardians: [
        ...existingGuardians,
        getTeacherGuardianContact(nextTeacher.id, nextTeacher, relationshipMap.get(student.id) || ''),
      ],
    }
  })
}

const getDefaultAdminProfile = (): ProfileSettingsData => ({
  username: getStoredValue('skaimitra_admin_username', 'admin.skaimitra'),
  email: getStoredValue('skaimitra_admin_email', 'admin@skaimitra.com'),
  firstName: getStoredValue('skaimitra_admin_first_name', 'Admin'),
  lastName: getStoredValue('skaimitra_admin_last_name', 'User'),
  address: getStoredValue('skaimitra_admin_address', 'SkaiMitra Head Office, Hyderabad'),
  phone: getStoredValue('skaimitra_admin_phone', '+91 98765 40000'),
  homePhone: getStoredValue('skaimitra_admin_home_phone', '+91 040 4000 1200'),
  whatsAppPhone: getStoredValue('skaimitra_admin_whatsapp_phone', '+91 98765 40000'),
  schoolId: getStoredValue('skaimitra_admin_school_id', 'ADM-001'),
  status: getStoredValue('skaimitra_admin_status', 'Active'),
  role: 'Admin',
  subject: getStoredValue('skaimitra_admin_subject', 'Administration'),
})

const getDefaultSchoolSettings = (): SchoolSettingsData => ({
  schoolName: getStoredValue('skaimitra_school_name', 'SkaiMitra Public School'),
  licenseNumber: getStoredValue('skaimitra_school_license', 'LIC-2026-1842'),
  address: getStoredValue('skaimitra_school_address', '12 Knowledge Park Road, Hyderabad, Telangana'),
  locationType: (getStoredValue('skaimitra_school_location_type', 'Urban') as SchoolSettingsData['locationType']) || 'Urban',
  contactPerson: getStoredValue('skaimitra_school_contact_person', 'Rohan Verma'),
  phoneNumber: getStoredValue('skaimitra_school_phone', '+91 98765 43000'),
  whatsappPhoneNumber: getStoredValue('skaimitra_school_whatsapp', '+91 98765 43001'),
  email: getStoredValue('skaimitra_school_email', 'info@skaimitra.com'),
  faxNumber: getStoredValue('skaimitra_school_fax', '040-4210-2200'),
  websiteUrl: getStoredValue('skaimitra_school_website', 'https://www.skaimitra.com'),
  mapAddressUrl: getStoredValue('skaimitra_school_map_url', 'https://maps.google.com/?q=SkaiMitra+Public+School'),
  academicAffiliation: getStoredValue('skaimitra_school_affiliation', 'CBSE Senior Secondary Affiliation'),
  logoName: getStoredValue('skaimitra_school_logo_name', 'SkaiMitra_LogoV2.0.jpg'),
})

const getDefaultAdminThemePreference = () => getStoredValue(ADMIN_THEME_PREFERENCE_KEY, 'light')

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Home')
  const [systemSettingsView, setSystemSettingsView] = useState<SystemSettingsView>('grid')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [users, setUsers] = useState<UserRow[]>([])
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => loadTeacherRecords())
  const [students, setStudents] = useState<StudentProfile[]>(() => loadStudentRecords())
  const [rolePermissions, setRolePermissions] = useState<RolePermissionsState>(() => loadRolePermissions())
  const [selectedPermissionRole, setSelectedPermissionRole] = useState<PermissionRole>('administrator')
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
  const [adminProfile, setAdminProfile] = useState<ProfileSettingsData>(() => getDefaultAdminProfile())
  const [adminName, setAdminName] = useState(() => {
    const profile = getDefaultAdminProfile()
    return `${profile.firstName} ${profile.lastName}`.trim()
  })
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsData>(() => getDefaultSchoolSettings())
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
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false)
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null)
  const [teacherForm, setTeacherForm] = useState<TeacherFormValues>(() => createEmptyTeacherForm())
  const [selectedTeacherProfileId, setSelectedTeacherProfileId] = useState<number | null>(null)
  const [selectedTeacherForAssignment, setSelectedTeacherForAssignment] = useState<TeacherProfile | null>(null)
  const [assignTeacherForm, setAssignTeacherForm] = useState<AssignTeacherFormValues>(() => createEmptyAssignTeacherForm())
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null)
  const [, setIsAssignmentEditorOpen] = useState(false)
  const [isAddQualificationOpen, setIsAddQualificationOpen] = useState(false)
  const [draftTeacherQualifications, setDraftTeacherQualifications] = useState<TeacherQualification[]>([])
  const [draftTeacherAssignments, setDraftTeacherAssignments] = useState<TeacherAssignment[]>([])
  const [qualificationForm, setQualificationForm] = useState<TeacherQualificationFormValues>(() =>
    createEmptyTeacherQualificationForm(),
  )
  const [qualificationFile, setQualificationFile] = useState<File | null>(null)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)
  const [studentPageMode, setStudentPageMode] = useState<'create' | 'edit' | 'view' | null>(null)
  const [selectedStudentProfileId, setSelectedStudentProfileId] = useState<number | null>(null)
  const [studentForm, setStudentForm] = useState<StudentFormValues>(() => createEmptyStudentForm())
  const {
    themes: dashboardThemeOptions,
    themeId: adminThemePreference,
    activeTheme: activeAdminTheme,
    setThemeId: setAdminThemePreference,
    saveTheme: saveAdminThemePreference,
  } = useTheme(getDefaultAdminThemePreference(), ADMIN_THEME_PREFERENCE_KEY)

  useEffect(() => {
    if (!uiNotice) return
    const timeoutId = window.setTimeout(() => setUiNotice(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [uiNotice])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ADMIN_TEACHERS_KEY, JSON.stringify(teachers))
  }, [teachers])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ADMIN_STUDENTS_KEY, JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ADMIN_ROLE_PERMISSIONS_KEY, JSON.stringify(rolePermissions))
  }, [rolePermissions])

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
      teachers.filter((teacher) => {
        const query = teacherSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(teacher.id, query) ||
          includesSearch(getTeacherFullName(teacher), query) ||
          includesSearch(teacher.username, query) ||
          includesSearch(teacher.email, query) ||
          includesSearch(teacher.phone, query) ||
          teacher.subjectSpecializations.some((subject) => includesSearch(subject, query)) ||
          teacher.assignments.some(
            (assignment) =>
              includesSearch(assignment.subject, query) ||
              assignment.classes.some(
                (classGroup) =>
                  includesSearch(classGroup.className, query) ||
                  classGroup.sections.some((section) => includesSearch(section, query)),
              ),
          )
        )
      }),
    [teacherSearchTerm, teachers],
  )

  const teacherStats = useMemo(() => {
    const totalAssignments = teachers.reduce((sum, teacher) => sum + teacher.assignments.length, 0)
    const activeCourses = new Set(teachers.flatMap((teacher) => teacher.assignments.map((assignment) => assignment.subject))).size

    return {
      totalTeachers: teachers.length,
      totalAssignments,
      activeCourses,
      totalStudents: students.length,
    }
  }, [students.length, teachers])

  const selectedTeacherProfile = useMemo(
    () => teachers.find((teacher) => teacher.id === selectedTeacherProfileId) || null,
    [selectedTeacherProfileId, teachers],
  )

  const draftTeacherProfile = useMemo(
    () => ({
      id: 0,
      ...teacherForm,
      assignments: draftTeacherAssignments,
      qualifications: draftTeacherQualifications,
    }),
    [draftTeacherAssignments, draftTeacherQualifications, teacherForm],
  )

  const selectedStudentProfile = useMemo(
    () => students.find((student) => student.id === selectedStudentProfileId) || null,
    [selectedStudentProfileId, students],
  )

  const draftStudentProfile = useMemo(
    () => ({
      id: selectedStudentProfileId || 0,
      ...studentForm,
      permanentAddress: studentForm.sameAsMailingAddress ? studentForm.mailingAddress : studentForm.permanentAddress,
    }),
    [selectedStudentProfileId, studentForm],
  )

  const studentStats = useMemo(() => {
    const countByClass = (className: string) => students.filter((student) => student.className === className).length

    return {
      totalStudents: students.length,
      class6: countByClass('Class 6'),
      class7: countByClass('Class 7'),
      class8: countByClass('Class 8'),
    }
  }, [students])

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const query = studentSearchTerm.trim().toLowerCase()
        if (!query) return true

        return (
          includesSearch(student.id, query) ||
          includesSearch(getStudentFullName(student), query) ||
          includesSearch(student.admissionNumber, query) ||
          includesSearch(student.rollNumber, query) ||
          includesSearch(student.className, query) ||
          includesSearch(student.section, query) ||
          includesSearch(student.email, query) ||
          includesSearch(student.whatsAppPhone, query) ||
          includesSearch(student.phoneNumber, query) ||
          includesSearch(student.city, query) ||
          includesSearch(student.state, query) ||
          includesSearch(student.country, query) ||
          includesSearch(student.username, query) ||
          student.guardians.some(
            (guardian) =>
              includesSearch(guardian.name, query) ||
              includesSearch(guardian.phone, query) ||
              includesSearch(guardian.email, query),
          )
        )
      }),
    [studentSearchTerm, students],
  )

  const rolePermissionRoles = useMemo<RolePermissionRoleMeta[]>(
    () => [
      {
        role: 'administrator',
        name: 'Administrator',
        icon: 'shield',
        userCount: 1,
        description: 'Full system access and management',
        accentClass: 'is-admin',
      },
      {
        role: 'teacher',
        name: 'Teacher',
        icon: 'graduation',
        userCount: teachers.length,
        description: 'Manage courses, grading, and classroom workflows',
        accentClass: 'is-teacher',
      },
      {
        role: 'student',
        name: 'Student',
        icon: 'student',
        userCount: students.length,
        description: 'Access courses, assignments, and announcements',
        accentClass: 'is-student',
      },
      {
        role: 'parent',
        name: 'Parent',
        icon: 'parent',
        userCount: students.reduce((total, student) => total + student.guardians.length, 0),
        description: 'Review student progress, reports, and announcements',
        accentClass: 'is-parent',
      },
    ],
    [students, teachers.length],
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
    const nextName = `${nextProfile.firstName} ${nextProfile.lastName}`.trim()
    setAdminName(nextName)
    localStorage.setItem('skaimitra_name', nextName)
    localStorage.setItem('skaimitra_admin_username', nextProfile.username)
    localStorage.setItem('skaimitra_admin_email', nextProfile.email)
    localStorage.setItem('skaimitra_admin_first_name', nextProfile.firstName)
    localStorage.setItem('skaimitra_admin_last_name', nextProfile.lastName)
    localStorage.setItem('skaimitra_admin_address', nextProfile.address)
    localStorage.setItem('skaimitra_admin_phone', nextProfile.phone)
    localStorage.setItem('skaimitra_admin_home_phone', nextProfile.homePhone)
    localStorage.setItem('skaimitra_admin_whatsapp_phone', nextProfile.whatsAppPhone)
    localStorage.setItem('skaimitra_admin_school_id', nextProfile.schoolId)
    localStorage.setItem('skaimitra_admin_status', nextProfile.status)
    localStorage.setItem('skaimitra_admin_subject', nextProfile.subject || '')
  }

  const saveSchoolSettings = (nextSettings: SchoolSettingsData) => {
    setSchoolSettings(nextSettings)
    localStorage.setItem('skaimitra_school_name', nextSettings.schoolName)
    localStorage.setItem('skaimitra_school_license', nextSettings.licenseNumber)
    localStorage.setItem('skaimitra_school_address', nextSettings.address)
    localStorage.setItem('skaimitra_school_location_type', nextSettings.locationType)
    localStorage.setItem('skaimitra_school_contact_person', nextSettings.contactPerson)
    localStorage.setItem('skaimitra_school_phone', nextSettings.phoneNumber)
    localStorage.setItem('skaimitra_school_whatsapp', nextSettings.whatsappPhoneNumber)
    localStorage.setItem('skaimitra_school_email', nextSettings.email)
    localStorage.setItem('skaimitra_school_fax', nextSettings.faxNumber)
    localStorage.setItem('skaimitra_school_website', nextSettings.websiteUrl)
    localStorage.setItem('skaimitra_school_map_url', nextSettings.mapAddressUrl)
    localStorage.setItem('skaimitra_school_affiliation', nextSettings.academicAffiliation)
    localStorage.setItem('skaimitra_school_logo_name', nextSettings.logoName)
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
    if (viewMode !== 'dashboard' || activeTab !== 'Home') return
    void loadDashboardCounts()
  }, [activeTab, viewMode, loadDashboardCounts])

  useEffect(() => {
    if (viewMode !== 'userManagement' && activeTab !== 'Users') return
    void loadUsers()
  }, [activeTab, viewMode, loadUsers])

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

  const handleTeacherFieldChange = (field: keyof TeacherFormValues, value: string) => {
    setTeacherForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleTeacherRole = (role: TeacherRole) => {
    setTeacherForm((prev) => {
      if (role === 'teacher') return prev

      const nextRoles: TeacherRole[] = prev.roles.includes(role)
        ? prev.roles.filter((item) => item !== role)
        : [...prev.roles, role]

      const normalizedRoles: TeacherRole[] = nextRoles.includes('teacher') ? nextRoles : ['teacher', ...nextRoles]
      const parentEnabled = normalizedRoles.includes('parent')

      return {
        ...prev,
        roles: normalizedRoles,
        children: parentEnabled ? prev.children : [],
        parentRelationships: parentEnabled ? prev.parentRelationships : [],
      }
    })
  }

  const handleToggleTeacherParentStudent = (studentId: number) => {
    setTeacherForm((prev) => {
      const exists = prev.parentRelationships.some((item) => item.studentId === studentId)
      const parentRelationships = exists
        ? prev.parentRelationships.filter((item) => item.studentId !== studentId)
        : [...prev.parentRelationships, { studentId, relation: '' as ParentRelation }]

      return {
        ...prev,
        parentRelationships,
        children: parentRelationships.map((item) => item.studentId),
      }
    })
  }

  const handleTeacherPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const photoUrl = await fileToDataUrl(file)
      setTeacherForm((prev) => ({ ...prev, profilePhoto: photoUrl }))
    } catch {
      setUiNotice({ type: 'error', message: 'Unable to preview the selected teacher profile photo.' })
    }
  }

  const resetTeacherForm = () => {
    setTeacherForm(createEmptyTeacherForm())
    setDraftTeacherQualifications([])
    setDraftTeacherAssignments([])
    setEditingTeacherId(null)
  }

  const handleOpenAddTeacher = () => {
    resetTeacherForm()
    setSelectedTeacherProfileId(null)
    setIsAddTeacherOpen(true)
  }

  const handleOpenTeacherProfile = (teacher: TeacherProfile) => {
    handleCloseAssignTeacher()
    setIsAddTeacherOpen(false)
    setSelectedTeacherProfileId(teacher.id)
  }

  const handleCloseTeacherProfile = () => {
    setSelectedTeacherProfileId(null)
    handleCloseAssignTeacher()
    setIsAddTeacherOpen(false)
    setIsAddQualificationOpen(false)
    setQualificationForm(createEmptyTeacherQualificationForm())
    setQualificationFile(null)
    setDraftTeacherQualifications([])
    setDraftTeacherAssignments([])
  }

  const handleSaveTeacher = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nextTeacherId = editingTeacherId || Date.now()
    const previousTeacher = editingTeacherId ? teachers.find((teacher) => teacher.id === editingTeacherId) || null : null
    const normalizedTeacher = {
      ...teacherForm,
      username: teacherForm.username.trim(),
      email: teacherForm.email.trim(),
      password: teacherForm.password.trim(),
      employeeId: teacherForm.employeeId.trim(),
      linkedInProfile: teacherForm.linkedInProfile.trim(),
      firstName: teacherForm.firstName.trim(),
      middleName: teacherForm.middleName.trim(),
      lastName: teacherForm.lastName.trim(),
      address: teacherForm.address.trim(),
      city: teacherForm.city.trim(),
      pincode: teacherForm.pincode.trim(),
      state: teacherForm.state.trim(),
      country: teacherForm.country.trim(),
      profilePhoto: teacherForm.profilePhoto,
      contactPerson: teacherForm.contactPerson,
      phone: teacherForm.phone.trim(),
      homePhone: teacherForm.homePhone.trim(),
      whatsAppPhone: teacherForm.whatsAppPhone.trim(),
      roles: Array.from(new Set(teacherForm.roles.includes('teacher') ? teacherForm.roles : ['teacher', ...teacherForm.roles])) as TeacherRole[],
      parentRelationships: teacherForm.parentRelationships,
      children: teacherForm.parentRelationships.map((item) => item.studentId),
      subjectSpecializations: Array.from(
        new Set([...teacherForm.subjectSpecializations, ...draftTeacherAssignments.map((assignment) => assignment.subject)]),
      ),
      priorExperience: teacherForm.priorExperience.trim(),
    }

    if (
      !normalizedTeacher.username ||
      !normalizedTeacher.email ||
      !normalizedTeacher.firstName ||
      !normalizedTeacher.lastName ||
      !normalizedTeacher.employeeId ||
      !normalizedTeacher.phone ||
      !normalizedTeacher.whatsAppPhone ||
      !normalizedTeacher.address ||
      !normalizedTeacher.city ||
      !normalizedTeacher.pincode ||
      !normalizedTeacher.state ||
      !normalizedTeacher.country ||
      !normalizedTeacher.gender ||
      !normalizedTeacher.username ||
      !normalizedTeacher.joiningDate ||
      !normalizedTeacher.priorExperience
    ) {
      setUiNotice({ type: 'error', message: 'Fill in all required teacher details before saving.' })
      return
    }

    const isDuplicateEmployeeId = teachers.some(
      (teacher) =>
        teacher.id !== editingTeacherId &&
        teacher.employeeId.trim().toLowerCase() === normalizedTeacher.employeeId.toLowerCase(),
    )

    if (isDuplicateEmployeeId) {
      setUiNotice({ type: 'error', message: 'Employee ID must be unique for each teacher.' })
      return
    }

    if (normalizedTeacher.linkedInProfile) {
      try {
        const linkedInUrl = new URL(normalizedTeacher.linkedInProfile)
        if (!['http:', 'https:'].includes(linkedInUrl.protocol)) {
          throw new Error('Invalid LinkedIn URL protocol')
        }
      } catch {
        setUiNotice({ type: 'error', message: 'Enter a valid LinkedIn profile URL.' })
        return
      }
    }

    if (!editingTeacherId && !normalizedTeacher.password) {
      setUiNotice({ type: 'error', message: 'Password is required for a new teacher.' })
      return
    }

    if (normalizedTeacher.roles.includes('parent') && !normalizedTeacher.parentRelationships.length) {
      setUiNotice({ type: 'error', message: 'Select at least one student when Parent role is enabled.' })
      return
    }

    const nextTeacherRecord: TeacherProfile = editingTeacherId
      ? {
          ...(previousTeacher || {
            id: nextTeacherId,
            assignments: [],
            qualifications: [],
          }),
          ...normalizedTeacher,
        }
      : {
          id: nextTeacherId,
          ...normalizedTeacher,
          assignments: draftTeacherAssignments,
          qualifications: draftTeacherQualifications,
        }

    setTeachers((prev) => {
      if (editingTeacherId) {
        return prev.map((teacher) => (teacher.id === editingTeacherId ? nextTeacherRecord : teacher))
      }

      return [nextTeacherRecord, ...prev]
    })
    setStudents((prev) => syncTeacherParentRelationshipsToStudents(nextTeacherRecord, previousTeacher, prev))

    setIsAddTeacherOpen(false)
    resetTeacherForm()
    setUiNotice({
      type: 'success',
      message: editingTeacherId ? 'Teacher profile updated successfully.' : 'Teacher added successfully.',
    })
  }

  const resetAssignTeacherForm = () => setAssignTeacherForm(createEmptyAssignTeacherForm())

  const handleOpenAssignTeacher = (teacher: TeacherProfile, subject?: string) => {
    setSelectedTeacherForAssignment(teacher)
    setIsAssignmentEditorOpen(true)
    setEditingAssignmentId(null)
    setAssignTeacherForm({
      ...createEmptyAssignTeacherForm(),
      subjects: subject ? [subject] : [],
    })
  }

  const handleOpenEditAssignment = (teacher: TeacherProfile, assignmentId: string) => {
    const assignment = teacher.assignments.find((item) => item.id === assignmentId)
    if (!assignment) return

    const [firstClass, ...remainingClasses] = assignment.classes

    setSelectedTeacherForAssignment(teacher)
    setIsAssignmentEditorOpen(true)
    setEditingAssignmentId(assignment.id)
    setAssignTeacherForm({
      className: firstClass?.className || '',
      sections: firstClass?.sections || [],
      subjects: [assignment.subject],
      classGroups: remainingClasses.map((classGroup) => ({
        className: classGroup.className,
        sections: [...classGroup.sections],
      })),
    })
  }

  const handleAssignTeacherFieldChange = (field: 'className', value: string) => {
    setAssignTeacherForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleAssignSubject = (subject: string) => {
    setAssignTeacherForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((item) => item !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleToggleAssignSection = (section: string) => {
    setAssignTeacherForm((prev) => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter((item) => item !== section)
        : [...prev.sections, section],
    }))
  }

  const handleCloseAssignTeacher = () => {
    setSelectedTeacherForAssignment(null)
    setIsAssignmentEditorOpen(false)
    setEditingAssignmentId(null)
    resetAssignTeacherForm()
  }

  const handleQualificationFieldChange = (field: keyof TeacherQualificationFormValues, value: string) => {
    setQualificationForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleQualificationFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQualificationFile(event.target.files?.[0] || null)
  }

  const handleOpenAddQualification = () => {
    setQualificationForm(createEmptyTeacherQualificationForm())
    setQualificationFile(null)
    setIsAddQualificationOpen(true)
  }

  const handleCloseAddQualification = () => {
    setIsAddQualificationOpen(false)
    setQualificationForm(createEmptyTeacherQualificationForm())
    setQualificationFile(null)
  }

  const handleSaveQualification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if ((!selectedTeacherProfile && !isAddTeacherOpen) || !qualificationFile) {
      setUiNotice({ type: 'error', message: 'Upload a certificate before saving the qualification.' })
      return
    }

    const normalizedQualification = {
      qualification: qualificationForm.qualification.trim(),
      degree: qualificationForm.degree.trim(),
      graduationYear: qualificationForm.graduationYear.trim(),
      institutionName: qualificationForm.institutionName.trim(),
    }

    if (
      !normalizedQualification.qualification ||
      !normalizedQualification.degree ||
      !normalizedQualification.graduationYear ||
      !normalizedQualification.institutionName
    ) {
      setUiNotice({ type: 'error', message: 'Fill in all qualification details before saving.' })
      return
    }

    try {
      const certificateUrl = await fileToDataUrl(qualificationFile)
      const nextQualification = {
        id: `${selectedTeacherProfile?.id || 'draft'}-qualification-${Date.now()}`,
        ...normalizedQualification,
        certificateName: qualificationFile.name,
        certificateUrl,
      }

      if (selectedTeacherProfile) {
        setTeachers((prev) =>
          prev.map((teacher) =>
            teacher.id === selectedTeacherProfile.id
              ? {
                  ...teacher,
                  qualifications: [nextQualification, ...teacher.qualifications],
                }
              : teacher,
          ),
        )
      } else {
        setDraftTeacherQualifications((prev) => [nextQualification, ...prev])
      }

      handleCloseAddQualification()
      setUiNotice({ type: 'success', message: 'Qualification added successfully.' })
    } catch {
      setUiNotice({ type: 'error', message: 'Unable to read the certificate file.' })
    }
  }

  const handleDeleteQualification = (qualificationId: string) => {
    if (selectedTeacherProfile) {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === selectedTeacherProfile.id
            ? {
                ...teacher,
                qualifications: teacher.qualifications.filter((qualification) => qualification.id !== qualificationId),
              }
            : teacher,
        ),
      )
    } else {
      setDraftTeacherQualifications((prev) => prev.filter((qualification) => qualification.id !== qualificationId))
    }
    setUiNotice({ type: 'success', message: 'Qualification removed.' })
  }

  const handleAssignTeacher = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedTeacherForAssignment) return
    if (!assignTeacherForm.subjects.length) {
      setUiNotice({ type: 'error', message: 'Choose at least one subject to teach.' })
      return
    }
    if (!assignTeacherForm.classGroups.length && (!assignTeacherForm.className || !assignTeacherForm.sections.length)) {
      setUiNotice({ type: 'error', message: 'Add at least one class-section combination before assigning.' })
      return
    }

    const pendingClassGroups = normalizeTeacherClassGroups([
      ...assignTeacherForm.classGroups,
      {
        className: assignTeacherForm.className,
        sections: assignTeacherForm.sections,
      },
    ])

    if (selectedTeacherForAssignment.id === 0 && isAddTeacherOpen) {
      setDraftTeacherAssignments((prev) => {
        const baseAssignments = editingAssignmentId
          ? prev.filter((assignment) => assignment.id !== editingAssignmentId)
          : [...prev]

        return mergeTeacherAssignments([
          ...baseAssignments,
          ...assignTeacherForm.subjects.map((subject) => ({
            id: editingAssignmentId || `draft-${Date.now()}-${subject.replace(/\s+/g, '-').toLowerCase()}`,
            subject,
            classes: pendingClassGroups,
          })),
        ])
      })

      handleCloseAssignTeacher()
      setUiNotice({
        type: 'success',
        message: editingAssignmentId ? 'Assignment updated successfully.' : 'Assignment saved successfully.',
      })
      return
    }

    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id !== selectedTeacherForAssignment.id) return teacher

        const baseAssignments = editingAssignmentId
          ? teacher.assignments.filter((assignment) => assignment.id !== editingAssignmentId)
          : [...teacher.assignments]

        const nextAssignments = mergeTeacherAssignments([
          ...baseAssignments,
          ...assignTeacherForm.subjects.map((subject) => ({
            id: editingAssignmentId || `${teacher.id}-${Date.now()}-${subject.replace(/\s+/g, '-').toLowerCase()}`,
            subject,
            classes: pendingClassGroups,
          })),
        ])

        return {
          ...teacher,
          assignments: nextAssignments,
          subjectSpecializations: Array.from(new Set([...teacher.subjectSpecializations, ...nextAssignments.map((assignment) => assignment.subject)])),
        }
      }),
    )

    handleCloseAssignTeacher()
    setUiNotice({
      type: 'success',
      message: editingAssignmentId ? 'Assignment updated successfully.' : 'Assignment saved successfully.',
    })
  }

  const handleRemoveTeacherAssignment = (teacherId: number, assignmentId: string) => {
    if (teacherId === 0 && isAddTeacherOpen) {
      setDraftTeacherAssignments((prev) => prev.filter((assignment) => assignment.id !== assignmentId))
      setUiNotice({ type: 'success', message: 'Assignment removed.' })
      return
    }

    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === teacherId
          ? { ...teacher, assignments: teacher.assignments.filter((assignment) => assignment.id !== assignmentId) }
          : teacher,
      ),
    )
    setUiNotice({ type: 'success', message: 'Assignment removed.' })
  }

  const handleStudentFieldChange = (field: keyof StudentFormValues, value: string | boolean) => {
    setStudentForm((prev) => {
      const next = { ...prev, [field]: value }

      if (field === 'sameAsMailingAddress') {
        next.sameAsMailingAddress = Boolean(value)
        next.permanentAddress = value ? prev.mailingAddress : prev.permanentAddress
      }

      if (field === 'mailingAddress' && prev.sameAsMailingAddress && typeof value === 'string') {
        next.permanentAddress = value
      }

      return next
    })
  }

  const handleStudentGuardianChange = (guardianId: string, field: keyof GuardianContact, value: string) => {
    setStudentForm((prev) => ({
      ...prev,
      guardians: prev.guardians.map((guardian) => (guardian.id === guardianId ? { ...guardian, [field]: value } : guardian)),
    }))
  }

  const handleAddGuardian = () => {
    setStudentForm((prev) => ({
      ...prev,
      guardians: [...prev.guardians, createEmptyGuardian()],
    }))
  }

  const handleRemoveGuardian = (guardianId: string) => {
    setStudentForm((prev) => ({
      ...prev,
      guardians: prev.guardians.length > 1 ? prev.guardians.filter((guardian) => guardian.id !== guardianId) : prev.guardians,
    }))
  }

  const handleStudentPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const photoUrl = await fileToDataUrl(file)
      setStudentForm((prev) => ({ ...prev, profilePhoto: photoUrl }))
    } catch {
      setUiNotice({ type: 'error', message: 'Unable to preview the selected profile photo.' })
    }
  }

  const resetStudentForm = () => {
    setStudentForm(createEmptyStudentForm())
    setEditingStudentId(null)
  }

  const handleCloseStudentProfile = () => {
    setStudentPageMode(null)
    setSelectedStudentProfileId(null)
    resetStudentForm()
  }

  const handleOpenAddStudent = () => {
    resetStudentForm()
    setSelectedStudentProfileId(null)
    setStudentPageMode('create')
  }

  const handleOpenEditStudent = (student: StudentProfile) => {
    setEditingStudentId(student.id)
    setSelectedStudentProfileId(student.id)
    setStudentForm({
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      category: student.category,
      religion: student.religion,
      reports: student.reports,
      admissionYear: student.admissionYear,
      className: student.className,
      section: student.section,
      addressLine: student.addressLine,
      city: student.city,
      state: student.state,
      country: student.country,
      pincode: student.pincode,
      profilePhoto: student.profilePhoto,
      mailingAddress: student.mailingAddress,
      permanentAddress: student.permanentAddress,
      email: student.email,
      whatsAppPhone: student.whatsAppPhone,
      phoneNumber: student.phoneNumber,
      hasEmergencyContact: student.hasEmergencyContact,
      emergencyContactName: student.emergencyContactName,
      emergencyContactPhone: student.emergencyContactPhone,
      guardians: student.guardians.length ? student.guardians.map((guardian) => ({ ...guardian })) : [createEmptyGuardian(student.id)],
      username: student.username,
      password: student.password,
      sameAsMailingAddress: Boolean(student.mailingAddress && student.mailingAddress === student.permanentAddress),
      sendCredentialsAfterSave: false,
    })
    setStudentPageMode('edit')
  }

  const handleSaveStudent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalizedStudent = {
      firstName: studentForm.firstName.trim(),
      middleName: studentForm.middleName.trim(),
      lastName: studentForm.lastName.trim(),
      admissionNumber: studentForm.admissionNumber.trim(),
      rollNumber: studentForm.rollNumber.trim(),
      dateOfBirth: studentForm.dateOfBirth.trim(),
      gender: studentForm.gender,
      category: studentForm.category,
      religion: studentForm.religion.trim(),
      reports: studentForm.reports.trim(),
      admissionYear: studentForm.admissionYear.trim(),
      className: studentForm.className.trim(),
      section: studentForm.section.trim(),
      addressLine: studentForm.addressLine.trim(),
      city: studentForm.city.trim(),
      state: studentForm.state.trim(),
      country: studentForm.country.trim(),
      pincode: studentForm.pincode.trim(),
      profilePhoto: studentForm.profilePhoto,
      mailingAddress: studentForm.mailingAddress.trim(),
      permanentAddress: (studentForm.sameAsMailingAddress ? studentForm.mailingAddress : studentForm.permanentAddress).trim(),
      email: studentForm.email.trim(),
      whatsAppPhone: studentForm.whatsAppPhone.trim(),
      phoneNumber: studentForm.phoneNumber.trim(),
      hasEmergencyContact: studentForm.hasEmergencyContact,
      emergencyContactName: studentForm.hasEmergencyContact ? studentForm.emergencyContactName.trim() : '',
      emergencyContactPhone: studentForm.hasEmergencyContact ? studentForm.emergencyContactPhone.trim() : '',
      guardians: studentForm.guardians.map((guardian) => ({
        ...guardian,
        name: guardian.name.trim(),
        relation: guardian.relation,
        phone: guardian.phone.trim(),
        email: guardian.email.trim(),
      })),
      username: studentForm.username.trim(),
      password: studentForm.password.trim(),
    }

    const hasInvalidPhone =
      (normalizedStudent.whatsAppPhone && !/^\d+$/.test(normalizedStudent.whatsAppPhone)) ||
      (normalizedStudent.phoneNumber && !/^\d+$/.test(normalizedStudent.phoneNumber)) ||
      (normalizedStudent.emergencyContactPhone && !/^\d+$/.test(normalizedStudent.emergencyContactPhone))
    const hasInvalidGuardianPhone = normalizedStudent.guardians.some((guardian) => guardian.phone && !/^\d+$/.test(guardian.phone))
    const hasInvalidEmail = normalizedStudent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedStudent.email)
    const hasInvalidGuardianEmail = normalizedStudent.guardians.some(
      (guardian) => guardian.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian.email),
    )
    const hasInvalidReportLink = normalizedStudent.reports && !/^https?:\/\/\S+\.\S+/.test(normalizedStudent.reports)
    const hasInvalidAdmissionYear = normalizedStudent.admissionYear && !/^\d{4}$/.test(normalizedStudent.admissionYear)
    const hasIncompleteGuardian = normalizedStudent.guardians.some(
      (guardian) => !guardian.name || !guardian.relation || !guardian.phone || !guardian.email,
    )

    if (
      !normalizedStudent.firstName ||
      !normalizedStudent.lastName ||
      !normalizedStudent.className ||
      !normalizedStudent.section ||
      !normalizedStudent.email ||
      !normalizedStudent.whatsAppPhone ||
      !normalizedStudent.password ||
      (normalizedStudent.hasEmergencyContact && (!normalizedStudent.emergencyContactName || !normalizedStudent.emergencyContactPhone)) ||
      hasIncompleteGuardian
    ) {
      setUiNotice({ type: 'error', message: 'Fill in the required student, guardian, and account details before saving.' })
      return
    }

    if (hasInvalidPhone || hasInvalidGuardianPhone) {
      setUiNotice({ type: 'error', message: 'Phone fields must contain numbers only.' })
      return
    }

    if (hasInvalidGuardianEmail) {
      setUiNotice({ type: 'error', message: 'Enter a valid email address for each guardian.' })
      return
    }

    if (hasInvalidEmail) {
      setUiNotice({ type: 'error', message: 'Enter a valid student email address.' })
      return
    }

    if (hasInvalidReportLink) {
      setUiNotice({ type: 'error', message: 'Enter a valid report document URL.' })
      return
    }

    if (hasInvalidAdmissionYear) {
      setUiNotice({ type: 'error', message: 'Admission year must use YYYY format.' })
      return
    }

    setStudents((prev) => {
      if (editingStudentId) {
        return prev.map((student) =>
          student.id === editingStudentId ? { ...student, ...normalizedStudent } : student,
        )
      }

      return [{ id: Date.now(), ...normalizedStudent }, ...prev]
    })

    handleCloseStudentProfile()
    setUiNotice({
      type: 'success',
      message: studentForm.sendCredentialsAfterSave
        ? editingStudentId
          ? 'Student updated successfully. Send action is ready.'
          : 'Student added successfully. Send action is ready.'
        : editingStudentId
          ? 'Student updated successfully.'
          : 'Student added successfully.',
    })
  }

  const handleDeleteStudent = (studentId: number) => {
    const confirmed = window.confirm('Delete this student?')
    if (!confirmed) return

    setStudents((prev) => prev.filter((student) => student.id !== studentId))
    setUiNotice({ type: 'success', message: 'Student removed successfully.' })
  }

  const handleToggleRolePermission = (role: PermissionRole, moduleKey: string, action: PermissionAction) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleKey]: {
          ...prev[role][moduleKey],
          [action]: !prev[role][moduleKey][action],
        },
      },
    }))
  }

  const handleSaveRolePermissions = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_ROLE_PERMISSIONS_KEY, JSON.stringify(rolePermissions))
    }
    setUiNotice({ type: 'success', message: 'Role permissions updated successfully.' })
  }

  const handleResetRolePermissions = () => {
    setRolePermissions(createDefaultRolePermissionsState())
    setUiNotice({ type: 'success', message: 'Role permissions reset to default.' })
  }

  const handleSaveThemePreferences = () => {
    saveAdminThemePreference()
    setUiNotice({ type: 'success', message: 'Theme preferences saved successfully.' })
  }

  const handleViewStudent = (student: StudentProfile) => {
    setSelectedStudentProfileId(student.id)
    setStudentPageMode('view')
    return
    const primaryGuardian = student.guardians[0]
    setUiNotice({
      type: 'success',
      message: `${getStudentFullName(student)} • ${student.city || student.country || 'Student profile'} • Guardian: ${primaryGuardian?.name || 'Not added'}`,
    })
    return
    setUiNotice({
      type: 'success',
      message: `${student.fullName} • ${student.className} ${student.section} • Guardian: ${student.guardianName}`,
    })
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
                    if (action.title === 'User Management') {
                      setActiveTab('Users')
                      setViewMode('userManagement')
                    }
                    if (action.title === 'Role Permissions') {
                      setActiveTab('System Settings')
                      setSystemSettingsView('rolePermissions')
                      setViewMode('dashboard')
                    }
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
    isAddTeacherOpen && !editingTeacherId ? (
      <TeacherProfilePage
        mode="create"
        teacher={draftTeacherProfile}
        subjectOptions={teacherSubjectOptions}
        students={students}
        onBack={() => {
          setIsAddTeacherOpen(false)
          resetTeacherForm()
        }}
        onSubmit={handleSaveTeacher}
        onFieldChange={handleTeacherFieldChange}
        onPhotoChange={handleTeacherPhotoChange}
        onToggleRole={handleToggleTeacherRole}
        onToggleParentStudent={handleToggleTeacherParentStudent}
        onOpenAssign={() => handleOpenAssignTeacher(draftTeacherProfile)}
        onEditAssignment={(assignmentId) => handleOpenEditAssignment(draftTeacherProfile, assignmentId)}
        onRemoveAssignment={(assignmentId) => handleRemoveTeacherAssignment(draftTeacherProfile.id, assignmentId)}
        onAddQualification={handleOpenAddQualification}
        onDeleteQualification={handleDeleteQualification}
      />
    ) : selectedTeacherProfile ? (
      <TeacherProfilePage
        teacher={selectedTeacherProfile}
        subjectOptions={teacherSubjectOptions}
        students={students}
        onBack={handleCloseTeacherProfile}
        onOpenAssign={() => handleOpenAssignTeacher(selectedTeacherProfile)}
        onEditAssignment={(assignmentId) => handleOpenEditAssignment(selectedTeacherProfile, assignmentId)}
        onRemoveAssignment={(assignmentId) => handleRemoveTeacherAssignment(selectedTeacherProfile.id, assignmentId)}
        onAddQualification={handleOpenAddQualification}
        onDeleteQualification={handleDeleteQualification}
      />
    ) : (
      <main className="role-main role-main-detail">
        <section className="role-primary">
          <section className="role-section-head role-admin-page-head">
            <div>
              <h2>Teachers Management</h2>
              <p className="role-muted">Manage teaching staff and their courses</p>
            </div>
            <button type="button" className="role-primary-btn teacher-add-btn" onClick={handleOpenAddTeacher}>
              <Plus size={16} />
              Add Teacher
            </button>
          </section>

          <section className="role-admin-summary-grid">
            <article className="role-card role-admin-summary-card">
              <p className="role-admin-summary-value">{teacherStats.totalTeachers}</p>
              <p className="role-muted">Total Teachers</p>
            </article>
            <article className="role-card role-admin-summary-card">
              <p className="role-admin-summary-value">{teacherStats.activeCourses}</p>
              <p className="role-muted">Active Courses</p>
            </article>
            <article className="role-card role-admin-summary-card">
              <p className="role-admin-summary-value">{teacherStats.totalStudents}</p>
              <p className="role-muted">Total Number of Students</p>
            </article>
          </section>

          <section className="role-card role-admin-staff-card">
            <div className="role-section-head role-admin-communications-head teacher-staff-head">
              <div>
                <h3 className="role-section-title">Teaching Staff</h3>
                <p className="role-muted">Add faculty profiles and manage class-section assignments.</p>
              </div>
              <div className="teacher-staff-toolbar">
                <div className="role-user-search-wrap role-user-search-inline">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search teachers by name, subject, email, class, or section..."
                    value={teacherSearchTerm}
                    onChange={(e) => setTeacherSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="role-admin-staff-list">
              {filteredTeachers.length ? (
                filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onView={handleOpenTeacherProfile}
                    onAssign={handleOpenAssignTeacher}
                    onEditAssignment={handleOpenEditAssignment}
                    onRemoveAssignment={handleRemoveTeacherAssignment}
                  />
                ))
              ) : (
                <p className="role-muted">No teachers match your search.</p>
              )}
            </div>
          </section>
        </section>
      </main>
    )
  )

  const renderStudentsTab = () => {
    if (studentPageMode === 'create' || studentPageMode === 'edit') {
      return (
        <StudentProfilePage
          mode={studentPageMode}
          student={draftStudentProfile}
          classOptions={gradeOptions}
          sectionOptions={teacherSectionOptions}
          stateOptions={studentStateOptions}
          countryOptions={studentCountryOptions}
          onBack={handleCloseStudentProfile}
          onSubmit={handleSaveStudent}
          onFieldChange={handleStudentFieldChange}
          onGuardianChange={handleStudentGuardianChange}
          onAddGuardian={handleAddGuardian}
          onRemoveGuardian={handleRemoveGuardian}
          onPhotoChange={handleStudentPhotoChange}
        />
      )
    }

    if (studentPageMode === 'view' && selectedStudentProfile) {
      return (
        <StudentProfilePage
          mode="view"
          student={selectedStudentProfile}
          onBack={handleCloseStudentProfile}
          onEdit={() => handleOpenEditStudent(selectedStudentProfile)}
        />
      )
    }

    return renderStudentsManagementTab()
  }

  const renderStudentsManagementTab = () => (
    <main className="role-main role-main-detail">
      <section className="role-primary">
        <section className="role-section-head role-admin-page-head">
          <div>
            <h2>Students Management</h2>
            <p className="role-muted">Manage a clean, structured onboarding flow for student records.</p>
          </div>
          <button type="button" className="role-primary-btn teacher-add-btn" onClick={handleOpenAddStudent}>
            + Add Student
          </button>
        </section>

        <section className="role-admin-summary-grid role-admin-summary-grid-students">
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">{studentStats.totalStudents}</p>
            <p className="role-muted">Total Students</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">{studentStats.class6}</p>
            <p className="role-muted">Class 6</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">{studentStats.class7}</p>
            <p className="role-muted">Class 7</p>
          </article>
          <article className="role-card role-admin-summary-card">
            <p className="role-admin-summary-value">{studentStats.class8}</p>
            <p className="role-muted">Class 8</p>
          </article>
        </section>

        <section className="role-card role-admin-staff-card">
          <div className="role-section-head role-admin-communications-head teacher-staff-head">
            <div>
              <h3 className="role-section-title">Student Directory</h3>
              <p className="role-muted">Add, review, and manage student profiles with structured contact and guardian details.</p>
            </div>
            <div className="teacher-staff-toolbar">
              <div className="role-user-search-wrap role-user-search-inline">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search students by name, username, city, guardian, or phone..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="role-table-wrap student-directory-table-wrap">
            {filteredStudents.length ? (
              <table className="role-table student-directory-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Roll Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const fullName = getStudentFullName(student)

                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="student-directory-name">
                            <strong>{fullName || 'Unnamed Student'}</strong>
                            <span>{student.admissionNumber || student.username || 'No admission number'}</span>
                          </div>
                        </td>
                        <td>{student.className || 'Not assigned'}</td>
                        <td>{student.section || 'Not assigned'}</td>
                        <td>{student.email || 'Not available'}</td>
                        <td>{student.phoneNumber || student.whatsAppPhone || 'Not available'}</td>
                        <td>{student.rollNumber || 'Not assigned'}</td>
                        <td>
                          <div className="student-directory-actions">
                            <button type="button" className="role-icon-square-btn" onClick={() => handleViewStudent(student)} aria-label={`View ${fullName}`}>
                              <Eye size={16} />
                            </button>
                            <button type="button" className="role-icon-square-btn" onClick={() => handleOpenEditStudent(student)} aria-label={`Edit ${fullName}`}>
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="role-icon-square-btn student-delete-btn"
                              onClick={() => handleDeleteStudent(student.id)}
                              aria-label={`Delete ${fullName}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="role-muted">No students match your search.</p>
            )}
          </div>
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

  const renderUsersTab = () => (
    <main className="role-main role-user-main">
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
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'All' | Role)}>
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button type="button" className="role-user-add-btn" onClick={handleOpenAddModal}>
          <Plus size={16} />
          Add User
        </button>
      </section>

      <section className="role-card role-detail-card">
        <div className="role-section-head">
          <div>
            <h2>Users</h2>
            <p className="role-muted">Search and manage admins, teachers, and students from one place.</p>
          </div>
        </div>
        {isUsersLoading && <p className="role-muted">Loading users...</p>}
        <div className="role-table-wrap">
          <table className="role-table role-user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>
                    <span className={`role-pill role-pill-${user.role}`}>{toTitle(user.role)}</span>
                  </td>
                  <td>{user.email}</td>
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
  )

  const renderTabContent = () => {
    if (activeTab === 'Home') return renderDashboardHome()
    if (activeTab === 'Teachers') {
      return renderTeachersTab()
    }
    if (activeTab === 'Students') {
      return renderStudentsTab()
    }
    if (activeTab === 'Users') {
      return renderUsersTab()
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
    if (activeTab === 'System Settings') {
      if (systemSettingsView === 'schoolSettings') {
        return (
          <main className="role-main role-main-detail">
            <section className="role-primary">
              <div className="role-card-actions admin-settings-back-row">
                <button type="button" className="role-secondary-btn" onClick={() => setSystemSettingsView('grid')}>
                  {'<-'}
                </button>
              </div>
              <SchoolSettingsForm settings={schoolSettings} onSave={saveSchoolSettings} />
            </section>
          </main>
        )
      }

      if (systemSettingsView === 'systemConfig') {
        return (
          <main className="role-main role-main-detail">
            <section className="role-primary">
              <section className="role-card role-detail-card admin-settings-detail-card">
                <div className="role-card-actions admin-settings-back-row">
                  <button type="button" className="role-secondary-btn" onClick={() => setSystemSettingsView('grid')}>
                    {'<-'}
                  </button>
                </div>
                <div className="planner-card-head profile-settings-head">
                  <div>
                    <h2>System Configuration</h2>
                    <p className="role-muted">Configure system-level settings and integrations.</p>
                  </div>
                </div>
                <div className="profile-settings-grid">
                  <label>
                    <span>Authentication Provider</span>
                    <input type="text" value="Firebase Authentication" readOnly />
                  </label>
                  <label>
                    <span>Primary Database</span>
                    <input type="text" value="Cloud Firestore" readOnly />
                  </label>
                  <label>
                    <span>Email Notifications</span>
                    <input type="text" value="Enabled" readOnly />
                  </label>
                  <label>
                    <span>Calendar Sync</span>
                    <input type="text" value="Internal Scheduler + Fallback Sync" readOnly />
                  </label>
                </div>
              </section>
            </section>
          </main>
        )
      }

      if (systemSettingsView === 'themes') {
        return (
          <main className="role-main role-main-detail">
            <section className="role-primary">
              <section className="role-card role-detail-card admin-settings-detail-card">
                <div className="role-card-actions admin-settings-back-row">
                  <button type="button" className="role-secondary-btn" onClick={() => setSystemSettingsView('grid')}>
                    {'<-'}
                  </button>
                </div>
                <div className="planner-card-head profile-settings-head">
                  <div>
                    <h2>Themes</h2>
                    <p className="role-muted">Customize dashboard themes and visual preferences.</p>
                  </div>
                </div>
                <div className="theme-settings-panel">
                  <div className="theme-settings-head">
                    <div>
                      <h3>Theme Settings</h3>
                      <p className="role-muted">Choose a theme for your dashboard interface</p>
                    </div>
                    <div className="theme-settings-head-actions">
                      <div className="theme-settings-current">
                        <span>Current Theme</span>
                        <strong>{activeAdminTheme.name}</strong>
                      </div>
                      <button type="button" className="role-primary-btn theme-settings-save-btn" onClick={handleSaveThemePreferences}>
                        Save Preferences
                      </button>
                    </div>
                  </div>

                  <div className="theme-settings-layout">
                    <section className="theme-settings-card">
                      <div className="theme-settings-section-head">
                        <div>
                          <h4>Available Themes</h4>
                          <p className="role-muted">Pick from a small set of clean, dashboard-friendly palettes.</p>
                        </div>
                      </div>
                      <ThemeGrid themes={dashboardThemeOptions} selectedThemeId={adminThemePreference} onSelectTheme={setAdminThemePreference} />
                    </section>

                    <section className="theme-settings-card theme-settings-preview-card">
                      <ThemePreview theme={activeAdminTheme} />
                    </section>
                  </div>

                  <div className="theme-settings-footer">
                    <div className="profile-settings-grid theme-settings-meta-grid">
                      <label>
                        <span>Default Dashboard View</span>
                        <input type="text" value="Overview with analytics widgets" readOnly />
                      </label>
                      <label>
                        <span>Notifications Panel</span>
                        <input type="text" value="Enabled for admins" readOnly />
                      </label>
                      <label>
                        <span>Activity Summaries</span>
                        <input type="text" value="Compact digest enabled" readOnly />
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </main>
        )
      }

      if (systemSettingsView === 'rolePermissions') {
        return (
          <RolePermissionsPage
            roles={rolePermissionRoles}
            selectedRole={selectedPermissionRole}
            permissions={rolePermissions}
            onSelectRole={setSelectedPermissionRole}
            onTogglePermission={handleToggleRolePermission}
            onSave={handleSaveRolePermissions}
            onReset={handleResetRolePermissions}
          />
        )
      }

      return (
        <main className="role-main role-main-detail">
          <section className="role-primary">
            <section className="role-card role-quick-actions-card admin-settings-grid-card">
              <h3 className="role-section-title">System Settings</h3>
              <div className="role-action-grid">
                {systemSettingsCards.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="role-action-tile"
                    onClick={() => setSystemSettingsView(item.key)}
                  >
                    <div className="role-action-content">
                      <div className="role-action-head">
                        <item.icon size={16} />
                        <span className="role-action-title">{item.title}</span>
                      </div>
                      <p className="role-action-desc">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </section>
        </main>
      )
    }
    return (
      <main className="role-main role-main-detail">
        <section className="role-primary">
          <section className="role-card role-detail-card">
            <ProfileSettingsPanel
              title="Admin Profile"
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
                {activeTab === 'Users' ? 'User Management' : `Welcome back, ${adminName}`}
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
            <ProfileDrawer profile={adminProfile} onSave={saveAdminProfile} onLogout={() => navigate('/')} />
            <button type="button" className="role-logout-btn" onClick={() => navigate('/')}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <nav className="role-tabs admin-role-tabs">
          {navTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={activeTab === tab.label ? 'is-active' : ''}
              onClick={() => {
                setActiveTab(tab.label)
                if (tab.label === 'System Settings') setSystemSettingsView('grid')
                setViewMode(tab.label === 'Users' ? 'userManagement' : 'dashboard')
                setUserError('')
                setUserInfo('')
                setSelectedTeacherProfileId(null)
                setSelectedStudentProfileId(null)
                setStudentPageMode(null)
                handleCloseAssignTeacher()
                setIsAddQualificationOpen(false)
              }}
            >
              <tab.icon size={18} strokeWidth={2.4} className="role-tab-icon" />
              <span className="role-tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {uiNotice ? (
        <div className={`role-floating-notice ${uiNotice.type === 'success' ? 'is-success' : 'is-error'}`}>
          {uiNotice.message}
        </div>
      ) : null}

      {renderTabContent()}

      <AddQualificationModal
        isOpen={isAddQualificationOpen}
        values={qualificationForm}
        certificateName={qualificationFile?.name || ''}
        onClose={handleCloseAddQualification}
        onSubmit={handleSaveQualification}
        onFieldChange={handleQualificationFieldChange}
        onCertificateChange={handleQualificationFileChange}
      />

      <AssignTeacherModal
        isOpen={Boolean(selectedTeacherForAssignment)}
        teacher={selectedTeacherForAssignment}
        values={assignTeacherForm}
        classOptions={gradeOptions}
        sectionOptions={teacherSectionOptions}
        subjectOptions={teacherSubjectOptions}
        isEditing={Boolean(editingAssignmentId)}
        onClose={handleCloseAssignTeacher}
        onSubmit={handleAssignTeacher}
        onFieldChange={handleAssignTeacherFieldChange}
        onToggleSubject={handleToggleAssignSubject}
        onToggleSection={handleToggleAssignSection}
      />

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
    </div>
  )
}

export default AdminDashboard
