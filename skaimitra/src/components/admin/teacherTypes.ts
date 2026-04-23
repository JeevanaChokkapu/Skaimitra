export type TeacherAssignmentClassGroup = {
  className: string
  sections: string[]
}

export type TeacherAssignment = {
  id: string
  subject: string
  classes: TeacherAssignmentClassGroup[]
}

export type TeacherQualification = {
  id: string
  qualification: string
  degree: string
  graduationYear: string
  institutionName: string
  certificateName: string
  certificateUrl: string
}

export type TeacherRole = 'teacher' | 'parent' | 'admin'
export type ParentRelation = 'Father' | 'Mother' | 'Guardian' | ''

export type TeacherParentRelationship = {
  studentId: number
  relation: ParentRelation
}

export type TeacherProfile = {
  id: number
  username: string
  email: string
  password: string
  firstName: string
  middleName: string
  lastName: string
  address: string
  pincode: string
  profilePhoto: string
  phone: string
  homePhone: string
  whatsAppPhone: string
  gender: 'Male' | 'Female' | 'Other' | ''
  roles: TeacherRole[]
  children: number[]
  parentRelationships: TeacherParentRelationship[]
  subjectSpecializations: string[]
  joiningDate: string
  priorExperience: string
  relievingDate: string
  assignments: TeacherAssignment[]
  qualifications: TeacherQualification[]
}

export type TeacherFormValues = Omit<TeacherProfile, 'id' | 'assignments' | 'qualifications'>

export type AssignTeacherFormValues = {
  subjects: string[]
  className: string
  sections: string[]
  classGroups: TeacherAssignmentClassGroup[]
}

export type TeacherQualificationFormValues = {
  qualification: string
  degree: string
  graduationYear: string
  institutionName: string
}

export const createEmptyTeacherForm = (): TeacherFormValues => ({
  username: '',
  email: '',
  password: '',
  firstName: '',
  middleName: '',
  lastName: '',
  address: '',
  pincode: '',
  profilePhoto: '',
  phone: '',
  homePhone: '',
  whatsAppPhone: '',
  gender: '',
  roles: ['teacher'],
  children: [],
  parentRelationships: [],
  subjectSpecializations: [],
  joiningDate: '',
  priorExperience: '',
  relievingDate: '',
})

export const createEmptyAssignTeacherForm = (): AssignTeacherFormValues => ({
  subjects: [],
  className: '',
  sections: [],
  classGroups: [],
})

export const createEmptyTeacherQualificationForm = (): TeacherQualificationFormValues => ({
  qualification: '',
  degree: '',
  graduationYear: '',
  institutionName: '',
})

const toSafeString = (value: unknown) => (typeof value === 'string' ? value : '')

const toSafeStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []

const normalizeTeacherRoles = (value: unknown): TeacherRole[] => {
  const allowedRoles: TeacherRole[] = ['teacher', 'parent', 'admin']
  const roles = Array.isArray(value)
    ? value.flatMap((item) => {
        const normalized = toSafeString(item).trim().toLowerCase()
        return allowedRoles.includes(normalized as TeacherRole) ? [normalized as TeacherRole] : []
      })
    : []

  return roles.includes('teacher') ? Array.from(new Set(roles)) : ['teacher', ...roles]
}

const normalizeTeacherParentRelationships = (value: unknown): TeacherParentRelationship[] => {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []

    const studentId = Number((item as { studentId?: unknown }).studentId)
    if (!Number.isFinite(studentId)) return []

    const relation = toSafeString((item as { relation?: unknown }).relation).trim() as ParentRelation
    return [
      {
        studentId,
        relation: relation === 'Father' || relation === 'Mother' || relation === 'Guardian' ? relation : '',
      },
    ]
  })
}

export const normalizeTeacherClassGroups = (value: unknown): TeacherAssignmentClassGroup[] => {
  if (!Array.isArray(value)) return []

  const grouped = new Map<string, Set<string>>()

  value.forEach((classGroup) => {
    if (!classGroup || typeof classGroup !== 'object') return

    const className = toSafeString((classGroup as { className?: unknown }).className).trim()
    const sections = toSafeStringArray((classGroup as { sections?: unknown }).sections)

    if (!className) return
    if (!grouped.has(className)) grouped.set(className, new Set<string>())
    const sectionSet = grouped.get(className)
    sections.forEach((section) => sectionSet?.add(section))
  })

  return Array.from(grouped.entries()).map(([className, sections]) => ({
    className,
    sections: Array.from(sections),
  }))
}

export const mergeTeacherAssignments = (value: unknown): TeacherAssignment[] => {
  if (!Array.isArray(value)) return []

  const grouped = new Map<
    string,
    {
      id: string
      subject: string
      classMap: Map<string, Set<string>>
    }
  >()

  value.forEach((assignment, index) => {
    if (!assignment || typeof assignment !== 'object') return

    const subject = toSafeString((assignment as { subject?: unknown }).subject).trim()
    if (!subject) return

    const subjectKey = subject.toLowerCase()
    const existing =
      grouped.get(subjectKey) ||
      {
        id:
          toSafeString((assignment as { id?: unknown }).id).trim() ||
          `assignment-${index}-${subject.toLowerCase().replace(/\s+/g, '-')}`,
        subject,
        classMap: new Map<string, Set<string>>(),
      }

    normalizeTeacherClassGroups((assignment as { classes?: unknown }).classes).forEach((classGroup) => {
      if (!existing.classMap.has(classGroup.className)) existing.classMap.set(classGroup.className, new Set<string>())
      const sectionSet = existing.classMap.get(classGroup.className)
      classGroup.sections.forEach((section) => sectionSet?.add(section))
    })

    grouped.set(subjectKey, existing)
  })

  return Array.from(grouped.values()).map((assignment) => ({
    id: assignment.id,
    subject: assignment.subject,
    classes: Array.from(assignment.classMap.entries()).map(([className, sections]) => ({
      className,
      sections: Array.from(sections),
    })),
  }))
}

