export type StudentGender = 'Male' | 'Female' | 'Other' | ''
export type GuardianRelation = 'Father' | 'Mother' | 'Guardian' | ''
export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'Others' | ''

export type GuardianContact = {
  id: string
  name: string
  relation: GuardianRelation
  phone: string
  email: string
}

export type StudentProfile = {
  id: number
  firstName: string
  middleName: string
  lastName: string
  admissionNumber: string
  rollNumber: string
  dateOfBirth: string
  gender: StudentGender
  category: StudentCategory
  religion: string
  reports: string
  admissionYear: string
  className: string
  section: string
  addressLine: string
  city: string
  state: string
  country: string
  pincode: string
  profilePhoto: string
  mailingAddress: string
  permanentAddress: string
  email: string
  whatsAppPhone: string
  phoneNumber: string
  hasEmergencyContact: boolean
  emergencyContactName: string
  emergencyContactPhone: string
  guardians: GuardianContact[]
  username: string
  password: string
  fullName?: string
  guardianName?: string
}

export type StudentFormValues = {
  firstName: string
  middleName: string
  lastName: string
  admissionNumber: string
  rollNumber: string
  dateOfBirth: string
  gender: StudentGender
  category: StudentCategory
  religion: string
  reports: string
  admissionYear: string
  className: string
  section: string
  addressLine: string
  city: string
  state: string
  country: string
  pincode: string
  profilePhoto: string
  mailingAddress: string
  permanentAddress: string
  email: string
  whatsAppPhone: string
  phoneNumber: string
  hasEmergencyContact: boolean
  emergencyContactName: string
  emergencyContactPhone: string
  guardians: GuardianContact[]
  username: string
  password: string
  sameAsMailingAddress: boolean
  sendCredentialsAfterSave: boolean
}

const toSafeString = (value: unknown) => (typeof value === 'string' ? value : '')

