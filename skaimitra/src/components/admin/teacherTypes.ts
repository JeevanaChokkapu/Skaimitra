export type TeacherAssignment = {
  id: string
  course: string
  className: string
  section: string
  subject: string
}

export type TeacherProfile = {
  id: number
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  address: string
  phone: string
  homePhone: string
  whatsAppPhone: string
  gender: 'Male' | 'Female' | 'Other' | ''
  subjectSpecializations: string[]
  joiningDate: string
  priorExperience: string
  relievingDate: string
  assignments: TeacherAssignment[]
}

export type TeacherFormValues = Omit<TeacherProfile, 'id' | 'assignments'>

export type AssignTeacherFormValues = {
  course: string
  className: string
  section: string
  subjects: string[]
}

export const createEmptyTeacherForm = (): TeacherFormValues => ({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  homePhone: '',
  whatsAppPhone: '',
  gender: '',
  subjectSpecializations: [],
  joiningDate: '',
  priorExperience: '',
  relievingDate: '',
})

export const createEmptyAssignTeacherForm = (): AssignTeacherFormValues => ({
  course: '',
  className: '',
  section: '',
  subjects: [],
})

export const getTeacherFullName = (teacher: Pick<TeacherProfile, 'firstName' | 'lastName'>) =>
  `${teacher.firstName} ${teacher.lastName}`.trim()

export const getTeacherInitials = (teacher: Pick<TeacherProfile, 'firstName' | 'lastName'>) =>
  `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase()

export const getTeacherPrimarySubject = (teacher: Pick<TeacherProfile, 'subjectSpecializations'>) =>
  teacher.subjectSpecializations[0] || 'Not assigned'

export const buildAssignmentKey = (assignment: Pick<TeacherAssignment, 'course' | 'className' | 'section' | 'subject'>) =>
  `${assignment.course}::${assignment.className}::${assignment.section}::${assignment.subject}`.toLowerCase()