export const normalizeTeacherAssignments = (value: unknown): TeacherAssignment[] => {
  return mergeTeacherAssignments(value)
}

export const normalizeTeacherQualifications = (value: unknown): TeacherQualification[] => {
  if (!Array.isArray(value)) return []

  return value.flatMap((qualification, index) => {
    if (!qualification || typeof qualification !== 'object') return []

    const item = qualification as Partial<TeacherQualification>
    const qualificationName = toSafeString(item.qualification).trim()
    const degree = toSafeString(item.degree).trim()
    const institutionName = toSafeString(item.institutionName).trim()

    if (!qualificationName && !degree && !institutionName) return []

    return [
      {
        id: toSafeString(item.id).trim() || `qualification-${index}`,
        qualification: qualificationName,
        degree,
        graduationYear: toSafeString(item.graduationYear).trim(),
        institutionName,
        certificateName: toSafeString(item.certificateName).trim(),
        certificateUrl: toSafeString(item.certificateUrl).trim(),
      },
    ]
  })
}

export const normalizeTeacherProfile = (value: unknown, fallbackId: number): TeacherProfile | null => {
  if (!value || typeof value !== 'object') return null

  const record = value as Partial<TeacherProfile> & {
    name?: unknown
    fullName?: unknown
    subject?: unknown
    subjects?: unknown
  }

  const combinedName = toSafeString(record.fullName ?? record.name).trim()
  const [derivedFirstName = '', ...derivedLastName] = combinedName.split(/\s+/).filter(Boolean)
  const firstName = toSafeString(record.firstName).trim() || derivedFirstName
  const middleName = toSafeString((record as { middleName?: unknown }).middleName).trim()
  const lastName = toSafeString(record.lastName).trim() || derivedLastName.join(' ')
  const subjectSpecializations = toSafeStringArray(record.subjectSpecializations ?? record.subjects)
  const legacySubject = toSafeString(record.subject).trim()
  const parentRelationships = normalizeTeacherParentRelationships((record as { parentRelationships?: unknown }).parentRelationships)
  const children = Array.from(
    new Set([
      ...(Array.isArray((record as { children?: unknown }).children)
        ? ((record as { children?: unknown[] }).children ?? [])
            .map((item) => Number(item))
            .filter((item) => Number.isFinite(item))
        : []),
      ...parentRelationships.map((item) => item.studentId),
    ]),
  )

  return {
    id: typeof record.id === 'number' && Number.isFinite(record.id) ? record.id : fallbackId,
    username: toSafeString(record.username).trim(),
    email: toSafeString(record.email).trim(),
    password: toSafeString(record.password),
    firstName,
    middleName,
    lastName,
    address: toSafeString(record.address).trim(),
    pincode: toSafeString((record as { pincode?: unknown }).pincode).trim(),
    profilePhoto: toSafeString(record.profilePhoto).trim(),
    phone: toSafeString(record.phone).trim(),
    homePhone: toSafeString(record.homePhone).trim(),
    whatsAppPhone: toSafeString(record.whatsAppPhone).trim(),
    gender: record.gender === 'Male' || record.gender === 'Female' || record.gender === 'Other' ? record.gender : '',
    roles: normalizeTeacherRoles((record as { roles?: unknown }).roles),
    children,
    parentRelationships,
    subjectSpecializations: subjectSpecializations.length ? subjectSpecializations : legacySubject ? [legacySubject] : [],
    joiningDate: toSafeString(record.joiningDate),
    priorExperience: toSafeString(record.priorExperience),
    relievingDate: toSafeString(record.relievingDate),
    assignments: normalizeTeacherAssignments(record.assignments),
    qualifications: normalizeTeacherQualifications((record as { qualifications?: unknown }).qualifications),
  }
}

export const getTeacherFullName = (teacher: Pick<TeacherProfile, 'firstName' | 'middleName' | 'lastName'>) =>
  `${teacher.firstName || ''} ${teacher.middleName || ''} ${teacher.lastName || ''}`.replace(/\s+/g, ' ').trim() || 'Unnamed Teacher'

export const getTeacherInitials = (teacher: Pick<TeacherProfile, 'firstName' | 'lastName'>) =>
  `${(teacher.firstName || '').charAt(0)}${(teacher.lastName || '').charAt(0)}`.toUpperCase() || 'NA'

export const getTeacherPrimarySubject = (teacher: Pick<TeacherProfile, 'subjectSpecializations'>) =>
  teacher.subjectSpecializations?.[0] || 'Not assigned'

export const splitTeacherAddress = (address: string) => {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return {
      city: parts[parts.length - 3] || '',
      state: parts[parts.length - 2] || '',
      country: parts[parts.length - 1] || '',
    }
  }

  if (parts.length === 2) {
    return {
      city: parts[0],
      state: parts[1],
      country: 'India',
    }
  }

  return {
    city: parts[0] || '',
    state: '',
    country: 'India',
  }
}
