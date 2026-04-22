import { Eye, Pencil, Phone, Trash2 } from 'lucide-react'
import { getStudentInitials, type StudentProfile } from './studentTypes'

type StudentCardProps = {
  student: StudentProfile
  onEdit: (student: StudentProfile) => void
  onDelete: (studentId: number) => void
  onView: (student: StudentProfile) => void
}

function StudentCard({ student, onEdit, onDelete, onView }: StudentCardProps) {
  return (
    <article className="student-card">
      <div className="student-card-top">
        <div className="teacher-card-avatar student-card-avatar">{getStudentInitials(student.fullName)}</div>

        <div className="student-card-copy">
          <h4>{student.fullName}</h4>
          <p>{student.admissionNo}</p>
          <div className="student-card-chip-row">
            <span className="teacher-assignment-chip">{student.className}</span>
            <span className="teacher-assignment-chip">Section {student.section}</span>
          </div>
          <div className="student-card-meta">
            <span>{student.guardianName}</span>
            <span>
              <Phone size={14} />
              {student.guardianPhone}
            </span>
          </div>
        </div>

        <div className="student-card-actions">
          <button type="button" className="role-icon-square-btn" onClick={() => onView(student)} aria-label={`View ${student.fullName}`}>
            <Eye size={16} />
          </button>
          <button type="button" className="role-icon-square-btn" onClick={() => onEdit(student)} aria-label={`Edit ${student.fullName}`}>
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="role-icon-square-btn student-delete-btn"
            onClick={() => onDelete(student.id)}
            aria-label={`Delete ${student.fullName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default StudentCard
