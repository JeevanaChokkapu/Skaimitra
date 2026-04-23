import { useMemo, useState, type ChangeEvent } from 'react'
import { ArrowLeft, Save, UserCircle2 } from 'lucide-react'
import BasicInfoSection from './BasicInfoSection'
import QualificationSection from './QualificationSection'
import SubjectAssignmentsSection from './SubjectAssignmentsSection'
import {
  getTeacherFullName,
  getTeacherInitials,
  splitTeacherAddress,
  type ParentRelation,
  type TeacherFormValues,
  type TeacherProfile,
  type TeacherRole,
} from './teacherTypes'
import { getStudentFullName, type StudentProfile } from './studentTypes'

type TeacherProfileViewProps = {
  mode?: 'view'
  teacher: TeacherProfile
  subjectOptions: string[]
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
  onParentRelationChange: (studentId: number, relation: ParentRelation) => void
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

const relationOptions: ParentRelation[] = ['Father', 'Mother', 'Guardian']

const getStudentClassSection = (student: StudentProfile) => {
  const className = student.className?.trim()
  const section = student.section?.trim()

  if (className && section) {
    return {
      full: `${className} ${section}`,
      compact: `${className.replace(/^Class\s*/i, '')}${section}`,
    }
  }

  const match = student.rollNumber.match(/(\d+)-([A-Z])/i)
  if (match) {
    return {
      full: `Class ${Number(match[1])} ${match[2].toUpperCase()}`,
      compact: `${Number(match[1])}${match[2].toUpperCase()}`,
    }
  }

  return {
    full: 'Class not assigned',
    compact: 'NA',
  }
}

function TeacherProfileView(props: TeacherProfileProps) {
  const { teacher, onBack } = props
  const fullName = getTeacherFullName(teacher)
  const address = splitTeacherAddress(teacher.address)
  const isCreateMode = props.mode === 'create'
  const profilePhoto = teacher.profilePhoto
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const isParentRoleSelected = isCreateMode ? props.teacher.roles.includes('parent') : false

  const filteredStudents = useMemo(() => {
    if (!isCreateMode) return []

    const query = studentSearchTerm.trim().toLowerCase()
    if (!query) return props.students

    return props.students.filter((student) => {
      const label = `${getStudentFullName(student)} ${student.rollNumber} ${getStudentClassSection(student).full}`.toLowerCase()
      return label.includes(query)
    })
  }, [isCreateMode, props, studentSearchTerm])

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
                  <p className="role-muted">Add the same teacher profile details shown in the view page.</p>
                </div>
              </div>

              <div className="student-profile-primary-grid">
                <div className="student-profile-photo-card student-profile-photo-card-edit">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={fullName || 'Teacher preview'} className="student-profile-photo-image" />
                  ) : (
                    <div className="student-profile-photo-placeholder">
                      <UserCircle2 size={56} />
                      <strong>{getTeacherInitials(teacher)}</strong>
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
                  <span>Email</span>
                  <input
                    type="email"
                    value={teacher.email}
                    onChange={(event) => props.onFieldChange('email', event.target.value)}
                    placeholder="teacher@school.edu"
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

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>WhatsApp Phone</span>
                  <input
                    type="tel"
                    value={teacher.whatsAppPhone}
                    onChange={(event) => props.onFieldChange('whatsAppPhone', event.target.value)}
                    placeholder="+91 98765 43210"
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

                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Pincode</span>
                  <input
                    type="text"
                    value={teacher.pincode}
                    onChange={(event) => props.onFieldChange('pincode', event.target.value)}
                    placeholder="500001"
                  />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>City</span>
                  <input type="text" value={address.city || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>State</span>
                  <input type="text" value={address.state || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field">
                  <span>Country</span>
                  <input type="text" value={address.country || 'Not available'} readOnly />
                </label>

                <label className="teacher-profile-readonly-field teacher-profile-input-field teacher-profile-field-span-3">
                  <span>Address</span>
                  <textarea
                    rows={4}
                    placeholder="Enter full address with city, state, country"
                    value={teacher.address}
                    onChange={(event) => props.onFieldChange('address', event.target.value)}
                  />
                </label>
                </div>
              </div>
            </section>

            <section className="teacher-profile-section">
              <div className="teacher-profile-section-head">
                <div>
                  <h3>Account & Professional Details</h3>
                  <p className="role-muted">Complete the account setup and staff details required to save this profile.</p>
                </div>
              </div>

              <div className="teacher-profile-info-grid teacher-profile-form-grid">
                <label className="teacher-profile-readonly-field teacher-profile-input-field">
                  <span>Username</span>
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
              title="Subject Specialization"
              description="Assign subject, class, and section using the same modal as the Teachers tab."
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
                  <h3>Roles & Access</h3>
                  <p className="role-muted">Teacher stays enabled. Add parent or admin only if this profile needs it.</p>
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
                      <span>{roleLabels[role]}</span>
                      {isTeacherRole ? <span className="teacher-role-chip-note">Required</span> : null}
                    </button>
                  )
                })}
              </div>
            </section>

            {isParentRoleSelected ? (
              <section className="teacher-profile-section">
                <div className="teacher-profile-section-head">
                  <div>
                    <h3>Parent Relationships</h3>
                    <p className="role-muted">Choose the students linked to this parent profile.</p>
                  </div>
                </div>

                <div className="teacher-parent-search-wrap">
                  <label className="teacher-profile-readonly-field teacher-profile-input-field">
                    <span>Select Children</span>
                    <input
                      type="text"
                      placeholder="Search students by name, class, section, or roll number"
                      value={studentSearchTerm}
                      onChange={(event) => setStudentSearchTerm(event.target.value)}
                    />
                  </label>

                  <div className="teacher-parent-chip-row">
                    {teacher.parentRelationships.length ? (
                      teacher.parentRelationships.map((relationship) => {
                        const student = props.students.find((item) => item.id === relationship.studentId)
                        if (!student) return null

                        const classSection = getStudentClassSection(student)
                        return (
                          <button
                            key={relationship.studentId}
                            type="button"
                            className="teacher-parent-chip"
                            onClick={() => props.onToggleParentStudent(relationship.studentId)}
                          >
                            {`${student.firstName} - ${classSection.compact}`}
                            <span aria-hidden>x</span>
                          </button>
                        )
                      })
                    ) : (
                      <p className="role-muted">No children selected yet.</p>
                    )}
                  </div>

                  <div className="teacher-parent-student-list">
                    {filteredStudents.length ? (
                      filteredStudents.map((student) => {
                        const classSection = getStudentClassSection(student)
                        const isSelected = teacher.parentRelationships.some((item) => item.studentId === student.id)
                        const selectedRelationship = teacher.parentRelationships.find((item) => item.studentId === student.id)

                        return (
                          <div key={student.id} className={`teacher-parent-student-row ${isSelected ? 'is-selected' : ''}`}>
                            <label className="teacher-parent-student-option">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => props.onToggleParentStudent(student.id)}
                              />
                              <span>{`${getStudentFullName(student)} - ${classSection.full}`}</span>
                            </label>

                            {isSelected ? (
                              <label className="teacher-profile-readonly-field teacher-profile-input-field teacher-parent-relation-field">
                                <span>Relation</span>
                                <select
                                  value={selectedRelationship?.relation || ''}
                                  onChange={(event) => props.onParentRelationChange(student.id, event.target.value as ParentRelation)}
                                >
                                  <option value="">Select relation</option>
                                  {relationOptions.map((relation) => (
                                    <option key={relation} value={relation}>
                                      {relation}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ) : null}
                          </div>
                        )
                      })
                    ) : (
                      <div className="teacher-profile-empty-state">
                        <p className="role-muted">No students match your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

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
            <SubjectAssignmentsSection
              teacher={teacher}
              title="Subject Specialization"
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
          </>
        )}
      </section>
    </main>
  )
}

export default TeacherProfileView
