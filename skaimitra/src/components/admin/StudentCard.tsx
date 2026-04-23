import { Eye, MapPin, Pencil, Phone, Trash2, Users } from 'lucide-react'
import { getStudentFullName, getStudentInitials, type StudentProfile } from './studentTypes'

type StudentCardProps = {
  student: StudentProfile
  onEdit: (student: StudentProfile) => void
  onDelete: (studentId: number) => void
  onView: (student: StudentProfile) => void
}

function StudentCard({ student, onEdit, onDelete, onView }: StudentCardProps) {
  const fullName = getStudentFullName(student)
  const primaryGuardian = student.guardians[0]

  return (
    <article className="student-card">
      <div className="student-card-top">
        {student.profilePhoto ? (
          <img src={student.profilePhoto} alt={fullName} className="student-card-avatar student-card-avatar-image" />
        ) : (
          <div className="teacher-card-avatar student-card-avatar">{getStudentInitials(student)}</div>
        )}

        <div className="student-card-copy">
          <h4>{fullName}</h4>
          <p>{student.admissionNumber || `@${student.username || 'student-account'}`}</p>
          <div className="student-card-chip-row">
            {student.rollNumber ? <span className="teacher-assignment-chip">{student.rollNumber}</span> : null}
            {student.gender ? <span className="teacher-assignment-chip">{student.gender}</span> : null}
            {student.country ? <span className="teacher-assignment-chip">{student.country}</span> : null}
            <span className="teacher-assignment-chip">{student.guardians.length} Guardian{student.guardians.length > 1 ? 's' : ''}</span>
          </div>
          <div className="student-card-meta">
            {student.whatsAppPhone ? (
              <span>
                <Phone size={14} />
                {student.whatsAppPhone}
              </span>
            ) : null}
            {(student.city || student.state) ? (
              <span>
                <MapPin size={14} />
                {[student.city, student.state].filter(Boolean).join(', ')}
              </span>
            ) : null}
            {primaryGuardian?.name ? (
              <span>
                <Users size={14} />
                {primaryGuardian.name}
              </span>
            ) : null}
          </div>
        </div>

        <div className="student-card-actions">
          <button type="button" className="role-icon-square-btn" onClick={() => onView(student)} aria-label={`View ${fullName}`}>
            <Eye size={16} />
          </button>
          <button type="button" className="role-icon-square-btn" onClick={() => onEdit(student)} aria-label={`Edit ${fullName}`}>
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="role-icon-square-btn student-delete-btn"
            onClick={() => onDelete(student.id)}
            aria-label={`Delete ${fullName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default StudentCard
