import { useMemo, useState, type ChangeEvent } from 'react'
import { ArrowLeft, Check, Save, UserCircle2 } from 'lucide-react'
import BasicInfoSection from './BasicInfoSection'
import QualificationSection from './QualificationSection'
import SubjectAssignmentsSection from './SubjectAssignmentsSection'
import {
  getTeacherFullName,
  teacherContactPersonOptions,
  type TeacherContactPerson,
  type TeacherFormValues,
  type TeacherProfile,
  type TeacherRole,
} from './teacherTypes'
import { getStudentFullName, type StudentProfile } from './studentTypes'

type TeacherProfileViewProps = {
  mode?: 'view'
  teacher: TeacherProfile
  subjectOptions: string[]
  students: StudentProfile[]
  onBack: () => void
  onOpenAssign: () => void
  onEditAssignment: (assignmentId: string) => void
  onRemoveAssignment: (assignmentId: string) => void
  onAddQualification: () => void
  onDeleteQualification: (qualificationId: string) => void
}

type TeacherProfileCreateProps = {
  mode: 'create'
  teacher: TeacherProfile
  subjectOptions: string[]
  students: StudentProfile[]
  onBack: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof TeacherFormValues, value: string) => void
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onToggleRole: (role: TeacherRole) => void
  onToggleParentStudent: (studentId: number) => void
  onOpenAssign: () => void
  onEditAssignment: (assignmentId: string) => void
  onRemoveAssignment: (assignmentId: string) => void
  onAddQualification: () => void
  onDeleteQualification: (qualificationId: string) => void
}

type TeacherProfileProps = TeacherProfileViewProps | TeacherProfileCreateProps

const roleLabels: Record<TeacherRole, string> = {
  teacher: 'Teacher',
  parent: 'Parent',
  admin: 'Admin',
}

const contactPersonLabels: Record<TeacherContactPerson, string> = {
  self: 'Self',
  parent: 'Parent',
  guardian: 'Guardian',
}

const getStudentClassSection = (student: StudentProfile) => {
  const className = student.className?.trim()
  const section = student.section?.trim()

  if (className && section) {
    return {
      full: `${className} ${section}`,
      compact: `${className.replace(/^Class\s*/i, '')} ${section}`,
    }
  }

  const match = student.rollNumber.match(/(\d+)-([A-Z])/i)
  if (match) {
    return {
      full: `Class ${Number(match[1])} ${match[2].toUpperCase()}`,
      compact: `${Number(match[1])} ${match[2].toUpperCase()}`,
    }
  }

  return {
    full: 'Class not assigned',
    compact: 'NA',
  }
}

const getStudentRelationshipLabel = (student: StudentProfile) => {
  if (student.gender === 'Female') return 'daughter'
  if (student.gender === 'Male') return 'son'
  return 'student'
}

const getStudentOptionLabel = (student: StudentProfile) =>
  `${getStudentFullName(student)} - ${getStudentRelationshipLabel(student)} - ${getStudentClassSection(student).compact}`

