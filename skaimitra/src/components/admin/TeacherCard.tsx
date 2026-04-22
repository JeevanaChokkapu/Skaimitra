import { Mail, Pencil, Phone, UserPlus } from 'lucide-react'
import AssignmentTag from './AssignmentTag'
import {
  getTeacherFullName,
  getTeacherInitials,
  getTeacherPrimarySubject,
  type TeacherProfile,
} from './teacherTypes'

type TeacherCardProps = {
  teacher: TeacherProfile
  onAssign: (teacher: TeacherProfile) => void
  onEdit: (teacher: TeacherProfile) => void
  onRemoveAssignment: (teacherId: number, assignmentId: string) => void
}

function TeacherCard({ teacher, onAssign, onEdit, onRemoveAssignment }: TeacherCardProps) {
  const fullName = getTeacherFullName(teacher)
  const primarySubject = getTeacherPrimarySubject(teacher)

  return (
    <article className="teacher-card">
      <div className="teacher-card-top">
        <div className="teacher-card-main">
          <div className="teacher-card-avatar">{getTeacherInitials(teacher)}</div>

          <div className="teacher-card-copy">
            <div className="teacher-card-title-row">
              <h4>{fullName}</h4>
              <p className="teacher-card-subject">{primarySubject}</p>
            </div>

            <div className="teacher-card-contact-row">
              <span>
                <Mail size={14} />
                {teacher.email}
              </span>
              <span>
                <Phone size={14} />
                {teacher.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="teacher-card-actions">
          <button type="button" className="role-primary-btn teacher-assign-btn" onClick={() => onAssign(teacher)}>
            <UserPlus size={16} />
            Assign
          </button>
          <button type="button" className="role-icon-square-btn" onClick={() => onEdit(teacher)} aria-label={`Edit ${fullName}`}>
            <Pencil size={16} />
          </button>
        </div>
      </div>

      <div className="teacher-card-assignment-block">
        <h5>Current Assignments:</h5>
        {teacher.assignments.length ? (
          <div className="teacher-assignment-list">
            {teacher.assignments.map((assignment) => (
              <AssignmentTag
                key={assignment.id}
                assignment={assignment}
                onRemove={(assignmentId) => onRemoveAssignment(teacher.id, assignmentId)}
              />
            ))}
          </div>
        ) : (
          <p className="role-muted teacher-card-empty">No class or subject assignments yet.</p>
        )}
      </div>
    </article>
  )
}

export default TeacherCard
