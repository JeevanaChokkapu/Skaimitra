export type StudentProfile = {
  id: number
  fullName: string
  admissionNo: string
  rollNo: string
  className: string
  section: string
  gradeId: string
  sectionId: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other' | ''
  address: string
  guardianName: string
  relation: 'Father' | 'Mother' | 'Guardian' | ''
  guardianPhone: string
  guardianEmail: string
}

export type StudentFormValues = Omit<StudentProfile, 'id'>

export const createEmptyStudentForm = (): StudentFormValues => ({
  fullName: '',
  admissionNo: '',
  rollNo: '',
  className: '',
  section: '',
  gradeId: '',
  sectionId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  guardianName: '',
  relation: '',
  guardianPhone: '',
  guardianEmail: '',
})

export const getStudentInitials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'ST'