function TeacherProfileView(props: TeacherProfileProps) {
  const { teacher, onBack } = props
  const fullName = getTeacherFullName(teacher)
  const isCreateMode = props.mode === 'create'
  const profilePhoto = teacher.profilePhoto
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const isParentRoleSelected = isCreateMode ? props.teacher.roles.includes('parent') : false

  const filteredStudents = useMemo(() => {
    const query = studentSearchTerm.trim().toLowerCase()
    if (!query) return props.students

    return props.students.filter((student) => {
      const label = `${getStudentFullName(student)} ${student.rollNumber} ${getStudentClassSection(student).full}`.toLowerCase()
      return label.includes(query)
    })
  }, [props.students, studentSearchTerm])

  const linkedChildren = useMemo(
    () =>
      teacher.parentRelationships
        .map((relationship) => props.students.find((student) => student.id === relationship.studentId))
        .filter((student): student is StudentProfile => Boolean(student)),
    [props.students, teacher.parentRelationships],
  )

  return (
    <main className="role-main role-main-detail">
      <section className="role-primary teacher-profile-page">
        <div className="teacher-profile-topbar">
          <button type="button" className="role-secondary-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Teachers
          </button>
        </div>

      

        {isCreateMode ? (
          <form className="teacher-profile-editor-form" onSubmit={props.onSubmit}>
            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Primary Information</h3>
                  
                </div>
              </div>

              <div className="student-profile-primary-grid">
                <div className="student-profile-photo-card student-profile-photo-card-edit">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={fullName || 'Teacher preview'} className="student-profile-photo-image" />
                  ) : (
                    <div className="student-profile-photo-placeholder">
                      <UserCircle2 size={56} />
                    </div>
                  )}
                  <label className="student-profile-upload-field">
                    <span>Profile Photo Upload</span>
                    <input type="file" accept="image/*" onChange={props.onPhotoChange} />
                  </label>
                </div>

                <div className="teacher-profile-info-grid teacher-profile-form-grid">
                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    value={teacher.firstName}
                    onChange={(event) => props.onFieldChange('firstName', event.target.value)}
                    placeholder="First Name"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Middle Name</span>
                  <input
                    type="text"
                    value={teacher.middleName}
                    onChange={(event) => props.onFieldChange('middleName', event.target.value)}
                    placeholder="Middle Name"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    value={teacher.lastName}
                    onChange={(event) => props.onFieldChange('lastName', event.target.value)}
                    placeholder="Last Name"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Gender</span>
                  <select value={teacher.gender} onChange={(event) => props.onFieldChange('gender', event.target.value)}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field teacher-profile-field-span-3">
                  <span>Address</span>
                  <textarea
                    rows={4}
                    placeholder="Enter street address"
                    value={teacher.address}
                    onChange={(event) => props.onFieldChange('address', event.target.value)}
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>City</span>
                  <input
                    type="text"
                    value={teacher.city}
                    onChange={(event) => props.onFieldChange('city', event.target.value)}
                    placeholder="Hyderabad"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Pincode</span>
                  <input
                    type="text"
                    value={teacher.pincode}
                    onChange={(event) => props.onFieldChange('pincode', event.target.value)}
                    placeholder="500001"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>State</span>
                  <input
                    type="text"
                    value={teacher.state}
                    onChange={(event) => props.onFieldChange('state', event.target.value)}
                    placeholder="Telangana"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Country</span>
                  <input
                    type="text"
                    value={teacher.country}
                    onChange={(event) => props.onFieldChange('country', event.target.value)}
                    placeholder="India"
                  />
                </label>
                </div>
              </div>
            </section>

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Contact Information</h3>
                  
                </div>
              </div>

              <div className="teacher-profile-info-grid teacher-profile-form-grid">
                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Contact Person</span>
                  <select value={teacher.contactPerson} onChange={(event) => props.onFieldChange('contactPerson', event.target.value)}>
                    {teacherContactPersonOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={teacher.email}
                    onChange={(event) => props.onFieldChange('email', event.target.value)}
                    placeholder="contact@school.edu"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>WhatsApp</span>
                  <input
                    type="tel"
                    value={teacher.whatsAppPhone}
                    onChange={(event) => props.onFieldChange('whatsAppPhone', event.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    value={teacher.phone}
                    onChange={(event) => props.onFieldChange('phone', event.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Home Phone</span>
                  <input
                    type="tel"
                    value={teacher.homePhone}
                    onChange={(event) => props.onFieldChange('homePhone', event.target.value)}
                    placeholder="+91 040 4000 1200"
                  />
                </label>
              </div>
            </section>

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Other Details</h3>
                  
                </div>
              </div>

              <div className="teacher-profile-info-grid teacher-profile-form-grid">
                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Employee ID</span>
                  <input
                    type="text"
                    value={teacher.employeeId}
                    onChange={(event) => props.onFieldChange('employeeId', event.target.value)}
                    placeholder="EMP-001"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>LinkedIn Profile</span>
                  <input
                    type="url"
                    value={teacher.linkedInProfile}
                    onChange={(event) => props.onFieldChange('linkedInProfile', event.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Login Username</span>
                  <input
                    type="text"
                    value={teacher.username}
                    onChange={(event) => props.onFieldChange('username', event.target.value)}
                    placeholder="teacher.username"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={teacher.password}
                    onChange={(event) => props.onFieldChange('password', event.target.value)}
                    placeholder="Create password"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Joining Date</span>
                  <input
                    type="date"
                    value={teacher.joiningDate}
                    onChange={(event) => props.onFieldChange('joiningDate', event.target.value)}
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Prior Experience</span>
                  <input
                    type="number"
                    value={teacher.priorExperience}
                    onChange={(event) => props.onFieldChange('priorExperience', event.target.value)}
                    placeholder="Years"
                  />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Relieving Date</span>
                  <input
                    type="date"
                    value={teacher.relievingDate}
                    onChange={(event) => props.onFieldChange('relievingDate', event.target.value)}
                  />
                </label>
              </div>
            </section>

            <SubjectAssignmentsSection
              teacher={teacher}
              title="Assign Subjects"
             
              emptyMessage="No assignments added yet. Use Assign to add one before saving."
              actionLabel="Assign"
              onOpenAssign={props.onOpenAssign}
              onEditAssignment={props.onEditAssignment}
              onRemoveAssignment={props.onRemoveAssignment}
            />

            <QualificationSection
              teacher={teacher}
              onAddQualification={props.onAddQualification}
              onDeleteQualification={props.onDeleteQualification}
            />

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Roles</h3>
                  
                </div>
              </div>

              <div className="teacher-role-chip-row">
                {(['teacher', 'parent', 'admin'] as TeacherRole[]).map((role) => {
                  const isActive = teacher.roles.includes(role)
                  const isTeacherRole = role === 'teacher'

                  return (
                    <button
                      key={role}
                      type="button"
                      className={`teacher-role-chip ${isActive ? 'is-active' : ''}`}
                      onClick={() => props.onToggleRole(role)}
                      aria-pressed={isActive}
                      disabled={isTeacherRole}
                    >
                      <span className="teacher-role-chip-indicator" aria-hidden>
                        {isActive ? <Check size={14} strokeWidth={3} /> : null}
                      </span>
                      <span>{roleLabels[role]}</span>
                      {isTeacherRole ? <span className="teacher-role-chip-note">Required</span> : null}
                    </button>
                  )
                })}
              </div>

              {isParentRoleSelected ? (
                <div className="teacher-inline-student-select">
                  <label className="teacher-profile-readonly-field teacher-profile-input-field teacher-link-children-field">
                    <span>Associate Student</span>
                    <input
                      type="text"
                      placeholder="Search by student name, class, section, or roll number"
                      value={studentSearchTerm}
                      onChange={(event) => setStudentSearchTerm(event.target.value)}
                    />
                  </label>

                  {linkedChildren.length ? (
                    <div className="teacher-parent-chip-row">
                      {linkedChildren.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          className="teacher-parent-chip"
                          onClick={() => props.onToggleParentStudent(student.id)}
                        >
                          {getStudentOptionLabel(student)}
                          <span aria-hidden>x</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="role-muted">No students associated yet.</p>
                  )}

                  <div className="teacher-inline-student-list" role="listbox" aria-label="Student options">
                    {filteredStudents.length ? (
                      filteredStudents.map((student) => {
                        const isSelected = teacher.parentRelationships.some((item) => item.studentId === student.id)

                        return (
                          <button
                            key={student.id}
                            type="button"
                            className={`teacher-inline-student-option ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => props.onToggleParentStudent(student.id)}
                            aria-pressed={isSelected}
                          >
                            <span>{getStudentOptionLabel(student)}</span>
                            <strong>{isSelected ? 'Selected' : 'Add'}</strong>
                          </button>
                        )
                      })
                    ) : (
                      <div className="teacher-profile-empty-state">
                        <p className="role-muted">No students match your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </section>

            <div className="teacher-modal-actions teacher-modal-actions-end">
              <button type="button" className="role-secondary-btn" onClick={onBack}>
                Cancel
              </button>
              <button type="submit" className="role-primary-btn">
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <BasicInfoSection teacher={teacher} />
            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Contact Information</h3>
                </div>
              </div>

              <div className="teacher-profile-info-grid">
                <label className="teacher-profile-readonly-field">
                  <span>Contact Person</span>
                  <input type="text" value={contactPersonLabels[teacher.contactPerson] || 'Self'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Email</span>
                  {teacher.email ? (
                    <a className="profile-clickable-field" href={`mailto:${teacher.email}`}>
                      {teacher.email}
                    </a>
                  ) : (
                    <input type="text" value="Not available" readOnly />
                  )}
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>WhatsApp</span>
                  <input type="text" value={teacher.whatsAppPhone || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Phone</span>
                  <input type="text" value={teacher.phone || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Home Phone</span>
                  <input type="text" value={teacher.homePhone || 'Not available'} readOnly />
                </label>
              </div>
            </section>

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Other Details</h3>
                </div>
              </div>

              <div className="teacher-profile-info-grid">
                <label className="teacher-profile-readonly-field">
                  <span>Employee ID</span>
                  <input type="text" value={teacher.employeeId || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>LinkedIn Profile</span>
                  <input type="text" value={teacher.linkedInProfile || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Login Username</span>
                  <input type="text" value={teacher.username || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Password</span>
                  <input type="text" value={teacher.password ? 'Saved' : 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Joining Date</span>
                  <input type="text" value={teacher.joiningDate || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Prior Experience</span>
                  <input type="text" value={teacher.priorExperience ? `${teacher.priorExperience} years` : 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Relieving Date</span>
                  <input type="text" value={teacher.relievingDate || 'Not available'} readOnly />
                </label>
              </div>
            </section>

            <SubjectAssignmentsSection
              teacher={teacher}
              title="Assign Subjects"
              actionLabel="Assign"
              onOpenAssign={props.onOpenAssign}
              onEditAssignment={props.onEditAssignment}
              onRemoveAssignment={props.onRemoveAssignment}
            />
            <QualificationSection
              teacher={teacher}
              onAddQualification={props.onAddQualification}
              onDeleteQualification={props.onDeleteQualification}
            />

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Roles</h3>
                </div>
              </div>

              <div className="teacher-role-chip-row">
                {teacher.roles.map((role) => (
                  <div key={role} className="teacher-role-chip is-active">
                    <span className="teacher-role-chip-indicator" aria-hidden>
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span>{roleLabels[role]}</span>
                    {role === 'teacher' ? <span className="teacher-role-chip-note">Required</span> : null}
                  </div>
                ))}
              </div>

              {teacher.roles.includes('parent') ? (
                linkedChildren.length ? (
                  <div className="teacher-parent-chip-row">
                    {linkedChildren.map((student) => (
                      <div key={student.id} className="teacher-parent-chip">
                        {getStudentOptionLabel(student)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="role-muted">No students associated yet.</p>
                )
              ) : null}
            </section>
          </>
        )}
      </section>
    </main>
  )
}

export default TeacherProfileView