const splitName = (fullName: string) => {
  const [firstName = '', ...rest] = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

export const createEmptyGuardian = (seed = Date.now()): GuardianContact => ({
  id: `guardian-${seed}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  relation: '',
  phone: '',
  email: '',
})

export const createEmptyStudentForm = (): StudentFormValues => ({
  firstName: '',
  middleName: '',
  lastName: '',
  admissionNumber: '',
  rollNumber: '',
  dateOfBirth: '',
  gender: '',
  category: '',
  religion: '',
  reports: '',
  admissionYear: '',
  className: '',
  section: '',
  addressLine: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  profilePhoto: '',
  mailingAddress: '',
  permanentAddress: '',
  email: '',
  whatsAppPhone: '',
  phoneNumber: '',
  hasEmergencyContact: false,
  emergencyContactName: '',
  emergencyContactPhone: '',
  guardians: [createEmptyGuardian()],
  username: '',
  password: '',
  sameAsMailingAddress: false,
  sendCredentialsAfterSave: false,
})

export const getStudentFullName = (student: Pick<StudentProfile, 'firstName' | 'middleName' | 'lastName'>) =>
  `${student.firstName} ${student.middleName} ${student.lastName}`.replace(/\s+/g, ' ').trim()

export const getStudentInitials = (student: Pick<StudentProfile, 'firstName' | 'middleName' | 'lastName'>) =>
  getStudentFullName(student)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'ST'

export const normalizeStudentProfile = (value: unknown, fallbackId: number): StudentProfile | null => {
  if (!value || typeof value !== 'object') return null

  const record = value as {
    id?: unknown
    firstName?: unknown
    middleName?: unknown
    lastName?: unknown
    admissionNumber?: unknown
    rollNumber?: unknown
    fullName?: unknown
    gender?: unknown
    category?: unknown
    religion?: unknown
    reports?: unknown
    admissionYear?: unknown
    dateOfBirth?: unknown
    className?: unknown
    section?: unknown
    addressLine?: unknown
    address?: unknown
    city?: unknown
    state?: unknown
    country?: unknown
    pincode?: unknown
    profilePhoto?: unknown
    mailingAddress?: unknown
    permanentAddress?: unknown
    email?: unknown
    whatsAppPhone?: unknown
    phoneNumber?: unknown
    hasEmergencyContact?: unknown
    emergencyContactName?: unknown
    emergencyContactPhone?: unknown
    guardians?: unknown
    guardianName?: unknown
    relation?: unknown
    guardianPhone?: unknown
    guardianEmail?: unknown
    username?: unknown
    password?: unknown
  }

  const directFirstName = toSafeString(record.firstName).trim()
  const directLastName = toSafeString(record.lastName).trim()
  const combinedName = toSafeString(record.fullName).trim()
  const nameParts = splitName(combinedName)
  const firstName = directFirstName || nameParts.firstName
  const middleName = toSafeString(record.middleName).trim()
  const lastName = directLastName || nameParts.lastName

  const normalizedGuardians = Array.isArray(record.guardians)
    ? record.guardians.flatMap((guardian, index) => {
        if (!guardian || typeof guardian !== 'object') return []

        const item = guardian as {
          id?: unknown
          name?: unknown
          relation?: unknown
          phone?: unknown
          email?: unknown
        }

        return [
          {
            id: toSafeString(item.id).trim() || `guardian-${fallbackId}-${index}`,
            name: toSafeString(item.name).trim(),
            relation: ((toSafeString(item.relation).trim() as GuardianRelation) || '') as GuardianRelation,
            phone: toSafeString(item.phone).trim(),
            email: toSafeString(item.email).trim(),
          },
        ]
      })
    : []

  if (!normalizedGuardians.length) {
    const legacyGuardianName = toSafeString(record.guardianName).trim()
    const legacyGuardianPhone = toSafeString(record.guardianPhone).trim()
    const legacyGuardianEmail = toSafeString(record.guardianEmail).trim()
    const legacyRelation = (toSafeString(record.relation).trim() as GuardianRelation) || ''

    if (legacyGuardianName || legacyGuardianPhone || legacyGuardianEmail || legacyRelation) {
      normalizedGuardians.push({
        id: `guardian-${fallbackId}-legacy`,
        name: legacyGuardianName,
        relation: legacyRelation,
        phone: legacyGuardianPhone,
        email: legacyGuardianEmail,
      })
    }
  }

  return {
    id: typeof record.id === 'number' ? record.id : fallbackId,
    firstName,
    middleName,
    lastName,
    admissionNumber: toSafeString(record.admissionNumber).trim(),
    rollNumber: toSafeString(record.rollNumber).trim(),
    dateOfBirth: toSafeString(record.dateOfBirth).trim(),
    gender: (toSafeString(record.gender).trim() as StudentGender) || '',
    category: (toSafeString(record.category).trim() as StudentCategory) || '',
    religion: toSafeString(record.religion).trim(),
    reports: toSafeString(record.reports).trim(),
    admissionYear: toSafeString(record.admissionYear).trim(),
    className: toSafeString(record.className).trim(),
    section: toSafeString(record.section).trim(),
    addressLine: toSafeString(record.addressLine).trim() || toSafeString(record.address).trim(),
    city: toSafeString(record.city).trim(),
    state: toSafeString(record.state).trim(),
    country: toSafeString(record.country).trim() || 'India',
    pincode: toSafeString(record.pincode).trim(),
    profilePhoto: toSafeString(record.profilePhoto).trim(),
    mailingAddress: toSafeString(record.mailingAddress).trim(),
    permanentAddress: toSafeString(record.permanentAddress).trim(),
    email: toSafeString(record.email).trim(),
    whatsAppPhone: toSafeString(record.whatsAppPhone).trim() || toSafeString(record.phoneNumber).trim(),
    phoneNumber: toSafeString(record.phoneNumber).trim(),
    hasEmergencyContact: Boolean(record.hasEmergencyContact),
    emergencyContactName: toSafeString(record.emergencyContactName).trim(),
    emergencyContactPhone: toSafeString(record.emergencyContactPhone).trim(),
    guardians: normalizedGuardians.length ? normalizedGuardians : [createEmptyGuardian(fallbackId)],
    username: toSafeString(record.username).trim(),
    password: toSafeString(record.password).trim(),
    fullName: combinedName || `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim(),
    guardianName: normalizedGuardians[0]?.name || '',
  }
}
